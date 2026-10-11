# PROJECT_STATUS.md

## What this is

Status / handoff file for the Sathvika Gudise AI-engineering portfolio. Updated throughout development so a later session can continue cleanly.

## Current phase

**Phase 13 — connect existing local repo to GitHub (done).**
Phases 1–12 complete. Phase 13 connected the local repository (commit
`39f2c64` "Initial portfolio implementation", 105 files, 13,957 insertions) to
`https://github.com/sathvikagudise/sathvika-portfolio.git`, pushed `master` to
the empty remote, and verified the remote contains the commit. No deployment to
Vercel/Render performed.

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
