"""Data models for question persistence.

This module contains SQLAlchemy models for the question extraction feature.
"""

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass


class Source(Base):
    """Represents a question source (e.g., MKSAP, Peerprep).

    Attributes:
        source_id: Primary key.
        name: Unique name of the source.
        description: Optional description of the source.
        questions: Relationship to associated questions.
    """

    __tablename__ = "sources"

    source_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    questions = relationship(
        "Question", back_populates="source", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Source(id={self.source_id}, name='{self.name}')>"


class Question(Base):
    """Represents an extracted question.

    Attributes:
        question_id: Primary key.
        source_id: Foreign key to Source.
        source_question_key: Unique key within the source (for idempotency).
        raw_html: The raw HTML content of the question.
        raw_metadata_json: JSON metadata as a string.
        status: Status of the question (e.g., 'extracted', 'processed').
        extraction_path: Original file path where the question was extracted.
        created_at: Timestamp when the record was created.
        updated_at: Timestamp when the record was last updated.
        source: Relationship to the Source.
        media: Relationship to associated Media files.
    """

    __tablename__ = "questions"
    __table_args__ = (
        UniqueConstraint("source_id", "source_question_key", name="uq_source_question"),
    )

    question_id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(
        Integer, ForeignKey("sources.source_id"), nullable=False, index=True
    )
    source_question_key = Column(String(255), nullable=False, index=True)
    raw_html = Column(Text, nullable=False)
    raw_metadata_json = Column(Text, nullable=False)
    status = Column(String(50), default="extracted", nullable=False)
    extraction_path = Column(String(512), nullable=True)
    note_path: Mapped[str | None] = mapped_column(String, nullable=True)
    tags: Mapped[str | None] = mapped_column(String, nullable=True)
    state: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    source = relationship("Source", back_populates="questions")
    media = relationship(
        "Media", back_populates="question", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Question(id={self.question_id}, source_key='{self.source_question_key}', status='{self.status}')>"


class Media(Base):
    """Represents a media file associated with a question.

    Attributes:
        media_id: Primary key.
        question_id: Foreign key to Question.
        media_role: Role of the media (e.g., 'image', 'audio').
        media_type: Type/subtype (e.g., 'question_image', 'explanation_image').
        mime_type: MIME type (e.g., 'image/jpeg').
        relative_path: Path to the media file relative to MEDIA_ROOT.
        question: Relationship to the Question.
    """

    __tablename__ = "media"

    media_id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(
        Integer, ForeignKey("questions.question_id"), nullable=False, index=True
    )
    media_role = Column(String(50), nullable=False)
    media_type = Column(String(100), nullable=True)
    mime_type = Column(String(100), nullable=False)
    relative_path = Column(String(512), nullable=False)

    # Relationships
    question = relationship("Question", back_populates="media")

    def __repr__(self) -> str:
        return f"<Media(id={self.media_id}, role='{self.media_role}', path='{self.relative_path}')>"


class Log(Base):
    """Represents a log entry persisted to the database.

    Attributes:
        log_id: Primary key.
        level: Log level (e.g., 'INFO', 'WARNING', 'ERROR').
        logger_name: Name of the logger that created this entry.
        message: The log message content.
        timestamp: When the log was created.
    """

    __tablename__ = "logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    level = Column(String(20), nullable=False, index=True)
    logger_name = Column(String(255), nullable=False, index=True)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)

    def __repr__(self) -> str:
        return f"<Log(id={self.log_id}, level='{self.level}', logger='{self.logger_name}')>"
