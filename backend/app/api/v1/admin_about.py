"""Owner-only About content endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...api.deps import csrf_protect, get_current_owner, get_db
from ...models.about import AboutContent
from ...models.auth import Owner
from ...schemas.about import AboutPublic, AboutUpdate

router = APIRouter(prefix="/admin/about", tags=["admin"])


@router.get("", response_model=AboutPublic, summary="Get About content (owner)")
def get_about_content(
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
) -> AboutContent:
    content = db.query(AboutContent).first()
    if content is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="About content not found")
    return content


@router.put("", response_model=AboutPublic, summary="Update About content (owner)")
def update_about_content(
    payload: AboutUpdate,
    owner: Owner = Depends(get_current_owner),
    db: Session = Depends(get_db),
    _: None = Depends(csrf_protect),
) -> AboutContent:
    content = db.query(AboutContent).first()
    if content is None:
        content = AboutContent(
            title=payload.title or "About",
            paragraphs=payload.paragraphs or [],
            facts=[fact.model_dump() for fact in payload.facts] if payload.facts is not None else [],
            is_published=payload.is_published if payload.is_published is not None else False,
        )
        db.add(content)
    else:
        if payload.title is not None:
            content.title = payload.title
        if payload.paragraphs is not None:
            content.paragraphs = payload.paragraphs
        if payload.facts is not None:
            content.facts = [fact.model_dump() for fact in payload.facts]
        if payload.is_published is not None:
            content.is_published = payload.is_published
    db.commit()
    db.refresh(content)
    return content