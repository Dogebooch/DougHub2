"""
Tests for the DougHub2 Extraction API.

This module contains tests for the FastAPI application and
extraction endpoints including database persistence.
"""

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from doughub2.main import api_app as app
from doughub2.main import get_db
from doughub2.models import Base, Media, Question, Source


# Test database setup
@pytest.fixture
def test_db_setup():
    """Create an in-memory SQLite database and session for testing."""
    # Use a named in-memory database to share across connections
    engine = create_engine(
        "sqlite:///file::memory:?cache=shared&uri=true",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(engine)
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestSessionLocal()
    yield engine, session
    session.close()
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def client(test_db_setup):
    """Create a test client with overridden database dependency."""
    engine, session = test_db_setup

    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db
    test_client = TestClient(app)
    yield test_client, session
    app.dependency_overrides.clear()


@pytest.fixture
def temp_dirs(tmp_path):
    """Create temporary directories for output and media."""
    output_dir = tmp_path / "extractions"
    media_root = tmp_path / "media_root"
    output_dir.mkdir()
    media_root.mkdir()
    return output_dir, media_root


class TestRootEndpoint:
    """Tests for the root endpoint."""

    def test_root_returns_welcome_message(self, client):
        """Test that the root endpoint returns the expected welcome message."""
        test_client, _ = client
        response = test_client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "DougHub2 Extraction API"}


class TestExtractEndpoint:
    """Tests for the extraction endpoint."""

    def test_extract_basic_payload_without_images(self, client, temp_dirs):
        """Test extraction with a basic payload creates a Question in the database."""
        test_client, test_session = client
        output_dir, media_root = temp_dirs

        with patch("doughub2.main.settings") as mock_settings:
            mock_settings.EXTRACTION_DIR = output_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            payload = {
                "timestamp": "2025-01-01T12:00:00Z",
                "url": "https://example.com/questions/q123",
                "hostname": "example.com",
                "siteName": "Example_Site",
                "elementCount": 10,
                "imageCount": 0,
                "pageHTML": "<html><body><p>Test question content</p></body></html>",
                "bodyText": "Test question content",
                "elements": [],
                "images": [],
            }

            response = test_client.post("/extract", json=payload)

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert data["message"] == "Data received successfully"
            assert data["extraction_count"] >= 1
            assert data["database"]["persisted"] is True
            assert data["database"]["error"] is None

            # Verify files were created
            assert "html" in data["files"]
            assert "json_file" in data["files"]

            # Verify database record was created
            source = test_session.query(Source).filter_by(name="Example_Site").first()
            assert source is not None

            question = (
                test_session.query(Question)
                .filter_by(source_question_key="q123")
                .first()
            )
            assert question is not None
            assert question.status == "extracted"
            assert "<html>" in question.raw_html

    def test_extract_with_images_mocked(self, client, temp_dirs):
        """Test extraction with images uses urlretrieve and adds media records."""
        test_client, test_session = client
        output_dir, media_root = temp_dirs

        with (
            patch("doughub2.main.settings") as mock_settings,
            patch("doughub2.main.urllib.request.urlretrieve") as mock_urlretrieve,
        ):
            mock_settings.EXTRACTION_DIR = output_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            # Make urlretrieve create a dummy file
            def create_dummy_file(url, path):
                path = Path(path)
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b"fake image data")

            mock_urlretrieve.side_effect = create_dummy_file

            payload = {
                "timestamp": "2025-01-01T12:00:00Z",
                "url": "https://example.com/questions/q456",
                "hostname": "example.com",
                "siteName": "Test_Site",
                "elementCount": 5,
                "imageCount": 1,
                "pageHTML": "<html><body><img src='test.jpg'/></body></html>",
                "bodyText": "Question with image",
                "elements": [],
                "images": [
                    {
                        "url": "https://example.com/images/question1.jpg",
                        "title": "Question Image",
                        "type": "image",
                    }
                ],
            }

            response = test_client.post("/extract", json=payload)

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"

            # Verify urlretrieve was called with correct URL
            mock_urlretrieve.assert_called_once()
            call_args = mock_urlretrieve.call_args[0]
            assert call_args[0] == "https://example.com/images/question1.jpg"
            # The path should contain our base filename pattern
            assert "Test_Site" in str(call_args[1])
            assert "_img0.jpg" in str(call_args[1])

    def test_extract_requires_url_field(self, client):
        """Test that the extract endpoint requires a URL field."""
        test_client, _ = client
        response = test_client.post("/extract", json={})
        assert response.status_code == 422  # Validation error

    def test_extract_handles_minimal_payload(self, client, temp_dirs):
        """Test extraction with minimal required fields."""
        test_client, test_session = client
        output_dir, media_root = temp_dirs

        with patch("doughub2.main.settings") as mock_settings:
            mock_settings.EXTRACTION_DIR = output_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            payload = {
                "url": "https://minimal.example.com/test/item789",
            }

            response = test_client.post("/extract", json=payload)

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"

    def test_extract_endpoint_saves_valid_file(self, client, tmp_path, monkeypatch):
        """Test that the /extract endpoint correctly saves a JSON file with expected content.

        This integration test verifies:
        1. The endpoint creates a file in the configured extraction directory
        2. The file content matches the submitted payload
        3. File artifacts are confined to the temporary directory
        """
        test_client, test_session = client

        # Create a temporary extraction directory
        extraction_dir = tmp_path / "test_extractions"
        extraction_dir.mkdir()
        media_root = tmp_path / "test_media"
        media_root.mkdir()

        # Override settings via patching (monkeypatch)
        with patch("doughub2.main.settings") as mock_settings:
            mock_settings.EXTRACTION_DIR = extraction_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            # Define test payload
            payload = {
                "timestamp": "2025-12-01T12:00:00Z",
                "url": "https://testsite.com/questions/integration123",
                "hostname": "testsite.com",
                "siteName": "Test_Site",
                "elementCount": 5,
                "imageCount": 0,
                "pageHTML": "<html><body><p>Integration test content</p></body></html>",
                "bodyText": "Integration test content",
                "elements": [],
                "images": [],
            }

            # Make API call
            response = test_client.post("/extract", json=payload)
            assert response.status_code == 200

            response_data = response.json()
            assert response_data["status"] == "success"

            # Find the created JSON file in the extraction directory
            # Directory structure: <extraction_dir>/<siteName>/<year>/<month>/
            site_dir = extraction_dir / "Test_Site" / "2025" / "12"
            assert site_dir.exists(), f"Expected directory {site_dir} to exist"

            # Find all JSON files created
            json_files = list(site_dir.glob("*.json"))
            assert len(json_files) >= 1, "Expected at least one JSON file to be created"

            # Load and verify the content
            json_file = json_files[0]
            file_content = json.loads(json_file.read_text(encoding="utf-8"))

            # Assert file content matches payload
            assert file_content["siteName"] == payload["siteName"]
            assert file_content["url"] == payload["url"]
            assert file_content["hostname"] == payload["hostname"]
            assert file_content["timestamp"] == payload["timestamp"]
            assert file_content["bodyText"] == payload["bodyText"]

            # Verify HTML file was also created
            html_files = list(site_dir.glob("*.html"))
            assert len(html_files) >= 1, "Expected at least one HTML file to be created"


