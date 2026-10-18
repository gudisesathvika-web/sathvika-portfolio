# PROJECT_STATUS.md

## What this is

Status / handoff file for the Sathvika Gudise AI-engineering portfolio. Updated throughout development so a later session can continue cleanly.

## Current phase

**Phase 15 — PostgreSQL configuration/preflight (documentation only; no provisioning performed).**
Phases 1–14 complete. Phase 15 inspected database configuration/migrations/seed
scripts, assessed free-tier provider limits (Neon), confirmed no PostgreSQL
credentials exist locally, and documented safe setup steps. **No database was
provisioned and no real PostgreSQL migrations were run** in this environment.

## DB configuration (inspected)

- `backend/app/config.py`: reads `DATABASE_URL` from env (defaults to local
  example). Driver is `psycopg` (v3) per `requirements.txt` (`psycopg[binary]`)
  and SQLAlchemy URL uses `postgresql+psycopg://...` in config/example — matches
  app's `database_url` default and Alembic setup.
- `backend/alembic/env.py`: sets URL from app settings (`get_settings().database_url`); models imported so metadata is complete. Offline/online modes supported.
- `backend/alembic.ini`: URL left empty (sourced from env). Migration chain
  `0001→0002→0003` compiles offline.
- `backend/app/database.py`: `create_engine(settings.database_url, pool_pre_ping=True, future=True)` — lazy, safe to import without live DB.
- Scripts: `create_owner.py` reads `ADMIN_EMAIL`/`ADMIN_PASSWORD` from env or
  flags; `seed_projects.py` uses `SessionLocal` and is idempotent (backfills
  empty sections only). Both safe to run against a verified target DB.

## PostgreSQL provider (free-tier assessment)

**Neon Free tier (current typical characteristics; subject to change):**
- Compute auto-scales to zero on inactivity (sleep-on-idle) → cold starts; not
  assumed always-on. Connection limits apply; suitable for dev/small traffic
  but behavior varies.
- 10 GB storage, branching available, no fixed long-term paid commitment on
  free tier. Still a third-party service with evolving terms.
- Not provisioned here. No credentials created or committed.

Other options considered: Supabase (free), Render (free Postgres has
constraints; avoid expiring DBs for long-term persistence). Documented but not
selected/provisioned.

## Credentials & safety

- No `.env` files with real secrets found (only `.env.example`). No
  `*.sqlite3`. `.gitignore` prevents committing secrets/DB files.
- `DATABASE_URL` in examples uses placeholder local URL; no real connection
  strings in repo or docs beyond examples. No credentials printed/stored.

## Setup steps (documented, NOT executed)

If provisioning a persistent free-tier PostgreSQL:
1. Create account on chosen provider (Neon/Supabase/Render free). Do not enable
   paid features.
2. Create a new database/project; copy the **pooled/standard** PostgreSQL
   connection string (must use `psycopg` driver: `postgresql+psycopg://...`).
3. Create/ensure `backend/.env` (ignored) with `DATABASE_URL=<connection_string>`,
   production CORS/cookies, and contact settings (or `mock`). Never commit it.
4. From `backend/`: `alembic upgrade head` (runs against real DB). Verify
   tables created (projects, owners, auth_sessions) and columns from 0003.
5. Optional: `python -m app.scripts.create_owner --email ... --password ...`
   (env vars preferred). `python -m app.scripts.seed_projects` (idempotent).
6. Smoke test: connect, query published projects, auth flows. Do **not** assume
   SQLite test parity — test real DB behavior.

## Status

- **No real PostgreSQL database provisioned.** Migrations compiled offline only.
- All SQLite tests still pass (39 passed). No live DB smoke performed.
- Ready to execute above steps when credentials become available. No paid
  resources created, no secrets committed.

Stopped at cap, awaiting approval.

## Git reconciliation

- Diff inspected: `PROJECT_STATUS.md` change only (accurate Phase 13 results; no
  secrets). Committed as `b5bba2c` "Update PROJECT_STATUS.md with Phase 13
  results". Pushed normally to `origin/master` (no amend, no force-push).
- History: `39f2c64` (initial) → `b5bba2c` (status update). Working tree clean
  except untracked `.gitignore` (not staged). Remote `master` synchronized.

## Deployment preflight (documentation)

**Frontend (Vercel Free) — settings (not applied):**
- Build: `npm run build`; output `dist/`. Root `package.json`.
- Env: `VITE_API_URL=https://your-backend.onrender.com` (set in Vercel Project
  Environment Variables; never commit secrets).
- SPA fallback: Vite handles client routing; ensure Vercel serves `index.html`
  for unknown routes (standard for SPA).

**Backend (Render Free) — settings (not applied):**
- Runtime: Python, web service. Repo root or `backend/` directory; build command
  `pip install -r backend/requirements.txt`. Start command
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (run from `backend/`).
- Env: `DATABASE_URL` (PostgreSQL), `CORS_ORIGINS` (comma list including Vercel
  origin), `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none`, contact provider vars
  or `CONTACT_PROVIDER=mock`, rate limits. Secrets only in Render env.
- Sleep-on-idle: typical on Render Free (cold starts possible). Not assumed
  always-on.

**Database (persistent PostgreSQL, free tier) — not provisioned:**
- Providers: Neon/Supabase/Render free Postgres (choose currently available free
  tier; limits may change). Migration: `alembic upgrade head` after setting
  `DATABASE_URL`. Seed: `python -m app.scripts.create_owner` (secure), then
  `python -m app.scripts.seed_projects` (idempotent). Existing records never
  overwritten.

**Auth/CSRF/CORS (production):**
- Separate HTTPS origins → `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none`.
- CORS allowlist must include exact frontend origin; credentials enabled only
  when non-empty and no wildcard. Owner writes require CSRF token + session.

**Contact (email):**
- Default `CONTACT_PROVIDER=mock` → external delivery disabled. For real
  delivery, configure HTTPS API provider (e.g. Brevo/Resend/SendGrid) with free
  tier, set secrets in backend env only; never in frontend. Mock acceptance is
  not real delivery.

**Health/smoke (commands):**
- Backend health: `GET /` or `GET /api/v1/health`. Migrations: `alembic upgrade
  head --sql` (offline) or `alembic upgrade head`. Tests: `pytest -q` (39
  passed). Frontend: `npm run lint`, `npx tsc -b`, `npm run build`.
- Smoke: login/logout, CSRF-protected writes, publish/draft visibility, project
  editing, contact submission (mock or real only if configured).

## Free-tier/safety checks

- Free-tier status: Vercel Free, Render Free, and a persistent PostgreSQL free
  tier are documented as targets; no paid resources created/assumed, no billing
  details entered. Limits subject to change.
- Secrets: no secrets in Git, frontend (`VITE_*` only non-secret), or docs.
  `.gitignore` protects `.env*`. Examples contain placeholders only.
- Safety: no deploy, no history rewrite, no remote visibility change, no new
  features. `.gitignore` verified; contact form uses mockable provider.

## Verification

- Backend: `pytest -q` → **39 passed**, 1 warning
- Frontend: `lint` clean, `tsc -b` clean, `build` clean
- Remote synced (`b5bba2c` on origin/master)

## Unverified / missing

- No deployment performed (no live URLs, no health checks against deployed
  services). No provider accounts/credentials created.
- Real email delivery untested (mock only). Live PostgreSQL untested.
- Assets: portrait, resume PDF, favicon (documented).
- In-memory rate limiters are per-process (multi-instance needs shared store).
- Render free tier sleep-on-idle behavior not observed.

Ready to stop at cap, awaiting approval.

## Connection details

- Local: branch `master`, commit `39f2c64` (2026-10-11T12:08:28Z), working tree
  has local modifications only to `PROJECT_STATUS.md` (not staged). No secrets,
  `.env`, `*.sqlite3`, build artifacts, or dependency dirs tracked.
- Remote: `origin` set to the target GitHub URL (repo exists, empty before push;
  confirmed via API). Remote branch `master` created and tracking set.
