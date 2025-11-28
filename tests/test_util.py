"""Unit tests for utility functions.

Tests for helper functions in the doughub2 package, particularly
the sanitization and parsing utilities used during extraction.
"""

from datetime import datetime
from unittest.mock import patch

from doughub2.api.extractions import parse_timestamp_for_path, sanitize_source_name


class TestSanitizeSourceName:
    """Tests for the sanitize_source_name function."""

    def test_replaces_spaces_with_underscores(self):
        """Spaces should be replaced with underscores."""
        result = sanitize_source_name("ACEP PeerPrep")
        assert result == "ACEP_PeerPrep"

    def test_replaces_special_characters_with_underscores(self):
        """Special characters should be replaced with underscores."""
        result = sanitize_source_name("Test@Name#With$Special")
        assert result == "Test_Name_With_Special"

    def test_handles_already_clean_names(self):
        """Names that are already clean should remain unchanged."""
        result = sanitize_source_name("AlreadyClean")
        assert result == "AlreadyClean"

    def test_preserves_hyphens(self):
        """Hyphens should be preserved in the name."""
        result = sanitize_source_name("Test-Name-With-Hyphens")
        assert result == "Test-Name-With-Hyphens"

    def test_preserves_numbers(self):
        """Numbers should be preserved in the name."""
        result = sanitize_source_name("MKSAP 19")
        assert result == "MKSAP_19"

    def test_removes_consecutive_underscores(self):
        """Consecutive underscores should be collapsed to a single underscore."""
        result = sanitize_source_name("Test   Multiple   Spaces")
        assert result == "Test_Multiple_Spaces"

    def test_strips_leading_underscores(self):
        """Leading underscores should be removed."""
        result = sanitize_source_name("  Leading Spaces")
        assert result == "Leading_Spaces"

    def test_strips_trailing_underscores(self):
        """Trailing underscores should be removed."""
        result = sanitize_source_name("Trailing Spaces  ")
        assert result == "Trailing_Spaces"

    def test_handles_mixed_invalid_characters(self):
        """Multiple types of invalid characters should all be handled."""
        result = sanitize_source_name("Test!@#$%^&*()Name")
        assert result == "Test_Name"


class TestParseTimestampForPath:
    """Tests for the parse_timestamp_for_path function."""

    def test_parses_valid_iso_timestamp(self):
        """Valid ISO timestamp should return correct year and month."""
        result = parse_timestamp_for_path("2025-11-27T14:50:33.000Z")
        assert result == ("2025", "11")

    def test_parses_timestamp_with_different_month(self):
        """Timestamp with single-digit month should return zero-padded month."""
        result = parse_timestamp_for_path("2024-03-15T10:30:00.000Z")
        assert result == ("2024", "03")

    def test_parses_timestamp_without_z_suffix(self):
        """Timestamp without Z suffix should still parse correctly."""
        result = parse_timestamp_for_path("2023-12-25T08:00:00+00:00")
        assert result == ("2023", "12")

    def test_none_timestamp_falls_back_to_current_date(self):
        """None timestamp should fallback to current year and month."""
        with patch("doughub2.api.extractions.datetime") as mock_datetime:
            mock_datetime.now.return_value = datetime(2025, 11, 27)
            mock_datetime.fromisoformat = datetime.fromisoformat
            result = parse_timestamp_for_path(None)
            assert result == ("2025", "11")

    def test_invalid_timestamp_falls_back_to_current_date(self):
        """Invalid timestamp should fallback to current year and month."""
        with patch("doughub2.api.extractions.datetime") as mock_datetime:
            mock_datetime.now.return_value = datetime(2025, 6, 15)
            mock_datetime.fromisoformat.side_effect = ValueError("Invalid format")
            result = parse_timestamp_for_path("not-a-valid-timestamp")
            assert result == ("2025", "06")

    def test_empty_string_falls_back_to_current_date(self):
        """Empty string timestamp should fallback to current year and month."""
        with patch("doughub2.api.extractions.datetime") as mock_datetime:
            mock_datetime.now.return_value = datetime(2025, 1, 5)
            mock_datetime.fromisoformat.side_effect = ValueError("Invalid format")
            result = parse_timestamp_for_path("")
            assert result == ("2025", "01")
