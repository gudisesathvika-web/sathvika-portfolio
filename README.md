# Sathvika Gudise — AI Engineering Portfolio

A frontend portfolio for an AI-builder / software engineer. Deep navy / midnight / graphite palette with restrained cyan and electric-blue accents, editorially-set display typography, and an interactive AI constellation in the hero.

The deployed page is **frontend-only**: no database, paid API, or secrets are embedded in the browser bundle, and nothing on the page pretends to send email. A FastAPI backend lives in `backend/` with a published-content endpoint and (Phase 4) an owner-only authentication foundation for a future admin area.

## Quick start

```
npm install
cp .env.example .env          # optional; VITE_API_URL stays empty for the local proxy
npm run dev      # → http://127.0.0.1:5173  (proxies /api to the backend on :8000)
npm run build    # production build → dist/
npm run preview  # serve the built output from dist/
npm run lint     # ESLint
npx tsc -b       # type check
```

For the public project library to show content, the backend should be running
and (for a real DB) seeded: `python -m app.scripts.seed_projects`.

## Stack

- React 19 (`react`, `react-dom`)
- TypeScript 5.8 (solution-wide tsconfigs)
- Vite 7 as the build tool and dev server
- Free + lightweight: only React + Vite. No icon font, no emoji, no animation library.
- Fonts: Instrument Serif, Inter, IBM Plex Mono — loaded from Google Fonts via preconnect.
- Backend (Phase 3 + 4): Python 3.11 + FastAPI + SQLAlchemy 2.0 + Alembic + psycopg v3; owner auth + CSRF + rate limiting in `backend/`.

## What is implemented

- **Hero** — name, professional-identity line, headline, subheading, resume + Projects actions, positioning tag, quick-facts row, and the interactive constellation.
- **Interactive constellation** (`src/components/Constellation.tsx`) — SVG node graph of identity / current work / projects / skills / achievements. Pointer hover + click, keyboard (Tab to focus a node, Enter/Space to select, Escape to clear), touch-friendly targets below 860px, and an sr-only text index. Decorative animation is disabled under `prefers-reduced-motion`.
- **Responsive navigation** (`src/components/TopBar.tsx`) — sticky nav, active-section highlighting, links to featured case studies, and a mobile panel with Escape close, body scroll lock, and auto-close on link follow.
- **Featured projects + project library (API-backed)** — the public project library, cards, search, and `#cases/<id>` routes load from `GET /api/v1/projects` (`src/api/client.ts` + `usePublishedProjects`), which returns published projects only. Drafts are never fetched on the public side. Search covers title, direction, summary, and stack. **Case-study pages render structured, verified sections** (problem, intended users, solution, contribution, architecture & data flow, challenges & lessons, verified outcomes, references) persisted in the database via migration `0003` and editable through the admin API. Sections only appear when verified content exists; empty/unavailable ids show a not-found state.
- **Case-study routes** — hash-based `#cases/<id>`. Selecting a case study updates the URL and view immediately; direct URL loads, browser Back/Forward, the TopBar case-study links, and the "Projects" return link all work. Unknown ids fall back safely to the library. Focus is moved to the case-study heading on open and back to the Projects heading on return.
- **Project search + filters** — case-insensitive search across title, direction, summary, intended users, and tags; combines with the All / Featured / Library filters; live result count; empty state with a reset control.
- **Sections** — About, Projects, Experience, Skills, Achievements, Contact, plus Footer, skip-to-content link, semantic `<section>`s with `aria-labelledby`.
- **Graceful missing assets** — portrait and resume fallbacks (see below).
- **Owner console route** — `#/admin` renders a private, mobile-friendly project manager (login, list/create/edit/draft, publish/unpublish, owner-only preview, confirmed delete) wired to the owner-only backend API with CSRF on every write. The guard is UX-only; the backend enforces authorization and draft isolation.