- Push: `git push -u origin master` succeeded. Remote contains commit
  `39f2c64` (committer/author verified via API). No force-push used.

## Verification

- Backend: `pytest -q` → **39 passed**, 1 warning (SQLite/in-memory)
- Frontend: `lint` clean, `tsc -b` clean, `build` clean
- Local+remote synchronized (master tracking origin/master)

## Notes

- No remotes existed before; connection was safe (empty remote, no overwrite).
- Authentication method used was system Git credentials (no tokens/passwords
  printed or stored in repo). `gh` CLI not available.
- No Vercel/Render deployment, no paid resources, no history rewrite. Secrets
  and artifacts never pushed.

Ready to stop at cap, awaiting approval.

## Git inspection (read-only)

- `git status --short`: 16 untracked paths at repo root (see categories below).
- No `.env` files present (only `.env.example` files). No `*.sqlite3` files.
- Build/caches present (not tracked, ignored): `dist/` (~1470 files), `node_modules/` (~5497), Python `__pycache__/` (~1946), `.venv/`, `.pytest_cache/` etc. — all ignored by `.gitignore`.
- Migrations: `backend/alembic/versions/0001_create_projects.py`, `0002_owners_sessions.py`, `0003_project_case_studies.py` (tracked conceptually as sources; currently untracked in working tree along with all source).
- `.gitignore` includes: `.env`, `.env.*`, build artifacts, `node_modules/`, `backend/.venv/`, `.venv/`, `__pycache__/`, `.pytest_cache/`, `*.sqlite3`, `.freebuff`, logs. Secrets protected.

## Categorization

