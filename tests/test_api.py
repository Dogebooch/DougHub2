"""
Tests for the DougHub2 Extraction API.

This module contains tests for the FastAPI application and
extraction endpoints.
"""

import pytest
from fastapi.testclient import TestClient

from doughub2.api.app import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI application."""
    return TestClient(app)


class TestRootEndpoint:
    """Tests for the root endpoint."""

    def test_root_returns_welcome_message(self, client):
        """Test that the root endpoint returns the expected welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "DougHub2 Extraction API"}


class TestExtractEndpoint:
    """Tests for the extraction endpoint."""

    def test_extract_echoes_url(self, client):
        """Test that the extract endpoint echoes the received URL."""
        test_url = "http://example.com"
        response = client.post("/extract", json={"url": test_url})
        assert response.status_code == 200
        assert response.json() == {"url": test_url}

    def test_extract_with_complex_url(self, client):
        """Test that the extract endpoint handles complex URLs."""
        test_url = "https://example.com/path/to/page?query=value&other=123"
        response = client.post("/extract", json={"url": test_url})
        assert response.status_code == 200
        assert response.json() == {"url": test_url}

    def test_extract_requires_url_field(self, client):
        """Test that the extract endpoint requires a URL field."""
        response = client.post("/extract", json={})
        assert response.status_code == 422  # Validation error

    def test_extract_rejects_invalid_json(self, client):
        """Test that the extract endpoint rejects invalid JSON."""
        response = client.post(
            "/extract",
            content="not json",
            headers={"Content-Type": "application/json"},
        )
        assert response.status_code == 422
