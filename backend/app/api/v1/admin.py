"""Owner-only admin endpoints.

`/admin/ping` is a demonstration of the owner gate + CSRF protection that every
future write endpoint will require. There is no editing functionality yet.
"""

from fastapi import APIRouter, Depends

from ...api.deps import csrf_protect, get_current_owner
from ...models.auth import Owner

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post(
    "/ping",
    response_model=dict[str, str],
    summary="Owner-only health check",
    dependencies=[Depends(csrf_protect)],
)
def admin_ping(owner: Owner = Depends(get_current_owner)) -> dict[str, str]:
    return {"ok": "true", "owner": owner.email}