"""Achievement schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AchievementBase(BaseModel):
    category: str = Field(default="Achievement", min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=200)
    detail: str = Field(default="", max_length=4000)
    achieved_on: str = Field(default="", max_length=100)
    link_label: str = Field(default="", max_length=100)
    link_url: str = Field(default="", max_length=500)
    display_order: int = 0
    is_published: bool = False


class AchievementPublic(AchievementBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    updated_at: datetime


class AchievementCreate(AchievementBase):
    id: str = Field(min_length=1, max_length=64, pattern=r"^[a-z0-9][a-z0-9-]*$")


class AchievementUpdate(BaseModel):
    category: str | None = Field(default=None, min_length=1, max_length=100)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    detail: str | None = Field(default=None, max_length=4000)
    achieved_on: str | None = Field(default=None, max_length=100)
    link_label: str | None = Field(default=None, max_length=100)
    link_url: str | None = Field(default=None, max_length=500)
    display_order: int | None = None
    is_published: bool | None = None