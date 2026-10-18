"""Public achievements endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...api.deps import get_db
from ...models.achievement import Achievement
from ...schemas.achievement import AchievementPublic

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("", response_model=list[AchievementPublic], summary="Published achievements")
def list_achievements(db: Session = Depends(get_db)) -> list[Achievement]:
    stmt = select(Achievement).where(Achievement.is_published.is_(True)).order_by(Achievement.display_order, Achievement.id)
    return list(db.scalars(stmt).all())