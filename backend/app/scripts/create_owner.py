"""One-time owner account creation (CLI).

Usage (from `backend/`):

    python -m venv .venv && source .venv/Scripts/activate
    pip install -r requirements.txt
    ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' python -m app.scripts.create_owner

Or pass flags explicitly:

    python -m app.scripts.create_owner --email you@example.com --password 'a-strong-password'

The password is hashed with bcrypt and never stored in plaintext. Credentials
must never be committed; prefer environment variables.
"""

import argparse
import os
import sys

from sqlalchemy import select

from ..core.security import hash_password
from ..database import SessionLocal
from ..models.auth import Owner


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create the owner account (one time).")
    parser.add_argument(
        "--email",
        default=os.environ.get("ADMIN_EMAIL", ""),
        help="Owner email (or set ADMIN_EMAIL).",
    )
    parser.add_argument(
        "--password",
        default=os.environ.get("ADMIN_PASSWORD", ""),
        help="Owner password (or set ADMIN_PASSWORD). Never commit it.",
    )
    return parser.parse_args()


def create_owner(email: str, password: str) -> str:
    email = email.lower().strip()
    with SessionLocal() as db:
        existing = db.scalar(select(Owner).where(Owner.email == email))
        if existing is not None:
            return "exists"
        db.add(Owner(email=email, password_hash=hash_password(password)))
        db.commit()
    return "created"


def main() -> int:
    args = _parse_args()
    if not args.email or not args.password:
        print(
            "Provide --email and --password (or set ADMIN_EMAIL/ADMIN_PASSWORD).",
            file=sys.stderr,
        )
        return 2
    result = create_owner(args.email, args.password)
    if result == "exists":
        print(f"Owner already exists for {args.email}; nothing changed.")
        return 1
    print(f"Owner created: {args.email}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())