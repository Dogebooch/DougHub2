"""
DougHub2 Questions API Router.

This module contains the endpoints for managing questions.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from doughub2.database import get_db
from doughub2.persistence import QuestionRepository
from doughub2.schemas import (
    QuestionDetailResponse,
    QuestionInfo,
    QuestionListResponse,
)

router = APIRouter(tags=["questions"])


@router.get("/questions", response_model=QuestionListResponse)
async def list_questions(db: Session = Depends(get_db)) -> QuestionListResponse:
    """
    Retrieve a list of all extracted questions.

    Returns:
        A list of questions with their ID, source name, and source key.
    """
    repo = QuestionRepository(db)
    questions = repo.get_all_questions()

    question_infos = [
        QuestionInfo(
            question_id=int(q.question_id),  # type: ignore[arg-type]
            source_name=str(q.source.name),  # type: ignore[arg-type]
            source_question_key=str(q.source_question_key),  # type: ignore[arg-type]
        )
        for q in questions
    ]

    return QuestionListResponse(questions=question_infos)


@router.get("/questions/{question_id}", response_model=QuestionDetailResponse)
async def get_question(
    question_id: int, db: Session = Depends(get_db)
) -> QuestionDetailResponse:
    """
    Retrieve the full details of a single question by its ID.

    Args:
        question_id: The ID of the question to retrieve.
        db: Database session (injected).

    Returns:
        QuestionDetailResponse with the question's full details.

    Raises:
        HTTPException: 404 if the question is not found.
    """
    repo = QuestionRepository(db)
    question = repo.get_question_by_id(question_id)

    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    return QuestionDetailResponse(
        question_id=int(question.question_id),  # type: ignore[arg-type]
        source_name=str(question.source.name),  # type: ignore[arg-type]
        source_question_key=str(question.source_question_key),  # type: ignore[arg-type]
        raw_html=str(question.raw_html),  # type: ignore[arg-type]
    )