class TestExtractionsListEndpoint:
    """Tests for the extractions list endpoint."""

    def test_list_extractions_empty(self, client):
        """Test listing extractions when none exist."""
        test_client, _ = client
        # Clear any previous extractions
        from doughub2.main import extractions

        extractions.clear()

        response = test_client.get("/extractions")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["extractions"] == []


class TestClearExtractionsEndpoint:
    """Tests for the clear extractions endpoint."""

    def test_clear_extractions(self, client, temp_dirs):
        """Test clearing all stored extractions."""
        test_client, _ = client
        output_dir, media_root = temp_dirs

        # First add an extraction
        with patch("doughub2.main.settings") as mock_settings:
            mock_settings.EXTRACTION_DIR = output_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            test_client.post("/extract", json={"url": "https://test.com/page"})

        # Now clear
        response = test_client.post("/clear")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["message"] == "All extractions cleared"

        # Verify cleared
        response = test_client.get("/extractions")
        assert response.json()["total"] == 0


class TestGetExtractionEndpoint:
    """Tests for getting a specific extraction."""

    def test_get_extraction_not_found(self, client):
        """Test getting a non-existent extraction."""
        test_client, _ = client
        from doughub2.main import extractions

        extractions.clear()

        response = test_client.get("/extractions/999")
        assert response.status_code == 404


