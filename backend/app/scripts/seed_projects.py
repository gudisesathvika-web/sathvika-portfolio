"""Seed verified flagship projects (one time, safe, repeatable).

Usage (from `backend/`, after `alembic upgrade head`):

    python -m app.scripts.seed_projects

Behavior:
- Only VERIFIED, published projects are seeded. Provisional/unverified
  projects (e.g. NeuraHeal, AI Code Review, library entries) are excluded.
- Records whose id already exists are never overwritten: title, direction,
  summary, stack, and publishing state are preserved exactly as the owner left
  them. For EXISTING records, the structured case-study sections are backfilled
  ONLY when currently empty (missing or non-empty content is never touched).
- New records are created with the full verified, published content.
- No metrics, outcomes, links, or claims are invented. Long-form sections are
  copied from `src/data/content.ts` verified flagship entries (underReview=false).

To verify: `python -m pytest -q tests/test_public_projects.py`, or query
`GET /api/v1/projects` after seeding and confirm the two ids appear.
"""

from app.core.ratelimit import reset_login_limiter  # noqa: F401 (ensure imports isolated)
from app.database import SessionLocal
from app.models.project import Project

# Structured case-study sections that may be backfilled for existing records
# (only when currently empty). Never title/direction/summary/stack/status.
CASE_STUDY_FIELDS = (
    "problem",
    "users",
    "solution",
    "my_contribution",
    "stack_detail",
    "architecture",
    "challenges",
    "outcomes",
    "links",
)
_EMPTY_LISTS = (None, [], ())


def _is_empty(value) -> bool:
    if value is None:
        return True
    return value == "" if isinstance(value, str) else value in _EMPTY_LISTS


# Long-form sections copied from src/data/content.ts verified flagship entries.
# Keep synced by hand; do not invent new claims here.
SEED_PROJECTS: list[dict] = [
    {
        "id": "skillforge",
        "title": "SkillForge",
        "direction": "AI-powered learning platform",
        "summary": (
            "An AI-powered learning platform with personalized learning paths "
            "and context-aware responses. Built with FAISS and RAG."
        ),
        "stack": ["AI", "RAG", "FAISS", "Full-stack"],
        "problem": [
            "People trying to build skills often face the same bottleneck: the material is there, but it is not organized around the learner’s current level, gaps, and goals.",
            "Generic learning paths are hard to keep relevant as a person’s progress changes, and context switching between resources makes it harder to stay focused.",
        ],
        "users": "Learners who want a clearer path from where they are today to where they want to be — with responses tied to the material they are actually working through.",
        "solution": [
            "SkillForge is an AI-powered learning platform that generates personalized learning paths and gives context-aware responses.",
            "A core part of the approach uses FAISS for similarity search and RAG for grounding responses in the material the learner is working with, so the assistant is answering from the course content rather than from a generic model reply.",
            "The platform is built around making progress feel navigable: a path, a way to move along it, and a system that can explain the next step in context.",
        ],
        "my_contribution": [
            "I built SkillForge as a full project from the idea through to a working platform, including the learning-path experience and the context-aware response flow.",
            "Personal contribution includes the AI pipeline around FAISS and RAG that connects the learner’s context to relevant content and responses.",
            "This is the project I am most associated with publicly; the available public material describes it as mine and frames it this way.",
        ],
        "stack_detail": [
            "AI / ML — FAISS-based similarity, RAG-style retrieval and response grounding",
            "Full-stack product shape — learning paths, content context, user-facing responses",
            "Python-based AI services and integrations",
        ],
        "architecture": [
            "The platform is organized around a personal learning path: the learner has a current position, an intended direction, and content that can be retrieved and explained on demand.",
            "A similarity/search layer (FAISS) helps the system find material related to what the learner is doing, and a retrieval-augmented flow is used to keep responses tied to that material.",
            "The design goal is that the assistant reads the room — it responds to the learner’s current context instead of giving a generic answer.",
        ],
        "challenges": [
            "Keeping responses grounded and useful is the central challenge: a learning assistant has to be context-aware without becoming vague or overconfident.",
            "Personalized paths are only useful if the recommendations stay coherent as the learner moves, so the experience has to hold together across steps, not just answer one-off questions.",
        ],
        "outcomes": [],
        "links": [],
        "is_published": True,
    },
    {
        "id": "accessguard",
        "title": "AccessGuard",
        "direction": "Web accessibility auditing",
        "summary": (
            "A full-stack accessibility-auditing platform that analyzes live "
            "websites and provides remediation guidance, scores, audit history, "
            "and PDF reports."
        ),
        "stack": ["Accessibility", "Full-stack", "Auditing", "Web"],
        "problem": [
            "Accessibility is often treated as a one-time checklist, even though many websites change constantly and accessibility problems can be introduced by routine updates.",
            "Teams that want to improve accessibility usually need more than a raw list of issues — they need guidance they can act on and a way to track improvement over time.",
        ],
        "users": "Site owners, developers, and teams who want to find accessibility problems on live websites and turn audit results into concrete fixes they can prioritize.",
        "solution": [
            "AccessGuard is a full-stack accessibility-auditing platform that analyzes live websites.",
            "For each audit it provides remediation guidance, scores, audit history, and PDF reports — so the output is not only a problem list but a usable record of where a site stands and how it is trending.",
            "The platform is built around making accessibility audit results actionable: find the issues, understand how to fix them, and keep a history of what changed.",
        ],
        "my_contribution": [
            "I developed AccessGuard as a full-stack platform, including the site-analysis flow, the remediation guidance, and the reporting side (scores, history, and PDF reports).",
            "The project is about turning an audit into something a team can use: the analysis matters, but so does presenting it in a form people can act on.",
            "This is the project I am most associated with publicly; the available public material describes it as mine and frames it this way.",
        ],
        "stack_detail": [
            "Full-stack web application — site analysis, results, history, and reporting",
            "Accessibility auditing domain — issue detection, remediation guidance, scoring",
            "Report generation — PDF reports for audit results",
        ],
        "architecture": [
            "The platform takes a live website as input and audits it for accessibility issues, then turns the results into a structured report rather than an unstructured list.",
            "A score and history make it possible to compare audits over time, which is useful for teams working on accessibility as an ongoing practice rather than a single pass.",
            "PDF reports are part of the core experience because auditors and stakeholders often need a shareable, inspectable summary.",
        ],
        "challenges": [
            "Accessibility auditing is as much about interpretation as detection: an issue is only useful if the guidance explains what to fix and why.",
            "Keeping the audit history and reporting coherent is a product challenge, not just a technical one — the value is in making repeated audits comparable.",
        ],
        "outcomes": [],
        "links": [],
        "is_published": True,
    },
]


def seed_projects() -> dict[str, int]:
    created = 0
    skipped = 0
    filled = 0
    with SessionLocal() as db:
        for record in SEED_PROJECTS:
            existing = db.get(Project, record["id"])
            if existing is None:
                db.add(Project(**record))
                created += 1
                continue

            # Existing record: backfill only empty case-study sections.
            backfilled = False
            for field in CASE_STUDY_FIELDS:
                if (
                    field in record
                    and _is_empty(getattr(existing, field))
                    and not _is_empty(record[field])
                ):
                    setattr(existing, field, record[field])
                    backfilled = True
            if backfilled:
                filled += 1
            else:
                skipped += 1
        db.commit()
    return {"created": created, "filled": filled, "skipped": skipped}


def main() -> int:
    result = seed_projects()
    print(
        f"Seed complete: {result['created']} created, {result['filled']} filled "
        f"(empty sections backfilled), {result['skipped']} skipped. "
        "Existing records are never overwritten."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())