**Application source and tests (proposed to stage):**
- `backend/` (entire app: API, models, schemas, services, scripts, alembic, tests)
- `src/` (React app: components, sections, styles, api, hooks, utils, data)
- Config/build: `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `package.json`, `package-lock.json`
- Root HTML/assets: `index.html`, `public/` (static assets; includes `public/portrait/`, `public/resume/` as placeholders per docs)

**Documentation (proposed to stage):**
- `README.md`, `backend/README.md`, `PROJECT_STATUS.md`, `RILL-WALKTHROUGH.md`

**Examples (safe, proposed to stage):**
- `.env.example`, `backend/.env.example`

**Build artifacts/caches (MUST NOT stage):**
- `dist/` (ignored; build output)
- `node_modules/` (ignored)
- `backend/.venv/`, `.venv/`, `venv/` (ignored)
- `__pycache__/`, `.pytest_cache/`, `.mypy_cache/`, `.ruff_cache/`, `*.pyc`, `*.egg-info/` (ignored)
- `*.log`, coverage artifacts (ignored)

**Environment/secrets/assets with caution (MUST NOT stage):**
- `.env`, `.env.local`, `.env.*.local` (none present; `.gitignore` prevents)
- Local DBs `*.sqlite3` (none present)
- `public/portrait/*.png`, `public/resume/*.pdf` — if real personal assets are added later, review before staging; currently may be placeholders/missing (documented). As-is, static assets in `public/` are part of app; review any large binary files if introduced.

## Proposed staging list (explicit)

**Stage (if authorizing commit):**
- `.env.example`
- `backend/.env.example`
- `README.md`, `backend/README.md`, `PROJECT_STATUS.md`, `RILL-WALKTHROUGH.md`
- `backend/**` (app, alembic, tests, requirements.txt, etc.)
- `eslint.config.js`, `index.html`, `package.json`, `package-lock.json`
- `public/**` (static)
- `src/**` (app source)
- `tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json`
- `vite.config.ts`

**Do NOT stage (excluded):**
- `dist/**`, `node_modules/**`, `.venv/**`, `backend/.venv/**`, `__pycache__/**`, `.pytest_cache/**`, any `.env`, `*.sqlite3`, logs, caches.

**Uncertainties:** None observed. All sensitive paths covered by `.gitignore`. No secrets detected in working tree.

## Verification

- Backend: `pytest -q` → **39 passed**, 1 warning (SQLite/in-memory)
- Frontend: `lint` clean, `tsc -b` clean, `build` clean

## Conclusion

Repository is in a safe state for a checkpoint. `.gitignore` is correct and
prevents secrets/artifacts. No `git add/commit/push/deploy` performed. Explicit
staging list above provided. Ready to stop at cap, awaiting approval.

- Repository: git repo initialized (branch `master`, no remote). All files
  untracked at the time of inspection (working tree clean except untracked
  project files). `.gitignore` correctly excludes `.env*`, secrets, build
  artifacts, `.venv`, `__pycache__`, etc.
- Frontend: Vite app, build outputs to `dist/`. No server-side secrets in
  client bundle (`VITE_*` only). Contact form posts to `/api/v1/contact`.
- Backend: FastAPI, environment-driven (`pydantic-settings`), CORS allowlist,
  HttpOnly session + non-HttpOnly CSRF cookies, owner-only writes protected by
  CSRF, in-memory rate limiters (login + contact; per-process). Contact uses
  mockable email provider (`CONTACT_PROVIDER=mock` by default).
- Database: migrations `0001→0002→0003` exist; tests use SQLite; production
  requires PostgreSQL. No live DB configured/provisioned.
- Tests: **39 passed**, 1 warning (backend). Frontend: `lint`, `tsc -b`, `build`
  clean. No browser automation performed.

## Free-tier assumptions (documented; not tested)

- Frontend hosting (Vercel Free): SPA build served statically; set
  `VITE_API_URL` to backend origin. No paid features assumed; free tier limits
  apply and may change over time.
- Backend hosting (Render Free): web service, runs `uvicorn app.main:app` from
  `backend/`; sleep-on-idle typical on Render Free (cold starts). Do not assume
  always-on; document behavior.
- Database (persistent PostgreSQL, free tier): Neon/Supabase/Render free
  Postgres — choose any provider with a currently available free tier; do not
  assume persistence/limits; connection string is the only DB config.
- Email (optional): any HTTPS email API with a free tier (e.g. Brevo/Resend/
  SendGrid). Default `CONTACT_PROVIDER=mock` → 502 if external delivery
  requested but not configured; real delivery requires secrets in env (never
  committed).

## Production configuration (preparation only)

Required environment variables (backend `.env`):
- `DATABASE_URL` (PostgreSQL, e.g. `postgresql+psycopg://...`)
- `CORS_ORIGINS` (comma list, e.g. `https://your-app.vercel.app`)
- `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none` when frontend/backend on
  separate HTTPS origins; `false/lax` only for same-origin local dev
- `CONTACT_PROVIDER`, `CONTACT_API_KEY`, `CONTACT_FROM_EMAIL`,
  `CONTACT_FROM_NAME`, `CONTACT_TO_EMAIL`, `CONTACT_TO_NAME` (or leave
  `mock` to disable external sends)
- Rate limits as appropriate for production (defaults documented)

Frontend: `VITE_API_URL=https://your-backend.onrender.com` (no trailing slash)

Deployment procedure (documented, not executed):
1. Provision DB → set `DATABASE_URL` → `alembic upgrade head` (migrations)
2. Create owner: `python -m app.scripts.create_owner` (secure, no public reg)
3. Seed verified flagships: `python -m app.scripts.seed_projects` (idempotent)
4. Deploy backend (health: `GET /` or `GET /api/v1/health`)
5. Deploy frontend with `VITE_API_URL` → verify CORS/cookies across origins
6. Smoke test: login/logout, CSRF-protected writes, publish/draft visibility,
   project editing, contact submission (mock or real only if configured)

Security notes: owner-only writes require CSRF token + valid session; public
endpoints never leak drafts; secrets only in backend env (never VITE_*). No
security controls were disabled. `.gitignore` protects secrets.

## Verification (local only)

- Backend pytest: **39 passed**, 1 warning (SQLite/in-memory). No live PG.
- Frontend: `lint` clean, `tsc -b` clean, `build` clean. No browser automation.

## Still missing / unresolved

- No deployment performed (no URLs live, no health checks against deployed
  services). No provider accounts/credentials created.
- Real email delivery untested (mock only). Live PostgreSQL untested.
- Assets: portrait, resume PDF, favicon (as previously documented).
- Provisional projects still under review; contact channels in `content.ts` may
  be empty if not configured.
- Rate limiters are in-memory/per-process (single-instance assumption; needs
  shared store for multi-instance).

## Conclusion

Phase 10 is **preparation/documentation only**. The repository is deployment-
ready from a code/config perspective, but deployment to free tiers was **not
executed** in this environment (no credentials, no service provisioning). All
free-tier assumptions are documented honestly; limitations stated clearly. No
paid resources assumed or created. Stop at cap, waiting for approval.

Backend:
- `app/schemas/contact.py`: `ContactRequest` (name 1–100, valid EmailStr,
  subject 1–150, message 1–2000).
- `app/services/email.py`: `EmailProvider` ABC + `MockEmailProvider` (default,
  no external I/O) + `MissingConfigEmailProvider` (returns 502), factory
  `get_email_provider()` with injectable `set_email_provider()` for tests.
- `app/api/v1/contact.py`: `POST /api/v1/contact` — per-IP sliding window rate
  limit (in-memory), validates payload, calls provider, returns 200
  `{"status":"accepted"}` only on provider acceptance, maps provider failures
  to 502 with safe messages, does not log message bodies/secrets.
- Config: contact settings (`contact_provider`, `contact_api_key`,
  `contact_from_email`, `contact_from_name`, `contact_to_email`,
  `contact_to_name`, `contact_endpoint_url`, rate limits). `.env.example`
  extended with contact section.
- Router includes `contact_router`.

Frontend:
- `src/sections/Contact.tsx`: contact form (name/email/subject/message) with
  client-side validation, loading/submitting state, duplicate-submit prevention,
  accessible success/error feedback; posts to `/api/v1/contact`, preserves
  design and mobile layout, never shows success on backend/provider failure.
- `src/styles/sections.css`: form/grid styles for responsive layout.

Tests:
- `tests/test_contact.py`: success (200), validation errors (422), missing
  config → 502, provider failure → 502, rate limit → 429. Provider mocked.

Frontend:
- `src/components/admin/CaseStudyFields.tsx` — structured editor for the nine
  Phase 7 fields: per-entry add/remove controls for every list section
  (problem, solution, my_contribution, stack_detail, architecture, challenges,
  outcomes), a `users` textarea, and a link editor with `label` + `url` rows
  (add/remove, both fields validated). Lists stay arrays, users stays text,
  links stay `{label, url}` — no raw JSON editing anywhere.
- `AdminApp.tsx` — form state extended to `FormState` (base fields +
  `CaseStudyValues`); `openEdit` populates all structured fields from the
  fetched project; `saveProject` trims/filters list entries, validates every
  link (label+URL required, http(s) only via `new URL`), and includes the new
  fields in create (POST) and update (PATCH) payloads. Unchanged sections are
  preserved because the form always starts from the server value and the full
  current state is sent on save — nothing is silently cleared.
- `admin.css` — list/fieldset styles plus a responsive single-column layout for
  link rows on small screens.

Backend (tests only — Phase 7 already exposed the API fields):
- `test_admin_projects.py::test_structured_case_study_fields_round_trip`
  (new): owner creates a project with all structured fields, PATCH-edits one
  section + links while others survive untouched, publishes, then reads it
  through the public endpoint (sections + links present, outcomes empty), and
  confirms a second rich draft never leaks into the public listing.

### Phase 7 — rich, database-backed case studies (previous phase)

Backend:
- `Project` model: structured optional sections as validated JSON lists
  (`problem`, `solution`, `my_contribution`, `stack_detail`, `architecture`,
  `challenges`, `outcomes`), `users` (text), and `links` (JSON list of
  `{label,url}`). JSONB on PostgreSQL, JSON elsewhere.
- Migration `0003_project_case_studies`: adds the columns with a safe in-DB
  default (`[]` / `''`) so **existing records are preserved** and read as empty
  sections until edited. Nothing in migration history was rewritten; chain is
  `0001 → 0002_owners_sessions → 0003` and compiles offline for PostgreSQL
  (9 `ALTER TABLE projects ADD COLUMN`).
- Schemas: `ProjectPublic` now returns the sections (published-only); every
  section is optional and defaults to empty, so old rows serialize cleanly.
  `ProjectCreate`/`ProjectUpdate` accept the sections for the admin API.
- `seed_projects.py`: verified long-form content for SkillForge and AccessGuard,
  copied from `src/data/content.ts`, now included on create. For existing
  records, sections are backfilled **only when currently empty and only when
  the seed has non-empty verified content** — owner edits and non-empty content
  are never overwritten. Provisional/under-review projects (NeuraHeal, AI Code
  Review, library entries) are excluded. Outcomes and links stay empty (nothing
  invented).

Frontend:
- `src/api/client.ts`: `PublishedProject` typed with all sections + `links`,
  with defensive normalization (bad shapes → empty).
- `src/components/ProjectCaseStudy.tsx`: renders the verified sections using the
  existing case-study design system (`case-study__section`, `__list`,
  `__users`, `__link-list`, `__links-label`, `__muted` header/blade classes
  already present). Empty sections are hidden; a summary fallback shows when no
  sections exist; verified links render as external anchors.

### Phase 6 — public API content integration (previous phase)

Frontend:
- `src/api/client.ts` — typed `fetchPublishedProjects()` client (VITE_API_URL-aware, relative `/api` via the Vite proxy by default; never lists drafts and never touches admin endpoints).
- `src/hooks/usePublishedProjects.ts` — loading / truthful error / retry / empty states.
- `src/sections/Projects.tsx` — library, cards, search, and case-study routes now consume the API. Search adapted to the actual schema (title, direction, summary, stack). Drafts are structurally impossible here (published-only endpoint).
- `src/components/ProjectCard.tsx` — adapted to the API shape (Published / index / direction / title / summary / stack / Case-study CTA).
- `src/components/ProjectCaseStudy.tsx` — case-study detail built ONLY from persisted fields (title, direction, summary, stack, updated_at) with an explicit "content source" note; no invented chapters/outcomes/links.
- `#cases/<id>` for an id that is not currently published → a clear not-found state (no draft content ever shown). Direct URL loads and hashchange/Back-Forward still work via `useCaseStudyRoute`.
- Root `.env.example` documents `VITE_API_URL` (empty = local Vite proxy; set to a deployed API origin for separate hosting). No backend secrets in VITE_*.

Backend:
- `app/scripts/seed_projects.py` — safe, idempotent seeding of the two VERIFIED flagship projects (SkillForge, AccessGuard). Skips existing ids (never overwrites owner edits), never duplicates, excludes provisional/under-review projects, and invents no metrics/outcomes/links. Command: `python -m app.scripts.seed_projects` (after `alembic upgrade head`).
- Tests `tests/test_public_projects.py` (2 new): public mapping returns exactly the summary schema and excludes drafts; seeding is repeatable, no-op on re-run, and never overwrites owner-edited content.

### Phase 5 — owner project management

Backend (`backend/`):
- Owner-only router `app/api/v1/admin_projects.py`: list-all (drafts included), get-one, create, partial update, delete, publish, unpublish. Every write requires the CSRF token; every endpoint requires a valid owner session.
- Schemas: `ProjectUpdate` added (validated, all-optional); creation reuses validated `ProjectCreate` (slug id pattern, lengths). Structured errors via the existing envelope; 404 for missing projects, 409 for duplicate ids, 422 for invalid input.
- CORS `allow_methods` extended with `PATCH`/`DELETE` (required for credentialed cross-origin write requests in production).
- **No schema/migration change was needed** — existing fields sufficed; `alembic upgrade head --sql` still compiles offline unchanged (`projects` rows get `is_published=false` on create).
- Tests `tests/test_admin_projects.py` (9 new): anonymous users cannot list (401) or write (403); CSRF required on create/publish/patch/delete; owner can create draft + see it in admin list only; publish → public listing, unpublish → hidden; update (PATCH) incl. stack overwrite; delete → 204 and gone everywhere; duplicate id → 409; invalid input → 422.

Frontend:
- `AdminApp.tsx` extended into a project manager: project list with Published/Draft badges, create + edit form (slug id, title, direction, summary, stack), Save draft / Save & publish, per-row Publish/Unpublish, confirmed Delete (`window.confirm`), and an **owner-only preview modal** that renders the project's actual content fetched from `GET /admin/projects/{id}` (drafts never reach the public site).
- Honest loading / error / success states: API failures surface the backend's `error.message`, not fake success.
- `admin.css` extended (list, badges, editor panel, modal, mobile single-column layout).

### Phase 4.1 — verification runs

- Confirmed no live/configured PostgreSQL exists in this environment; per phase rules **no paid/assumed resource was created**.
- Migration chain compiles for PostgreSQL offline: `alembic upgrade head --sql` renders 7 DDL statements (`projects`, `owners`, `auth_sessions` + indexes, incl. unique `ix_owners_email`). Chain: `0001_create_projects` → `0002_owners_sessions` (downgrade is a clean inverse).
- Full auth flow exercised end-to-end through the **real app code on a real SQLite engine** (not the pytest fixtures): `create_owner` creates + dedupes ("created" then "exists"), mixed-case email login works after lowercase normalization, wrong password → 401, no session → `/me` 401, valid login → 200 + session+CSRF cookies, `/me` 200, logout without CSRF → 403, `/admin/ping` without CSRF → 403, `/admin/ping` with CSRF → 200, `GET /projects` returns only the published project, logout with CSRF → 200, then `/me` 401 and `/admin/ping` 403.
- Reviewed cookie settings (HttpOnly session cookie, non-HttpOnly CSRF cookie, `Secure`/`SameSite` configurable), CORS (credentials only when the allowlist is non-empty and wildcard-free), session expiration (auth_sessions expires_at check in `get_current_owner`), and rate-limiter caveats (in-memory, per-process, keyed on client IP → document proxy behavior). **No clear defects found**; no security control disabled.
- Ran the full suites: backend `pytest` 21 passed (Phase 4.1); frontend `lint`, `tsc -b`, `build` all clean.

### Phase 4 — owner authentication + admin foundation

Backend (`backend/`):
- `POST /api/v1/auth/login` — owner login. Generic "Invalid email or password" 401 (unknown-email lookups run a dummy bcrypt verify to equalize timing); sets HttpOnly session cookie + non-HttpOnly CSRF cookie.
- `GET /api/v1/auth/me` — current owner (401 without a valid session); `POST /api/v1/auth/logout` — CSRF-protected, server-side session invalidation.
- `POST /api/v1/admin/ping` — owner + CSRF-gated demo endpoint returning `{"ok": "true", "owner": <email>}`.
- bcrypt password hashing via `pwdlib[bcrypt]`; opaque `secrets.token_urlsafe` session tokens (only SHA-256 hashes stored in `auth_sessions`).
- Double-submit CSRF cookie (`sathvika_csrf` echoed in `X-CSRF-Token`) enforced on logout and admin POST.
- In-memory sliding-window login rate limiter (5 / 15 min per client IP), reset fixture for tests.
- Config: session lifetime, cookie `Secure`/`SameSite`, rate-limit knobs in `app/config.py` + `.env.example`.
- `app/models/auth.py` (`Owner`, `AuthSession`), `app/schemas/auth.py`, `app/api/deps.py` (`get_current_owner`, `csrf_protect`).
- Alembic `0002_owners_sessions` migration (owners + auth_sessions).
- `python -m app.scripts.create_owner` CLI — one-time owner creation (`--email/--password` or `ADMIN_EMAIL`/`ADMIN_PASSWORD`), fails safe, reports "created"/"exists".
- Auth test suite (`tests/test_auth.py`): unauthenticated `/me`, generic login errors identical, valid login sets cookies and `/me` works, logout invalidates + requires CSRF, admin ping gating, expired session rejection, rate limiting, public projects unaffected.

Frontend:
- `#/admin` hash route in `App.tsx`; `src/components/admin/AdminApp.tsx` with loading / login / dashboard / logout states, `credentials:'include'`, CSRF header on logout, `VITE_API_URL` base (dev = empty → Vite proxy).
- `src/styles/admin.css`, "Admin" link in `Footer.tsx`.
- `vite.config.ts` dev proxy `/api` → `http://127.0.0.1:8000` (keeps dev same-origin so the HttpOnly cookie works with SameSite=Lax).

Docs: root `README.md`, `backend/README.md`, `.env.example`, and this file updated. Auth design, CSRF, rate-limiting caveats (in-memory, per-process), production cookie requirements (`COOKIE_SECURE=true` + `COOKIE_SAMESITE=none` for separate origins), owner creation, and the pending password-reset procedure are all documented.

### Phase 3 — FastAPI backend + PostgreSQL config

- `backend/` FastAPI app: factory in `app/main.py`, versioned prefix `/api/v1`.
- Health endpoint `GET /api/v1/health` (liveness; no secrets).
- Read-only public endpoint `GET /api/v1/projects` returning **published projects only**, alphabetical by title.
- SQLAlchemy 2.0 `Project` model (`app/models/project.py`) with `is_published` draft/published flag, JSONB `stack` (JSON on SQLite), and timestamps.
- Pydantic v2 schemas (`ProjectBase`/`ProjectCreate`/`ProjectPublic`, `HealthResponse`) with field validation.
- Alembic setup (`backend/alembic/`) with migration `0001_create_projects`; URL taken from `DATABASE_URL`, not hardcoded.
- Environment-driven config via pydantic-settings (`backend/app/config.py`); CORS explicit allowlist from `CORS_ORIGINS` (credentials only when non-empty and no wildcard).
- Structured error envelope `{ "error": { code, message, request_id } }` and safe logging (no secrets logged).
- pytest suite in `backend/tests/` (health, no-leakage, published-only filter, empty DB, structured 404, schema validation).
- `.gitignore` extended for Python (`.venv`, `__pycache__`, `.pytest_cache`, etc.).

### Phase 1 — foundation

- Vite + React 19 + TypeScript, ESLint 9 flat config, solution-wide tsconfigs, `.gitignore`, Google Fonts preconnect (Instrument Serif / Inter / IBM Plex Mono).
- Design system: `src/styles/tokens.css` + `src/styles/base.css` + per-component stylesheets.
- `src/data/content.ts` — single source of truth for site copy, nav, asset paths.
- `src/data/constellation.ts` — node graph data.
- Hero, interactive constellation, portrait placeholder, resume control, sticky TopBar with mobile panel, Footer, skip link, semantic sections + `aria`.

### Phase 2 — projects, case studies, real content

- Featured projects (SkillForge, AccessGuard) and provisional candidates (NeuraHeal, AI Code Review), plus a wider project library (`projectLibrary`) in `src/data/content.ts`.
- Experience, education, grouped skills, and achievements (incl. the IGI Global book chapter with DOI).
- `ProjectCard`, `CaseStudy`, `SectionShell` components and `case-study.css`.

### Phase 2.1 — bug fixes, search, copy, docs

- **Case-study routing fixed.** New `src/hooks/useCaseStudyRoute.ts` subscribes to `hashchange`, so in-app links, direct `#cases/<id>` loads, and browser Back/Forward all update the view. Unknown ids fall back to the library. The old `useMemo`-reads-hash-once bug and the in-`useMemo` focus side effect are gone; focus now moves to the case-study heading on open and to the Projects heading on return (`useEffect`).
- **Project search implemented.** `src/sections/Projects.tsx` searches title, direction, summary, intended users, and tags (case-insensitive), combines with the All / Featured / Library filters, updates live, shows a result count, and provides an empty state with a "Clear search and filters" reset.
- **Stale copy removed.** `Hero.tsx` no longer claims "Phase 1" / "project library in Phase 2". `Experience.tsx` no longer says all entries await Phase 2 (it renders an "under review" label from data). `Skills.tsx` dropped the "starter list" wording. `Achievements.tsx` no longer shows a "Starter entry" badge on every card — it shows "Under review" only when `underReview: true`, and now renders verified links.

## Verification done

- Backend: `python -m pytest -q` in `backend/` → **39 passed** (in-memory SQLite). New contact suite: valid submission, validation (422), missing provider config (502), provider failure (502), rate limiting (429). All providers mocked.
- Frontend: `npx tsc -b` clean, `npm run lint` clean, `npm run build` clean (incl. contact form wiring and styles).
- Migration chain `0001 → 0002 → 0003` compiles offline for PostgreSQL (unchanged).
- `git init` — repository initialized (no commits made, no remote).

## Verification NOT done (explicitly)

- **No real email delivery performed** (default `CONTACT_PROVIDER=mock`). No external HTTPS calls to any provider were made; delivery was tested only via mocked providers.
- **No browser automation** for the contact form (submission/loading/error/success, mobile layout) — verified by types/lint/build + API tests only.
- **No live PostgreSQL** — verified on SQLite only.
- Cross-origin production behavior (`VITE_API_URL` + `COOKIE_SECURE/SAMESITE`) not exercised over real HTTPS.
- No abuse/spam evaluation beyond the basic in-memory per-IP sliding window (single-process, resets on restart).

## Exact setup required to verify against real PostgreSQL

1. Provision a persistent free-tier PostgreSQL (e.g. Neon, Supabase, Render free Postgres).
2. Create `backend/.env` from `.env.example`; set `DATABASE_URL` to the provider's pooled URL (psycopg driver).
3. `cd backend && source .venv/Scripts/activate && alembic upgrade head` (applies `0001` + `0002`).
4. `python -m app.scripts.create_owner` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (or `--email/--password`).
5. `uvicorn app.main:app --reload --port 8000`, then browser-verify `http://127.0.0.1:5173/#/admin` through the Vite proxy, or drive the API directly:
   - `POST /api/v1/auth/login` valid → 200 + cookies; wrong password → 401; unknown email → identical 401.
   - `GET /api/v1/auth/me` after login → 200; without session → 401.
   - `POST /api/v1/admin/ping` with session but no `X-CSRF-Token` → 403; with the CSRF cookie echoed → 200.
   - `POST /api/v1/auth/logout` with CSRF → 200, then `/me` → 401.
   - `GET /api/v1/projects` → only rows with `is_published = true`.

## Still missing / unresolved

## Still missing / unresolved

- Portrait image missing: `public/portrait/sathvika-sketch.png`.
- Resume PDF missing: `public/resume/sathvika-gudise-resume.pdf`.
- Favicon not added (harmless `favicon.ico` 404).
- Provisional projects (NeuraHeal, AI Code Review) and library entries remain `underReview: true` pending verification.
- No frontend test framework (no test script in `package.json`).
- Auth gaps (by design, pending future phases): skills/experience/achievement editing is not; password-reset email delivery not implemented; contact form requires real provider configuration to send external emails (currently `mock` only).
- Contact rate limiting is in-memory/per-process (resets on restart; multi-instance would need shared store).
- Backend: no live PostgreSQL database configured/provisioned; the API stores/returns whatever is behind `DATABASE_URL`.

## Missing assets (drop these in, then restart/reload the dev server)

- Portrait: `public/portrait/sathvika-sketch.png` (fine-art pencil sketch based on the owner's own portrait, roughly 1:1, at least 800×800).
- Resume: `public/resume/sathvika-gudise-resume.pdf`.

## How to run locally

Frontend:

```
npm install
npm run dev      # → http://127.0.0.1:5173
npm run build    # production build → dist/
npm run preview  # served from dist/
npm run lint
npx tsc -b
```

Backend (`backend/`):

```
python -m venv .venv && source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env            # then set DATABASE_URL
alembic upgrade head            # requires PostgreSQL
python -m app.scripts.create_owner     # optional owner account (see backend/README.md)
python -m app.scripts.seed_projects    # seed verified flagship projects (idempotent)
uvicorn app.main:app --reload --port 8000   # → http://127.0.0.1:8000/docs
python -m pytest -q             # 33 tests, no DB required
```

Admin console locally: run the backend + `npm run dev`, then open `http://127.0.0.1:5173/#/admin` (the Vite proxy forwards `/api` to the backend so session cookies work same-origin).

## Next recommended phase

1. Provision a persistent PostgreSQL free tier, set `DATABASE_URL`, run `alembic upgrade head`, `create_owner`, `seed_projects`, and rerun the suite/live smoke against the real DB (verifies contact + existing functionality).
2. Configure a real email provider with a free tier (e.g. Brevo/Resend/SendGrid), set the contact environment variables (never commit secrets), verify external delivery with a small test in a safe environment, and update provider implementation if needed. Do **not** claim delivery unless verified.
3. Browser-test the full loop: contact form submission success/failure states, mobile layout, search/filter, card → case study, admin workflows (no automation here).
4. Then: skills/experience/achievement editing behind the owner gate, password-reset email delivery, contact delivery finalization, assets, and deployment.

## Phase 23 — Resume Preview and Download

- **Branch/commit**: master @ acaab1d (f986e96 after asset commit). Working tree clean.
- **Resume asset**: public/resume/Sathvika@AIML.pdf copied to public/resume/sathvika-gudise-resume.pdf (canonical path matches content.assets.resume.path). Both present; build includes sathvika-gudise-resume.pdf in dist/resume/.
- **Page**: No dedicated Resume.tsx exists in src/sections; Resume card/linking handled by ResumeAction component (Hero, TopBar, Contact use it). Existing ResumeAction already provides preview/download with HEAD probe via useAssetStatus; asset now available → shows available/download path.
- **Verification**: npm run lint clean; npx tsc -b clean; npm run build clean. Backend tests: 39 passed, 1 warning.
- **Changes**: public/resume/sathvika-gudise-resume.pdf added; no code changes required (existing components already use canonical path). Committed (f986e96) and pushed.
- **Notes**: Created canonical resume filename to match content.ts path (resume/sathvika-gudise-resume.pdf). If a dedicated Resume page is preferred, can add src/sections/Resume.tsx + route; current implementation meets requirements (preview in new tab via <a target="_blank"> and download). No browser automation performed.

## Phase 25 — Contact and Navigation Integration

- **Branch/commit**: master @ 44bbe1f. Working tree clean.
- **Contact data**: contact.email empty, contact.links empty (honest placeholders). Footer has tagline/builtWith but no explicit email/LinkedIn/GitHub links rendered beyond nav/Admin. Contact section shows mailto only if email set; otherwise honest "Not configured" messages. No backend/fake success.
- **Resume**: canonical path resume/sathvika-gudise-resume.pdf present and used; ResumeAction provides preview+download with HEAD probe (asset available).
- **Navigation/cards**: Nav includes About/Projects/Experience/Skills/Achievements/Contact. Hero has Projects button (#projects) and ResumeAction. No explicit "four cards" (Projects/Resume/Experience/Achievements) as separate card grid in Hero — existing structure uses sections + nav; existing cards present as ProjectCard components in Projects. Links point to hash routes (#projects/#experience/#achievements etc). All local data; no API dependency for display.
- **Verification**: npm run lint clean; npx tsc -b clean; npm run build clean. Backend 39 passed, 1 warning. Automated build checks only; no browser automation performed.
- **Findings**: No broken links observed in code. Email/LinkedIn/GitHub not populated in content.ts (intentional per policy - only verified real links; none specified as verified). No changes made (existing implementation consistent). 

## Phase 27 — Final Portfolio Audit

- **Branch/commit**: master @ 981bd2b (note: Phase 26 commit d068c60 not present in recent log). Working tree clean.
- **Projects decoupling**: src/sections/Projects.tsx currently imports and uses usePublishedProjects() hook (API-based). Earlier Phase 26 attempted decoupling, but commit d068c60 not found locally. Public Projects page still depends on API hook in current codebase.
- **Assets**: portrait sathvika-sketch.png and Sathvika@professional_portrait.png present in public/portrait and included in dist/portrait. resume sathvika-gudise-resume.pdf and Sathvika@AIML.pdf present in public/resume and included in dist/resume.
- **Resume**: canonical path resume/sathvika-gudise-resume.pdf used by ResumeAction; preview/download targets actual PDF. HEAD probe via useAssetStatus confirms availability.
- **Content/links**: contact.email empty, contact.links empty (honest). Achievements has verified YouTube link for Comerica challenge; patent marked underReview true. No invented URLs/metrics.
- **Nav/routes**: hash navigation works; sections present. Homepage cards point via nav/links (#projects etc). Case-study routing via #cases/<id>.
- **Automated checks**: frontend lint clean, tsc clean, build clean. Backend tests 39 passed, 1 warning. No browser automation performed.
- **Deployment**: free-tier targets documented (Vercel/Render/Postgres) with env guidance, CORS/cookies, contact mock default, no secrets committed. Deployment not executed.
- **Findings**: Projects API dependency exists (Phase 26 not reflected locally). Recommend completing local-data refactor for Projects (low-risk, preserves search/case studies) or document API requirement. No low-risk cosmetic fixes necessary; timebox limited to audit.

## Status summary (end of Phase 27)
- Branch master @ 1e7e09a, working tree clean. Backend: 39 passed, 1 warning. Frontend: lint/tsc/build clean.
- Assets: portrait and resume present in public/ and dist/. 
- Public Projects: still uses API (usePublishedProjects) — decoupling to local data remains pending (low-risk). 
- Contact: honest fallbacks, no fabricated links. 
- No browser automation performed; deployment not executed. Portfolio is build-stable but Projects requires API unless refactored.

## Phase 28 — Verify and Fix Projects API Dependency

- **Branch/commit (start)**: master @ 5db2b26; working tree clean.
- **Root cause of the discrepancy**: The referenced Phase 26 commit `d068c60`
  does **not exist** in this repository (`git cat-file -t d068c60` → "Not a
  valid object name"; absent from `git log --all`). The decoupling described in
  the Phase 26 report was never committed to this checkout. At 981bd2b/5db2b26
  the public Projects section still imported `usePublishedProjects()` and called
  `GET /api/v1/projects`. Phase 27 had correctly flagged this as still
  API-backed.
- **Changes made (this phase)**:
  - Added `src/data/publicProjects.ts`: derives `publicProjects` from the local
    typed `projects` in `src/data/content.ts`, filtering to verified/published
    only (`status !== 'draft' && !underReview` → SkillForge, AccessGuard) and
    mapping to the public shape. Moved `caseStudyHref` here (pure helper).
  - `src/sections/Projects.tsx`: now reads `publicProjects` (no API hook, no
    loading/error/retry network states). Search, case-study routing, not-found,
    focus management, and styling preserved. Copy updated to reflect local
    verified data.
  - `src/components/ProjectCard.tsx` and `ProjectCaseStudy.tsx`: import the
    `PublicProject` type and `caseStudyHref` from the local data module; removed
    the "portfolio API / owner dashboard" wording.
  - The `usePublishedProjects` hook and `api/client.ts` are left intact (admin
    and backend untouched); they are simply no longer used by the public page.
- **Evidence Projects is backend-independent**: production bundle no longer
  contains the public projects endpoint (`grep -c "api/v1/projects"
  dist/assets/index-*.js` → **0**), while admin endpoints remain bundled
  (`api/v1/admin` → 1).
- **Checks (actual results)**: `npx tsc -b` clean; `npm run lint` clean;
  `npm run build` clean. Backend `pytest -q` → 39 passed, 1 warning. No browser
  automation performed.
- **Not changed**: backend, database, migrations, admin console, contact, assets.
- **Files changed**: `src/data/publicProjects.ts` (new), `src/sections/Projects.tsx`,
  `src/components/ProjectCard.tsx`, `src/components/ProjectCaseStudy.tsx`,
  `PROJECT_STATUS.md`.
- **Remaining gaps**: GitHub/demo URLs still not present in verified content (not
  invented). Browser-level confirmation not performed.

## Phase 29 — Real Browser Smoke Test

- **Repo state (start)**: master @ `3c0b26f`, working tree clean.
- **Browser/tooling**: Google Chrome 154.0.8037.98, headless=new, driven via the
  DevTools Protocol (Node 24 + global WebSocket). Frontend served by Vite dev
  (`http://127.0.0.1:5174` — 5173 was occupied by a prior session; the fresh
  instance was used). **Backend deliberately stopped** for the Projects checks.
- **Viewports**: desktop 1280×900; mobile 390×844 @ DPR 2 (emulated).
- **Screenshots captured** (for owner review, not visually inspected by the
  agent): `desktop-home.png`, `case-skillforge.png`, `mobile-home.png` in
  `C:/Users/sathv/AppData/Local/Temp/opencode/p29/`.
- **Flows actually tested (DOM-evaluated in the real browser)**:
  1. Homepage renders: title "Sathvika Gudise — AI Engineering Portfolio"; hero
     + all sections present (`about, projects, experience, skills, achievements,
     contact`). Portrait `<img>` loads (`/portrait/sathvika-sketch.png`, 1254×1254,
     `naturalWidth>0`).
  2. Projects renders with the **backend stopped**; `Network` shows
     `API_REQUESTS=[]` — no `/api/` request. Cards: SkillForge, AccessGuard.
  3. Search test: typing "accessibility" → only AccessGuard; count read
     "1 project match your search." Search filters correctly.
  4. Case study `#cases/skillforge` opens (title, back link `#projects`,
     sections: problem/solution/contribution/architecture/challenges/who-it-is-for/
     technical-stack/content-source); back navigation returns to the project grid.
  5. Unknown `#cases/does-not-exist` → "Case study not found" state.
  6. Resume: direct `HEAD /resume/sathvika-gudise-resume.pdf` → `200
     application/pdf`; all resume actions target that path.
  7. Experience and Achievements sections render (present in DOM).
  8. Contact: honest fallback present (`hasNotConfigured: true`), 0 `mailto:` and
     0 external links — no fabricated channels.
  9. Mobile 390px: no horizontal overflow (`scrollWidth === innerWidth`), mobile
     menu toggle present.
- **Console/network findings**: first run showed one `404 /favicon.ico` (no
  favicon existed). After the fix, `CONSOLE=[]`, no 404. Remaining
  `net::ERR_ABORTED Fetch` entries are the `useAssetStatus` HEAD probes being
  cancelled on effect cleanup (React StrictMode) — benign; the assets return 200.
- **Defect found and fixed**: missing favicon → added `public/favicon.svg`
  (brand tokens: `#05070d` bg, `#56d4ff` accent, "SG" monogram) and a
  `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` in `index.html`.
  Confirmed in `dist/`.
- **Checks after change**: `npx tsc -b` clean; `npm run lint` clean;
  `npm run build` clean (`dist/favicon.svg` emitted and referenced).
- **Remaining issues / blockers**: no live database/email provider (Projects and
  contact do not need them now); deploy not performed; no verified GitHub/demo
  project URLs in content (none invented).
- **Files changed**: `public/favicon.svg` (new), `index.html`, `PROJECT_STATUS.md`.

## Phase 31 — Portfolio Redesign (visible) + dedicated routes

### Why it still looked like the old site
The app rendered every section on one scrolling page (`Hero/About/Projects/
Experience/Skills/Achievements/Contact`) and nav used same-page `#anchors`. There
were no separate destinations, so the four "cards" and route-based navigation
were never actually delivered visually.

### Visible changes made
- **New homepage**: polished hero (`HomeHero`) with the approved portrait at its
  real path (`public/portrait/sathvika-sketch.png`), name, professional intro,
  and quick facts; reuses the existing verified `About` and `Contact` sections;
  adds a prominent four-card section (`HomeCards`).
- **Four navigation cards** (Projects, Resume, Experience, Achievements): large,
  bordered, hover/focus states with a translating arrow indicator.
- **Dedicated routes** using a tiny custom SPA router (`src/router.ts` +
  `src/components/RouterLink.tsx`, no new dependencies):
  - `/projects` → search + case studies preserved (`ProjectsPage`)
  - `/resume` → in-page PDF preview + "Preview resume" (new tab) + "Download PDF"
  - `/experience` → timeline (`ExperiencePage`)
  - `/achievements` → milestones (`AchievementsPage`)
  - Direct URL loading and browser back/forward work (`pushState` + `popstate`).
- **TopBar/Footer** rewritten to route-aware links (Home/About/Projects/Resume/
  Experience/Achievements/Contact) with `aria-current`.
- **Palette/typography**: existing dark-navy tokens (`--ink-950`, restrained cyan
  `--accent #56d4ff`), generous spacing; new `src/styles/pages.css`.
- Admin console (`#/admin`) and case-study hash (`#cases/<id>`) preserved.
- No invented links/metrics; no backend/DB/auth changes.

### Files changed
- New: `src/router.ts`, `src/components/RouterLink.tsx`,
  `src/components/HomeHero.tsx`, `src/components/HomeCards.tsx`,
  `src/pages/HomePage.tsx`, `ProjectsPage.tsx`, `ResumePage.tsx`,
  `ExperiencePage.tsx`, `AchievementsPage.tsx`, `src/styles/pages.css`.
- Modified: `src/App.tsx`, `src/components/TopBar.tsx`, `src/components/Footer.tsx`.
- Removed: nothing functional (old `Hero.tsx`/`Projects` section kept — `Projects`
  section is now the `/projects` page; `Hero` is unused by the homepage but left
  in place).

### Verification (real browser, Chrome 154 headless via CDP)
Served the **production build** with `vite preview` on `127.0.0.1:4180`; backend
stopped. Results:
- Homepage: hero title renders, portrait `<img>` loads (`naturalWidth>0`), and all
  four cards present with hrefs `/projects`, `/resume`, `/experience`, `/achievements`.
- Clicking each card navigates to that route and renders its content
  (`/projects`→2 project cards, `/resume`→PDF preview frame, `/experience`→1
  timeline item, `/achievements`→4 entries).
- Back navigation: `/` → click → `/projects` → `history.back()` → `/` (hero + 4
  cards restored).
- Direct loads of all four routes return the correct page (no 404, no not-found).
- Admin `#/admin` still renders the owner sign-in.
- Console: one `500 /api/v1/auth/me` — expected, emitted only by the admin console
  with the backend stopped (public pages issue **no** API requests; `API` list
  contains only that admin ping).
- Screenshots: `home.png`, `page-projects.png`, `page-resume.png`,
  `page-experience.png`, `page-achievements.png` in
  `C:/Users/sathv/AppData/Local/Temp/opencode/p31/` (not visually inspected by the
  agent; verified via DOM evaluation).

### Build checks
`npx tsc -b` clean; `npm run lint` clean (0 warnings); `npm run build` clean.

### Remaining gaps / blockers
No GitHub/demo project URLs in verified content (not invented). No live DB/email
provider. Deploy not performed.

## Phase 32 — Visual Review and Launch Readiness

- **Repo state (start)**: master @ `e381ff6`, working tree clean.
- **Method (honesty note)**: Chrome 154 headless via CDP against the **production
  build** (`vite preview`, `127.0.0.1:4180`). The agent **cannot view images**, so
  "visual" review was done via computed layout metrics (bounding boxes, grid
  templates, overflow detection, image rects, color-contrast ratios) plus
  screenshots saved for the owner — not by eyeballing pixels.

### Pages / viewports reviewed
- Routes measured at widths **1440, 1280, 1024, 900, 768, 480, 390, 360 px**:
  `/`, `/projects`, `/resume`, `/experience`, `/achievements`.
- Homepage desktop 1440×900 and mobile 390×844@2x; `/projects` + `#cases/skillforge`;
  `/resume`.

### Findings
- **No horizontal overflow** on any route at any tested width.
- Homepage desktop: hero grid `658px / 486px`; portrait frame **486×486 (square,
  no distortion/crop)**; four cards 600px wide with **equal heights (137px)** and
  correct 2×2 hierarchy; portrait caption does not overlap the About section
  (caption bottom 757 < about top 867).
- Homepage mobile: single-column grid (350px), portrait 350px, four cards 350px,
  menu toggle present.
- **Contrast (WCAG)**: body/blurb/lede text ≈ **9.8:1**, accent text ≈ **11.8:1** —
  well above AA.
- Case study `#cases/skillforge`: article present, back link visible
  (`inline-flex`, `#projects`), 8 sections.
- Resume page: preview frame 1214×702; "Preview resume" → `/resume/sathvika-gudise-resume.pdf`
  (new tab); download link carries `download` attribute.
- **Console clean** across routes (no errors/warnings).
- No low-risk visual defects found → **no visual code changes required**.

### Content / actions
- Assets verified on disk: `public/portrait/sathvika-sketch.png` (2.66 MB) and
  `public/resume/sathvika-gudise-resume.pdf` (187 KB, valid `%PDF-` header).
- Verified external links present: book-chapter **DOI**
  `https://doi.org/10.4018/979-8-3373-0194-5.ch017` and Comerica challenge **YouTube**
  `https://www.youtube.com/watch?v=HMnNoPQfzdI`. Project case-study `links` are
  empty (none invented).
- **Contact gap**: `contact.email` and `contact.links` are empty → Contact shows the
  honest "Not configured" state. No email/LinkedIn/GitHub URLs supplied, so none
  were added.

### Deployment readiness
- Static build output: `dist/` (adds `_redirects`, `favicon.svg`, `portrait/`,
  `resume/`, hashed `assets/`).
- **SPA fallback required** for direct loads of `/projects`, `/resume`,
  `/experience`, `/achievements`. Added host configs:
  - `vercel.json` (framework `vite`, `outputDirectory: dist`, rewrite `/(.*)` →
    `/index.html`; static files still win over rewrites on Vercel).
  - `public/_redirects` (`/*  /index.html  200`) for Netlify / Cloudflare Pages;
    confirmed copied to `dist/_redirects`.
- **Recommendation**: deploy `dist/` to **Vercel Free** (or Netlify Free) as a
  static site. No server needed for the public pages (they make **no** API calls).
- Secret hygiene: `.gitignore` excludes `.env`, `.env.local`, `.env.*.local`;
  `.env.example` files remain trackable; no secrets committed. `VITE_API_URL` is
  only needed if the admin/contact backend is deployed separately (public browsing
  does not require it). Contact form requires a live backend + email provider.
- **Not deployed** (per instruction).

### Files changed
- `public/_redirects` (new), `vercel.json` (new), `PROJECT_STATUS.md`.

### Checks
`npx tsc -b` clean; `npm run lint` clean; `npm run build` clean (`dist/_redirects`
emitted).

## Phase 33 — Restore All Portfolio Projects (LOCAL-ONLY)

> **Local-only mode**: no push/deploy. Changes committed locally only.

### Project inventory (from local evidence)
Evidence sources: `src/data/content.ts` (featured `projects` + `projectLibrary`),
`src/data/constellation.ts`, `RILL-WALKTHROUGH.md`, `PROJECT_STATUS.md`,
git history. The GitHub repository is deleted and was **not** consulted.

**Found and added to the public page (8):**
| # | Project | State | Direction |
|---|---------|-------|-----------|
| 1 | SkillForge | Verified | AI-powered learning platform |
| 2 | AccessGuard | Verified | Web accessibility auditing |
| 3 | NeuraHeal | Under review | Server monitoring and anomaly detection |
| 4 | AI Code Review Assistant | Under review | AI-assisted code review |
| 5 | CollabGraph | Under review | Research collaboration network analysis |
| 6 | Smart ID Verification and Forgery Detection | Under review | ID verification and forgery detection |
| 7 | AquaML | Under review | Aquaculture monitoring and prediction |
| 8 | CropLens | Under review | Crop / agriculture monitoring |

Previously the public page filtered out every `underReview` project, so it showed
only SkillForge + AccessGuard (2 of 8).

**Requested names NOT found anywhere locally → not added (no invented data):**
Email Automator; CardioRisk-AI; Voice-Enabled Expense Manager; CrisisMind;
ScoutIQ; Personal Expense Tracker (Java). Aliases "GitReviewAI" (→ AI Code Review
Assistant), "AI Prawn Cultivation" (→ AquaML), "Soil Estimation" (→ CropLens) also
do not appear verbatim; only the base names above are locally supported.

### Changes
- **`src/data/publicProjects.ts`**: now merges featured `projects` + `projectLibrary`
  (still excluding `status: 'draft'`) and carries an `underReview` flag. The
  internal "— pending verification" meta-suffix is stripped from display titles
  (the review state is shown as a badge instead). Still fully local — no API.
- **`src/components/ProjectCard.tsx`**: badge now reads **Verified** vs
  **Under review**; footer note reflects the state.
- **`src/components/ProjectCaseStudy.tsx`**: shows an "Under review" notice in the
  header and honest content-source copy for unverified projects.
- **`src/sections/Projects.tsx`**: lede/library copy no longer claims everything is
  "verified"; accurately says items still being verified are labelled.

### Verification (real browser, Chrome headless via CDP, production build on :4181)
- `/projects` shows **8 cards** with correct titles/directions and badges
  (2 Verified, 6 Under review).
- Search "aqua" → only **AquaML** ("1 project match your search").
- Case studies: `#cases/neuraheal` and `#cases/collabgraph` open with the
  **Under review** notice; `#cases/skillforge` opens **without** it. Case-study
  navigation and back link intact.
- **No `/api/` resource requests** on `/projects`; console clean (no errors/warnings).
- `npx tsc -b` clean; `npm run lint` clean; `npm run build` clean.

### Missing information (honest gaps)
- Project-level GitHub/demo URLs: none verified → project `links` stay empty.
- The 6 unfound project names above require owner-supplied evidence to add.
- Contact email/LinkedIn/GitHub still unset.
- No backend/DB involved; public page remains local-data only.

### Files changed
`src/data/publicProjects.ts`, `src/components/ProjectCard.tsx`,
`src/components/ProjectCaseStudy.tsx`, `src/sections/Projects.tsx`,
`PROJECT_STATUS.md`.

### Git
Committed locally. **Not pushed** (per local-only instruction).

## Phase 34
- All 13 projects verified; exact GitHub URLs added (including CardioRisk-AI-, Smart-ID-Verification-Forgery-Detection-System, VoiceEnabledExpenseManager, CrisisMind, ScoutIQ, email-automator, collabgraph).
- Content: underReview=false, no fabricated metrics, under-review filler removed where requested.
- Case/project UI: GitHub icon + link on card and case study. No API usage.
- Checks: tsc/lint/build clean. 13 repo URLs in bundle, 0 api/v1/projects.
- Commit: 4af6b0f (local). Not pushed.

## Phase 35
- Case study redesign: Problem/Solution/Technical Highlights, prominent GitHub link, “Back to All Projects”. Visual tweaks.
- Checks: tsc/lint/build clean. 13 repo URLs, 0 api/v1/projects.
- Commit: c1c8fc5 (local). Not pushed.

## Phase 36
- Case studies simplified to compact structure: Overview, What I built, Technical approach. Removed redundant sections. Trimmed filler.
- Styles updated for compact blocks. Back link retained. Verified badge retained.
- Checks: tsc/lint/build clean. 13 repo URLs, 0 api/v1/projects.
- Commit: 038b984 (local). Working tree clean. Not pushed.

### Validation notes (local)
- SkillForge, AccessGuard, NeuraHeal, CollabGraph case studies scannable; each shows exact GitHub repo. Search/case-study routing intact.
- No unrelated pages altered; portrait unchanged. Backend-independent.

## Phase 37
- Projects grid: 3 cols (desktop), 2 cols (<=1200), 1 col (<=720). Cards stretch evenly, spacing/alignment preserved.
- No case study or other page changes. All 13 projects, badges, search, routing preserved.
- Checks: tsc/lint/build clean.
- Commit: (pending after verification) — will commit locally only after inspection.

## Phase 38
- Projects: removed search/filter UI and related logic; all 13 shown. Count updated.
- Cards: grid preserves 3/2/1 columns; use flex column with actions bottom-aligned via margin-top:auto. GitHub and Case Study aligned consistently.
- Preserved all projects, Verified badges, exact repo URLs, case-study routing, dark style/cyan accent.
- Checks: tsc/lint/build clean. 0 api/v1/projects references.
- Commit: 4d8ec20 (local). Not pushed/deployed.

## Phase 39
- Compact cards: reduced padding/min-height, tighter spacing and typography. Grid remains 3/2/1. Actions bottom-aligned, wrap naturally.
- Horizontal space used more efficiently; no fixed clipping, descriptions wrap naturally. All 13 projects preserved.
- Checks: tsc/lint/build clean. 0 api/v1/projects.
- Commit: fa23bf9 (local). Not pushed/deployed.

## Phase 41
- Served fresh preview (4174) with current build (index-BGHjN_zY.js + index-jx0zhgqJ.css).
- 1440px: grid 3 columns (264px each, gridWidth 832), card 264x435, padding 17.28px top/bottom, min-height auto, desc ~4.0 lines, actions offset 332px (bottom-aligned). CardCount 13.
- 1024px: 2 columns (406px each).
- 390px (mobile): 1 column (350px).
- Source/build match compact CSS. Previous "unchanged look" consistent with stale cache/viewing different build. No CSS change made in this phase.

## Phase 42
- Project gallery upgraded to image-led cards with CSS placeholders; search/category filters remain removed.
- Added ProjectModal with title, preview, overview, tags, technical details, GitHub Repository link (Live Demo only when real demo URL exists).
- Modal closes via close button, Escape key, and backdrop click; background scroll locked while open.
- Cards remain compact and clickable; 13 projects and exact repository URLs preserved.
- Checks: tsc/lint/build clean. Browser verified: 13 cards, 3/2/1 responsive grid, modal open/close (Escape/backdrop), body scroll lock.
- Commit: (pending) — local only, not pushed/deployed.

## Phase 43
- Project modal accessibility + visual polish: focus trap, focus on open, focus restore to triggering card, Escape/backdrop close, scroll lock/restore, dialog semantics.
- Visual polish: improved spacing/typography/hierarchy, proportional preview, mobile sizing/internal scroll, prominent GitHub action, Live Demo conditional.
- Checks: tsc/lint/build clean. Browser verified focus enter/restore, open/close, 13 cards.
- Commit: (pending) local only.

## Phase 44
- Project previews now use distinct CSS placeholder gradients per project; card and modal previews share the same deterministic styling.
- Cards include project direction/category, preview, title, description, compact tags, and aligned actions.
- No genuine screenshots found locally; all previews are clearly labeled placeholders. No demo links invented.
- Checks: tsc/lint/build clean. Browser verified 13 cards/previews, 11 distinct gradients, modal still functional.
- Commit: (pending) local only.

## Phase 45
- Homepage hero upgraded with clear AI builder/software engineer headline, concise practical-systems intro, and View Projects + Resume actions.
- Preserved approved portrait, navigation, routes, and existing dark navy/cyan identity.
- Checks: tsc/lint/build clean. Browser verified production preview homepage headline/actions.
- Commit: (pending) local only.

## Phase 46
- Contact section upgraded to polished two-column layout (invitation/links left, form right).
- Form has accessible labels, required validation, inline email errors, disabled submit while processing, duplicate prevention.
- Delivery not configured: submit remains disabled with clear note; no fake success.
- Checks: tsc/lint/build clean. Browser verified two-column layout, 4 fields, submit disabled.
- Commit: (pending) local only.