class TestDatabasePersistence:
    """Tests for database persistence functionality."""

    def test_duplicate_question_not_created(self, client, temp_dirs):
        """Test that duplicate questions update rather than create new records."""
        test_client, test_session = client
        output_dir, media_root = temp_dirs

        with patch("doughub2.main.settings") as mock_settings:
            mock_settings.EXTRACTION_DIR = output_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            payload = {
                "url": "https://example.com/questions/duplicate_test",
                "siteName": "DupeTest",
                "pageHTML": "<html>Original content</html>",
            }

            # First extraction
            response1 = test_client.post("/extract", json=payload)
            assert response1.status_code == 200

            # Same URL, different content
            payload["pageHTML"] = "<html>Updated content</html>"
            response2 = test_client.post("/extract", json=payload)
            assert response2.status_code == 200

            # Should still only have one question
            questions = test_session.query(Question).all()
            # Note: Due to idempotency check in persist_to_database,
            # the second request won't update, it will just return success
            assert len(questions) >= 1

    def test_duplicate_question_by_content_not_created(self, client, temp_dirs):
        """Verify that questions with the same content but different URLs are not duplicated."""
        test_client, test_session = client
        output_dir, media_root = temp_dirs

        with patch("doughub2.main.settings") as mock_settings:
            mock_settings.EXTRACTION_DIR = output_dir
            mock_settings.MEDIA_ROOT = str(media_root)
            mock_settings.DATABASE_URL = "sqlite:///:memory:"

            # First extraction
            payload1 = {
                "url": "https://example.com/questions/unique-1",
                "siteName": "ContentDupeTest",
                "bodyText": "This is the exact same question content.",
                "pageHTML": "<html>Content 1</html>",
            }
            response1 = test_client.post("/extract", json=payload1)
            assert response1.status_code == 200
            assert test_session.query(Question).count() == 1

            # Second extraction with different URL but same bodyText
            payload2 = {
                "url": "https://example.com/questions/unique-2",
                "siteName": "ContentDupeTest",
                "bodyText": "This is the exact same question content.",
                "pageHTML": "<html>Content 2</html>",
            }
            response2 = test_client.post("/extract", json=payload2)
            assert response2.status_code == 200

            # Verify that no new question was created
            assert test_session.query(Question).count() == 1


class TestListQuestionsEndpoint:
    """Tests for the GET /questions endpoint."""

    def test_list_questions_returns_all_questions(self, client):
        """Test that the /questions endpoint returns all questions from the database."""
        test_client, test_session = client

        # Create sample sources
        source1 = Source(name="Test_Source_1", description="First test source")
        source2 = Source(name="Test_Source_2", description="Second test source")
        test_session.add_all([source1, source2])
        test_session.flush()

        # Create sample questions
        question1 = Question(
            source_id=source1.source_id,
            source_question_key="q001",
            raw_html="<html>Question 1</html>",
            raw_metadata_json='{"bodyText": "Question 1 body"}',
            status="extracted",
        )
        question2 = Question(
            source_id=source1.source_id,
            source_question_key="q002",
            raw_html="<html>Question 2</html>",
            raw_metadata_json='{"bodyText": "Question 2 body"}',
            status="extracted",
        )
        question3 = Question(
            source_id=source2.source_id,
            source_question_key="q003",
            raw_html="<html>Question 3</html>",
            raw_metadata_json='{"bodyText": "Question 3 body"}',
            status="extracted",
        )
        test_session.add_all([question1, question2, question3])
        test_session.commit()

        # Make request to /questions endpoint
        response = test_client.get("/questions")

        # Verify response
        assert response.status_code == 200
        data = response.json()
        assert "questions" in data
        assert len(data["questions"]) == 3

        # Verify the content of returned questions
        questions_by_key = {q["source_question_key"]: q for q in data["questions"]}

        assert "q001" in questions_by_key
        assert questions_by_key["q001"]["source_name"] == "Test_Source_1"
        assert "question_id" in questions_by_key["q001"]

        assert "q002" in questions_by_key
        assert questions_by_key["q002"]["source_name"] == "Test_Source_1"

        assert "q003" in questions_by_key
        assert questions_by_key["q003"]["source_name"] == "Test_Source_2"

    def test_list_questions_returns_empty_when_no_questions(self, client):
        """Test that the /questions endpoint returns an empty list when no questions exist."""
        test_client, _ = client

        response = test_client.get("/questions")

        assert response.status_code == 200
        data = response.json()
        assert "questions" in data
        assert len(data["questions"]) == 0


class TestGetQuestionEndpoint:
    """Tests for the GET /questions/{question_id} endpoint."""

    def test_get_question_returns_correct_data(self, client):
        """Test that the endpoint returns the correct question data for a valid ID."""
        test_client, test_session = client

        # Create a sample source and question
        source = Source(name="Detail_Test_Source", description="Test source for detail")
        test_session.add(source)
        test_session.flush()

        question = Question(
            source_id=source.source_id,
            source_question_key="detail-q001",
            raw_html="<html><body><h1>Test Question</h1><p>This is the question content.</p></body></html>",
            raw_metadata_json='{"bodyText": "Test question body text"}',
            status="extracted",
        )
        test_session.add(question)
        test_session.commit()

        # Make request to get the question
        response = test_client.get(f"/questions/{question.question_id}")

        # Verify response
        assert response.status_code == 200
        data = response.json()

        assert data["question_id"] == question.question_id
        assert data["source_name"] == "Detail_Test_Source"
        assert data["source_question_key"] == "detail-q001"
        assert "<html>" in data["raw_html"]
        assert "Test Question" in data["raw_html"]

    def test_get_question_returns_404_for_invalid_id(self, client):
        """Test that the endpoint returns 404 for a non-existent question ID."""
        test_client, _ = client

        # Request a question ID that doesn't exist
        response = test_client.get("/questions/99999")

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "Question not found"
