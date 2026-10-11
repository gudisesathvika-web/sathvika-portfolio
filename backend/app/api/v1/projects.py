"""Public, read-only project endpoints. Only published projects are returned."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...api.deps import get_db
from ...models.project import Project
from ...schemas.project import ProjectPublic

router = APIRouter()


@router.get(
    "/projects",
    response_model=list[ProjectPublic],
    summary="List published projects",
)
def list_published_projects(db: Session = Depends(get_db)) -> list[Project]:
    stmt = select(Project).where(Project.is_published.is_(True)).order_by(Project.title)
    return list(db.scalars(stmt).all())
