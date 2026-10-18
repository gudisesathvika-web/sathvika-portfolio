"""Seed the current verified About content once (safe, repeatable).

Usage (from `backend/`):

    python -m app.scripts.seed_about

Behavior:
- Inserts the existing About content only when the table is empty.
- Never overwrites existing About content.
"""

from app.database import SessionLocal
from app.models.about import AboutContent

ABOUT_CONTENT = {
    "title": "Curiosity, ambition, and technology that earns its place.",
    "paragraphs": [
        "I am an AI engineering student who likes building things that actually work. I care less about impressive-sounding systems and more about the moment an idea becomes something people can use.",
        "My work spans AI engineering, software development, automation, and full-stack engineering. I learn by shipping: taking a messy problem apart, choosing the simplest architecture that solves it, and refining until the result feels considered.",
        "Two projects I built, AccessGuard and SkillForge, sit at the center of what I want to be known for: one for making the web more usable, the other for making learning more personal. I describe both honestly — what they do and what I built.",
        "This site is the home for that work, with case studies written to be useful to both recruiters and engineering reviewers.",
    ],
    "facts": [
        {"label": "Focus", "value": "Applied AI & intelligent systems"},
        {"label": "Also building", "value": "Automation & full-stack products"},
        {"label": "Approach", "value": "Independent thinking, working prototypes"},
        {"label": "Status", "value": "Studying · open to opportunities"},
    ],
    "is_published": True,
}


def seed_about() -> str:
    with SessionLocal() as db:
        existing = db.query(AboutContent).first()
        if existing is not None:
            return "exists"
        db.add(AboutContent(**ABOUT_CONTENT))
        db.commit()
    return "created"


def main() -> int:
    result = seed_about()
    print(f"About seed: {result}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
