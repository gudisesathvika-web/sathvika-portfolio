"""Schema validation tests."""

import pytest
from pydantic import ValidationError

from app.schemas.project import ProjectCreate


def test_valid_project_create_defaults_to_draft():
    project = ProjectCreate(
        id="valid-id",
        title="A title",
        direction="A direction",
        summary="A summary.",
        stack=["Python", "FastAPI"],
    )
    assert project.is_published is False
    assert project.stack == ["Python", "FastAPI"]


@pytest.mark.parametrize(
    "field, value",
    [
        ("title", ""),
        ("direction", ""),
        ("summary", ""),
        ("id", ""),
        ("id", "Has Spaces"),
    ],
)
def test_invalid_project_create_is_rejected(field, value):
    payload = {
        "id": "valid-id",
        "title": "A title",
        "direction": "A direction",
        "summary": "A summary.",
    }
    payload[field] = value
    with pytest.raises(ValidationError):
        ProjectCreate(**payload)
