"""Public About content endpoint."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...api.deps import get_db
from ...models.about import AboutContent
from ...schemas.about import AboutPublic

router = APIRouter(prefix="/about", tags=["about"])


@router.get("", response_model=AboutPublic, summary="Published About content")
def get_about(db: Session = Depends(get_db)) -> AboutContent:
    content = db.scalar(select(AboutContent).where(AboutContent.is_published.is_(True)))
    if content is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="About content not found")
    return content