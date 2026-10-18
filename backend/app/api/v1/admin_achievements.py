"""Owner-only achievement management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...api.deps import csrf_protect, get_current_owner, get_db
from ...models.achievement import Achievement
from ...models.auth import Owner
from ...schemas.achievement import AchievementCreate, AchievementPublic, AchievementUpdate

router = APIRouter(prefix="/admin/achievements", tags=["admin"])
_WRITE = [Depends(csrf_protect)]


def _get(db, item_id):
    item = db.get(Achievement, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    return item


@router.get("", response_model=list[AchievementPublic])
def list_all(owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    return list(db.scalars(select(Achievement).order_by(Achievement.display_order, Achievement.id)).all())


@router.get("/{item_id}", response_model=AchievementPublic)
def get_one(item_id: str, owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    return _get(db, item_id)


@router.post("", response_model=AchievementPublic, status_code=status.HTTP_201_CREATED, dependencies=_WRITE)
def create(payload: AchievementCreate, owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    if db.get(Achievement, payload.id) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An achievement with this id already exists")
    item = Achievement(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=AchievementPublic, dependencies=_WRITE)
def update(item_id: str, payload: AchievementUpdate, owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    item = _get(db, item_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=_WRITE)
def delete(item_id: str, owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    item = _get(db, item_id)
    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{item_id}/publish", response_model=AchievementPublic, dependencies=_WRITE)
def publish(item_id: str, owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    item = _get(db, item_id)
    item.is_published = True
    db.commit()
    db.refresh(item)
    return item


@router.post("/{item_id}/unpublish", response_model=AchievementPublic, dependencies=_WRITE)
def unpublish(item_id: str, owner: Owner = Depends(get_current_owner), db: Session = Depends(get_db)):
    item = _get(db, item_id)
    item.is_published = False
    db.commit()
    db.refresh(item)
    return item