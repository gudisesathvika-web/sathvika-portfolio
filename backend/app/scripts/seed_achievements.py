"""Seed the current verified achievements once (safe, repeatable)."""

from app.database import SessionLocal
from app.models.achievement import Achievement

ACHIEVEMENTS = [
    {"id": "ach-cgpa", "title": "Academic performance — CGPA 9.08/10", "detail": "B.Tech in Artificial Intelligence at Marwadi University (2023-2027) with a current CGPA of 9.08/10.", "category": "Achievement", "achieved_on": "", "display_order": 1, "is_published": True},
    {"id": "ach-bookchapter", "title": "Book chapter — Ethical Implications of Predictive Rehabilitation Technologies", "detail": "Co-author of a book chapter on the ethical implications of predictive technologies in rehabilitation, published by IGI Global in April 2025.", "category": "Achievement", "achieved_on": "April 2025", "link_label": "DOI / chapter listing", "link_url": "https://doi.org/10.4018/979-8-3373-0194-5.ch017", "display_order": 2, "is_published": True},
    {"id": "ach-patent", "title": "Patent filed (India) — Thermal Management System for IT Infrastructure", "detail": "Patent filed in India in 2025 for a Thermal Management System for IT Infrastructure.", "category": "Achievement", "achieved_on": "2025", "display_order": 3, "is_published": True},
    {"id": "ach-cert-azure", "title": "Microsoft Azure Fundamentals (2026)", "detail": "Completed Microsoft Azure Fundamentals in 2026.", "category": "Achievement", "achieved_on": "2026", "display_order": 4, "is_published": True},
    {"id": "ach-cert-aws", "title": "AWS Academy — 6 badges (2025)", "detail": "Earned six AWS Academy badges in 2025.", "category": "Achievement", "achieved_on": "2025", "display_order": 5, "is_published": True},
    {"id": "ach-cert-ibm", "title": "IBM Python 101 (2024)", "detail": "Completed IBM Python 101 in 2024.", "category": "Achievement", "achieved_on": "2024", "display_order": 6, "is_published": True},
    {"id": "ach-cert-oracle", "title": "Oracle SQL (2024)", "detail": "Completed Oracle SQL in 2024.", "category": "Achievement", "achieved_on": "2024", "display_order": 7, "is_published": True},
]


def seed_achievements() -> str:
    with SessionLocal() as db:
        if db.query(Achievement).first() is not None:
            return "exists"
        for item in ACHIEVEMENTS:
            db.add(Achievement(**item))
        db.commit()
    return "created"


def main() -> int:
    print(f"Achievements seed: {seed_achievements()}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())