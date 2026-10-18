"""Import existing portfolio projects into the admin database (idempotent).

Usage (from `backend/`):

    python -m app.scripts.import_portfolio_projects --source ../../projects-export.json

Behavior:
- Imports only projects whose slug/id is not already present.
- Existing records are never overwritten or republished.
- Imported projects are created as drafts (is_published=False).
- No project details, metrics, links, or outcomes are invented.
"""

import argparse
import json
import os
from pathlib import Path

from app.database import SessionLocal
from app.models.project import Project


def _map_project(item: dict) -> dict:
    return {
        "id": item["id"],
        "title": item["title"],
        "direction": item["direction"],
        "summary": item["summary"],
        "stack": list(item.get("stack", [])),
        "problem": list(item.get("problem", [])),
        "users": item.get("users", "") or "",
        "solution": list(item.get("solution", [])),
        "my_contribution": list(item.get("myContribution", [])),
        "stack_detail": list(item.get("stackDetailed", [])),
        "architecture": list(item.get("architecture", [])),
        "challenges": list(item.get("challenges", [])),
        "outcomes": list(item.get("outcomes", [])),
        "links": list(item.get("links", [])),
        "is_published": False,
    }


def import_projects(source: str) -> dict[str, int]:
    data = json.loads(Path(source).read_text(encoding="utf-8"))
    created = 0
    skipped = 0
    with SessionLocal() as db:
        for item in data:
            if db.get(Project, item["id"]) is not None:
                skipped += 1
                continue
            db.add(Project(**_map_project(item)))
            created += 1
        db.commit()
    return {"created": created, "skipped": skipped}


def main() -> int:
    parser = argparse.ArgumentParser(description="Import portfolio projects into admin database")
    parser.add_argument("--source", default=os.environ.get("PROJECTS_SOURCE", "../../projects-export.json"))
    args = parser.parse_args()
    result = import_projects(args.source)
    print(f"Import complete: {result['created']} created, {result['skipped']} skipped (already existed).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
