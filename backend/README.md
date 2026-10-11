# Portfolio backend — FastAPI API (Phase 3 + 4 + 5)

A small FastAPI service that serves published portfolio content and provides
owner-only authentication and project management. Phase 5 adds the owner-only
project CRUD + publish/unpublish API backing the admin dashboard.

**Bounds of this phase:** no skills/experience/achievement editing, no
password-reset **email** delivery, no contact delivery, no deployment. The
public endpoint stays read-only (published projects only).

## Requirements

- Python 3.11+
- PostgreSQL (for real use; tests use in-memory SQLite and need no database)

## Setup

From the `backend/` directory:

```bash
python -m venv .venv
# Windows (Git Bash): source .venv/Scripts/activate
# macOS/Linux:        source .venv/bin/activate
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env   # then edit DATABASE_URL
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
# → http://127.0.0.1:8000/docs
```

## Database migrations (Alembic)

`DATABASE_URL` is read from the environment (or `.env`). Example URL:

```
postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME
```

```bash
alembic upgrade head        # apply migrations
alembic revision --autogenerate -m "message"   # create a new migration
```

Migrations: `0001_create_projects` creates `projects`; `0002_owners_sessions`
creates `owners` and `auth_sessions` (called `0002` in `alembic/versions`).

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `APP_NAME` | Service name | `Sathvika Portfolio API` |
| `APP_ENV` | Environment label | `development` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `DATABASE_URL` | SQLAlchemy PostgreSQL URL | local `portfolio` DB |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://127.0.0.1:5173,http://localhost:5173` |
| `SESSION_MAX_AGE_SECONDS` | Session cookie lifetime | `43200` (12h) |
| `COOKIE_SECURE` | Secure flag on cookies | `false` |
| `COOKIE_SAMESITE` | SameSite on cookies | `lax` |
| `LOGIN_RATE_LIMIT_MAX_ATTEMPTS` | Failed logins before blocking | `5` |
| `LOGIN_RATE_LIMIT_WINDOW_SECONDS` | Rate-limit window | `900` (15m) |

No credentials are hardcoded and none are logged.

## API

Base prefix: `/api/v1`

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Liveness; returns status/service/version/environment (no secrets) |
| GET | `/api/v1/projects` | **Published projects only**, alphabetical by title |
| POST | `/api/v1/auth/login` | Owner login (sets HttpOnly session + CSRF cookies) |
| GET | `/api/v1/auth/me` | Current owner, or 401 |
| POST | `/api/v1/auth/logout` | Logout (CSRF required); invalidates the session |
| POST | `/api/v1/admin/ping` | Owner-only demo endpoint (CSRF required, 401 without a valid session) |
| GET | `/api/v1/admin/projects` | All projects incl. drafts (owner session required, no CSRF) |
| GET | `/api/v1/admin/projects/{id}` | One project incl. drafts (owner session required) |
| POST | `/api/v1/admin/projects` | Create a project (draft by default; CSRF required; 409 on duplicate id) |
| PATCH | `/api/v1/admin/projects/{id}` | Partial update (CSRF required; 404 if missing) |
| DELETE | `/api/v1/admin/projects/{id}` | Delete a project (CSRF required; 204) |
| POST | `/api/v1/admin/projects/{id}/publish` | Publish a project (CSRF required) |
| POST | `/api/v1/admin/projects/{id}/unpublish` | Unpublish a project (CSRF required) |

`PATCH`/`DELETE` are included in the CORS allow-methods so credentialed
cross-origin write requests work in production. Drafts are never returned by
the public endpoint and never appear in error responses.

Errors use a consistent envelope:

```json
{ "error": { "code": 404, "message": "...", "request_id": "..." } }
```

## Authentication design (Phase 4)

- **No public registration.** One owner account, created once on the CLI.
- **Passwords** are hashed with bcrypt (`pwdlib`); plaintext is never stored.
- **Sessions** are opaque `secrets.token_urlsafe` tokens in an HttpOnly,
  SameSite cookie. Only the SHA-256 hash of the token is stored
  (`auth_sessions` table). The CSRF cookie is not HttpOnly so the frontend can
  echo it back; the frontend never stores anything in `localStorage`.
- **CSRF**: double-submit cookie — state-changing requests must send the CSRF
  cookie value in the `X-CSRF-Token` header, enforced for logout and
  `/admin/ping`.
- **Login errors** are generic ("Invalid email or password"), never revealing
  whether an account exists, and unknown-email lookups run a dummy bcrypt
  verify to equalize timing.
- **Rate limiting**: in-memory sliding window on login (5 attempts / 15 min by
  client IP). In-memory means per-process; document a shared store or proxy
  enforcement if you run multiple instances.

### Create the owner (one time)

```bash
ADMIN_EMAIL='you@example.com' ADMIN_PASSWORD='a-very-long-password' \
  python -m app.scripts.create_owner
```

The command fails safely (no DB write) and prints whether the owner already
exists. Never commit the password or a `.env` with it.

### Password reset (pending)

Email delivery is **not implemented**. Do not fake a reset. As a safe recovery
procedure, re-run `create_owner` is **not** used for resets — instead, rotate
the password by updating the row's `password_hash` after hashing with the same
CLI path, or use a future dedicated tool. This is documented as pending until a
real email channel exists.

### Production cookie/CORS settings

The frontend and backend may be on separate origins. For credentialed
cross-site requests you **must** set:

- `CORS_ORIGINS` to the exact frontend origin,
- `COOKIE_SECURE=true`,
- `COOKIE_SAMESITE=none`.

Local development avoids this by using the Vite dev proxy (same-origin), where
`COOKIE_SECURE=false` and `COOKIE_SAMESITE=lax` are correct.

## Tests

```bash
python -m pytest -q
```

Tests cover: health response, no config leakage, published-only filtering,
empty database, structured 404, schema validation, the auth suite (login,
generic-error indistinguishability, session cookie flow, logout invalidation,
CSRF enforcement, rate limiting, and expired sessions), and the owner project
management suite (anonymous writes rejected, CSRF enforcement on every write,
draft isolation from the public endpoint, publish/unpublish visibility,
create/update/delete, duplicate-id conflict, and validation). They use
in-memory SQLite and do **not** require PostgreSQL.

## Verification status (Phase 8)

- `python -m pytest -q` → **39 passed** (SQLite, no DB required).
- Phase 8 adds the admin case-study editor (list sections, users, links with
  add/remove + client-side link validation) and a round-trip test:
  create→edit→publish→public-read for structured sections (untouched sections
  survive partial updates, draft content never leaks).
- API/schemas/migration/seed/render from Phase 7 are unchanged functionally;
  the form now writes those fields end-to-end.
- `alembic upgrade head --sql` still compiles offline for PostgreSQL with the
  same safe defaults (migration chain `0001 → 0002_owners_sessions → 0003`).
- **Not performed:** live PostgreSQL migrations/CRUD, or browser automation
  for the editor UI (tested via types/lint/build + API round-trip only).

## Not implemented yet

Skills/experience/achievement editing, password-reset email delivery,
contact-form delivery, production deployment, and any write endpoints beyond
the owner project-management foundation.

## Free-tier PostgreSQL notes

Any persistent PostgreSQL provider with a free tier works (for example Neon,
Supabase, or Render's free Postgres). Use its pooled connection string as
`DATABASE_URL`. Do not point the production store at an expiring/temporary
database. Provider-specific steps still required: **create the database, copy
its connection string into `DATABASE_URL`, and run `alembic upgrade head`.**