## Verification

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc -b` | clean |
| Lint | `npm run lint` | clean |
| Build | `npm run build` | clean (React + Vite production bundle in `dist/`) |

The frontend has no automated test framework; verification is the type check, lint, and build above. The interactions listed under "Case-study routes" and "Project search + filters" were **not** browser-automated in this environment.

The backend (`backend/`) has a pytest suite (`33 passed`) and the public
portfolio now consumes `GET /api/v1/projects` for its project library, cards,
search, and rich case-study sections. Migrations (`0001 → 0002 → 0003`) compile
offline for PostgreSQL, but **no live database existed in this environment** —
the feed, auth, and CRUD were validated against SQLite only. See the backend
section below.

## Backend (Phase 3 + 4 — FastAPI + PostgreSQL)

A small FastAPI service lives in `backend/`. It serves published projects
(read-only) and now provides a **secure owner-only authentication foundation**
(Phase 4). The public frontend does not consume the API yet; the auth
foundation is the base for a future `/admin` area. There is still no admin
editing, drafts/publishing, password-reset **email**, contact delivery, or
deployment.

- Python 3.11+, FastAPI, SQLAlchemy 2.0, Alembic, psycopg (v3), Pydantic v2.
- Versioned prefix `/api/v1`.
- Public endpoints:
  - `GET /api/v1/health` — liveness only; returns status/service/version/environment with no secrets.
  - `GET /api/v1/projects` — **published projects only**, alphabetical by title.
- Owner auth:

  - `POST /api/v1/auth/login` — owner login; generic errors, bcrypt-hashed
    passwords, sliding-window rate limiting (in-memory, 5/15min per IP).
  - `GET /api/v1/auth/me` — current owner, or 401.
  - `POST /api/v1/auth/logout` — CSRF-protected logout that invalidates sessions.
  - `POST /api/v1/admin/ping` — owner-only demo endpoint (CSRF + session).
  - Owner project management (all require a valid owner session; writes also
    require the CSRF token; no public registration):
    - `GET /api/v1/admin/projects` — list all, drafts included.
    - `GET /api/v1/admin/projects/{id}` — one project, drafts included (owner preview source).
    - `POST /api/v1/admin/projects` — create (draft by default; 409 on duplicate id).
    - `PATCH /api/v1/admin/projects/{id}` — partial update.
    - `DELETE /api/v1/admin/projects/{id}` — safe delete.
    - `POST /api/v1/admin/projects/{id}/publish` and `.../unpublish`.

  Drafts (`is_published=false`) are never returned by the public endpoint.
  The public site is still static (`src/data/content.ts`); publishing persists
  in the database and the public API reflects it, but the public React site is
  **not yet wired to consume the API** — that integration is the remaining work.

  Sessions are opaque tokens in HttpOnly cookies (only SHA-256 hashes are
  stored); a double-submit CSRF cookie protects state-changing requests;
  there is no public registration.

- Consistent error envelope: `{ "error": { "code", "message", "request_id" } }`.
- CORS uses an explicit, environment-driven allowlist (`CORS_ORIGINS`) with
  credentials; session/CSRF cookie flags are configurable for production
  separate-origin deployment (`COOKIE_SECURE`/`COOKIE_SAMESITE`).
- `DATABASE_URL` (SQLAlchemy URL, psycopg driver) is read from the environment — no hardcoded credentials.

Run and test:

```
cd backend
python -m venv .venv && source .venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
cp .env.example .env                                     # then set DATABASE_URL
alembic upgrade head                                     # requires PostgreSQL
python -m app.scripts.create_owner                       # after the DB exists
python -m app.scripts.seed_projects                      # seed verified flagship projects (idempotent)
uvicorn app.main:app --reload --port 8000                # http://127.0.0.1:8000/docs
python -m pytest -q                                       # 33 passed (uses SQLite, no DB needed)
```

See `backend/README.md` for the full auth design, owner creation, cookie/CSRF
production settings, and the not-implemented boundaries.

**Verification status (Phase 4.1):** the auth flow was verified end-to-end on a
SQLite engine through the real app code, and both migrations compile for
PostgreSQL offline (`alembic upgrade head --sql`). A real PostgreSQL instance
was **not** available in this environment, so live-DB verification remains
outstanding; provision one and run the documented steps in `backend/README.md`.

### API contract for the future frontend integration

The backend intentionally does not replace `src/data/content.ts` in this phase. When the frontend migrates (a later phase), `GET /api/v1/projects` returns an array shaped like the front-end `Project` subset:

```json
[
  {
    "id": "skillforge",
    "title": "SkillForge",
    "direction": "AI-powered learning platform",
    "summary": "...",
    "stack": ["AI", "RAG", "FAISS"],
    "is_published": true,
    "updated_at": "2026-10-11T00:00:00Z"
  }
]
```

The frontend would fetch this from a base URL (e.g. `VITE_API_URL`), with its own origin included in `CORS_ORIGINS` on the backend.

## Structure

- `src/data/` — single source of truth for all copy, nav, asset paths, and the constellation graph (`content.ts`, `constellation.ts`). Edit these to change the site; no build step required.
- `src/hooks/` — `useMediaQuery`, `useAssetStatus`, `useActiveSection`, `useCaseStudyRoute`.
- `src/components/` — TopBar, Hero, Constellation, Portrait, ResumeAction, ProjectCard, CaseStudy, SectionShell, Reveal, Footer, plus inline SVG icons.
- `src/sections/` — About, Projects, Experience, Skills, Achievements, Contact.
- `src/styles/` — design tokens + base reset/expose, plus per-component stylesheets imported by the components that own them.
- `public/` — static assets served at site root: portrait + resume placeholders with placement instructions.
- `backend/` — FastAPI service (app, models, schemas, Alembic migrations, pytest suite); see its own `backend/README.md`.

## Assets and assets-not-yet-added

### Portrait (missing)

Place the portrait image here:

```
public/portrait/sathvika-sketch.png
```

Until it exists, an elegant crosshatch "SG" placeholder is shown in the hero. A different stock photo is never presented as if it were Sathvika. The path is configured in `src/data/content.ts` under `assets.portrait.path`.

### Resume (missing)

Place the resume PDF here:

```
public/resume/sathvika-gudise-resume.pdf
```

The resume control HEAD-probes for the PDF. Until it exists, the buttons explain exactly where to put the file instead of leading to a 404. The path is configured in `src/data/content.ts` under `assets.resume.path`.

### Favicon (missing)

No favicon is set, so the browser requests `favicon.ico` and gets a harmless 404.

### Contact (not configured)

`contact.email` and `contact.links` in `src/data/content.ts` are empty, so the Contact section shows an honest "not configured" state. Fill them with real, owned channels to render them.

## Adding real content

- All site copy, nav links, skills, projects, experience, achievements, and contact info live in `src/data/content.ts` — editable in place.
- Projects and achievements use explicit review flags: `underReview: true` renders an "under review" label; verified entries show as fact. Do not mark unverified claims as verified.
- Skills are grouped as plain lists — there are no proficiency bars or percentages by design.

## Not implemented yet (future phases)

- Editing the structured case-study sections from the owner admin form (complete) — API, schemas, migration, seed, public rendering, and the form UI are in place.
- Skills/experience/achievement editing (owner CRUD covers projects only)
- Password-reset email delivery
- Contact-form email delivery
- Production deployment (frontend or backend)

The public page has no admin entry point in the nav; the owner console is
reached via `#/admin` and the footer "Admin" link. The admin project manager is
fully functional against the API (list/create/edit/draft/publish/unpublish/
preview/delete), but it was not browser-tested in this environment and has only
been exercised via automated API tests. Don't assume any email functionality
exists.

## Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section>` with `aria-labelledby`, `<nav>`, `<footer>`, skip-to-content link.
- Keyboard: constellation nodes are tabbable; Enter/Space selects, Escape clears. The mobile menu closes on Escape and returns focus to the toggle. Case-study open/return moves focus to the relevant heading. Visible focus styles throughout.
- Live regions: the constellation detail panel and the project result count announce updates.
- Responsive: mobile layouts are designed, not just scaled-down desktop.
- Respects `prefers-reduced-motion`.
- SSR/static-friendly fallback: the constellation has an sr-only text index so screen readers and non-JS contexts get the same content.

## Documentation files

- `PROJECT_STATUS.md` — current phase, what's implemented, what's unresolved, and the recommended next path.
- This file (`README.md`).
- `RILL-WALKTHROUGH.md` — a walkthrough of the hero constellation flow.

## Repo hygiene

- `npm run lint` and `npx tsc -b` should stay clean. Keep it that way.
- Don't commit secrets, real credentials, or the actual portrait PDF until ready — asset paths are documented, not embedded in the UI as fake downloads.
