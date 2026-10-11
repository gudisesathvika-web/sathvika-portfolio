"""Owner-only project management endpoints.

Every write operation requires a valid owner session (get_current_owner) and a
valid CSRF token (csrf_protect). Drafts are stored with `is_published=False`;
the public `/api/v1/projects` endpoint never reads them, so drafts cannot leak
through public listings or admin error responses.
"""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...api.deps import csrf_protect, get_current_owner, get_db
from ...models.auth import Owner
from ...models.project import Project
from ...schemas.project import ProjectCreate, ProjectPublic, ProjectUpdate

router = APIRouter(prefix="/admin/projects", tags=["admin"])

_WRITE_DEPENDENCIES = [Depends(csrf_protect)]


def _get_project_or_404(db: Session, project_id: str) -> Project:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.get("", response_model=list[ProjectPublic], summary="List all projects (owner)")
def list_all_projects(
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> list[Project]:
    stmt = select(Project).order_by(Project.is_published.desc(), Project.title)
    return list(db.scalars(stmt).all())


@router.get(
    "/{project_id}",
    response_model=ProjectPublic,
    summary="Get one project, drafts included (owner)",
)
def get_project(
    project_id: str,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> Project:
    return _get_project_or_404(db, project_id)


@router.post(
    "",
    response_model=ProjectPublic,
    status_code=status.HTTP_201_CREATED,
    dependencies=_WRITE_DEPENDENCIES,
    summary="Create a project (draft by default)",
)
def create_project(
    payload: ProjectCreate,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> Project:
    if db.get(Project, payload.id) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="A project with this id already exists"
        )
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.patch(
    "/{project_id}",
    response_model=ProjectPublic,
    dependencies=_WRITE_DEPENDENCIES,
    summary="Update a project (partial)",
)
def update_project(
    project_id: str,
    payload: ProjectUpdate,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> Project:
    project = _get_project_or_404(db, project_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "stack" and value is None:
            value = []
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=_WRITE_DEPENDENCIES,
    summary="Delete a project",
)
def delete_project(
    project_id: str,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> Response:
    project = _get_project_or_404(db, project_id)
    db.delete(project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{project_id}/publish",
    response_model=ProjectPublic,
    dependencies=_WRITE_DEPENDENCIES,
    summary="Publish a project",
)
def publish_project(
    project_id: str,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> Project:
    project = _get_project_or_404(db, project_id)
    project.is_published = True
    db.commit()
    db.refresh(project)
    return project


@router.post(
    "/{project_id}/unpublish",
    response_model=ProjectPublic,
    dependencies=_WRITE_DEPENDENCIES,
    summary="Unpublish a project",
)
def unpublish_project(
    project_id: str,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> Project:
    project = _get_project_or_404(db, project_id)
    project.is_published = False
    db.commit()
    db.refresh(project)
    return project