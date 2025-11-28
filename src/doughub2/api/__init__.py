"""
DougHub2 API Routers Package.

This package contains the FastAPI routers for the application endpoints.
"""

from doughub2.api.extractions import router as extractions_router
from doughub2.api.questions import router as questions_router

__all__ = ["questions_router", "extractions_router"]
