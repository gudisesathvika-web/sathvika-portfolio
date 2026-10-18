"""About content schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AboutFact(BaseModel):
    label: str = Field(min_length=1, max_length=100)
    value: str = Field(min_length=1, max_length=200)


class AboutBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    paragraphs: list[str] = Field(default_factory=list)
    facts: list[AboutFact] = Field(default_factory=list)


class AboutPublic(AboutBase):
    model_config = ConfigDict(from_attributes=True)

    is_published: bool
    updated_at: datetime


class AboutUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    paragraphs: list[str] | None = None
    facts: list[AboutFact] | None = None
    is_published: bool | None = None