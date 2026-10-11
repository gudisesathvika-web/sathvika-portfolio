"""Version 1 API router."""

from fastapi import APIRouter

from .admin import router as admin_router
from .admin_projects import router as admin_projects_router
from .auth import router as auth_router
from .contact import router as contact_router
from .health import router as health_router
from .projects import router as projects_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(projects_router, tags=["projects"])
api_router.include_router(contact_router)
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(admin_projects_router)