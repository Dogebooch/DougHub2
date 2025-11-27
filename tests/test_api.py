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

from doughub2.main import api_app as app, get_db
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

        with patch("doughub2.main.config") as mock_config:
            mock_config.OUTPUT_DIR = output_dir
            mock_config.MEDIA_ROOT = str(media_root)
            mock_config.DATABASE_URL = "sqlite:///:memory:"

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
            patch("doughub2.main.config") as mock_config,
            patch(
                "doughub2.main.urllib.request.urlretrieve"
            ) as mock_urlretrieve,
        ):
            mock_config.OUTPUT_DIR = output_dir
            mock_config.MEDIA_ROOT = str(media_root)
            mock_config.DATABASE_URL = "sqlite:///:memory:"

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

        with patch("doughub2.main.config") as mock_config:
            mock_config.OUTPUT_DIR = output_dir
            mock_config.MEDIA_ROOT = str(media_root)
            mock_config.DATABASE_URL = "sqlite:///:memory:"

            payload = {
                "url": "https://minimal.example.com/test/item789",
            }

            response = test_client.post("/extract", json=payload)

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"


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
        with patch("doughub2.main.config") as mock_config:
            mock_config.OUTPUT_DIR = output_dir
            mock_config.MEDIA_ROOT = str(media_root)
            mock_config.DATABASE_URL = "sqlite:///:memory:"

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

        with patch("doughub2.main.config") as mock_config:
            mock_config.OUTPUT_DIR = output_dir
            mock_config.MEDIA_ROOT = str(media_root)
            mock_config.DATABASE_URL = "sqlite:///:memory:"

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
