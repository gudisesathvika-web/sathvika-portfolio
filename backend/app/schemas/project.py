"""Project schemas.

`ProjectPublic` is the response shape for the read-only public endpoint
(published case-study sections included — every section is optional and
defaults to an empty value so old rows serialize cleanly).
`ProjectCreate` is used for new drafts via the admin API.
`ProjectUpdate` is a partial update for owner-only edits (all fields optional).
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

ProjectLink = dict[str, str]


class ProjectBase(BaseModel):
    id: str = Field(min_length=1, max_length=64, pattern=r"^[a-z0-9][a-z0-9-]*$")
    title: str = Field(min_length=1, max_length=200)
    direction: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1, max_length=2000)
    stack: list[str] = Field(default_factory=list)

    # Structured case-study sections (verified content only; optional).
    problem: list[str] = Field(default_factory=list)
    users: str = Field(default="", max_length=2000)
    solution: list[str] = Field(default_factory=list)
    my_contribution: list[str] = Field(default_factory=list)
    stack_detail: list[str] = Field(default_factory=list)
    architecture: list[str] = Field(default_factory=list)
    challenges: list[str] = Field(default_factory=list)
    outcomes: list[str] = Field(default_factory=list)
    links: list[ProjectLink] = Field(default_factory=list)


class ProjectCreate(ProjectBase):
    is_published: bool = False


class ProjectPublic(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    is_published: bool
    updated_at: datetime


class ProjectUpdate(BaseModel):
    """Partial update for owner-only edits. All fields optional."""

    title: str | None = Field(default=None, min_length=1, max_length=200)
    direction: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, min_length=1, max_length=2000)
    stack: list[str] | None = None
    is_published: bool | None = None

    problem: list[str] | None = None
    users: str | None = Field(default=None, max_length=2000)
    solution: list[str] | None = None
    my_contribution: list[str] | None = None
    stack_detail: list[str] | None = None
    architecture: list[str] | None = None
    challenges: list[str] | None = None
    outcomes: list[str] | None = None
    links: list[ProjectLink] | None = None
