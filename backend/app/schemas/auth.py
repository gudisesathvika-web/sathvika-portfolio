"""Authentication schemas.

Login errors are intentionally generic: the response never reveals whether an
account exists.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    # Password-only admin login. No email/username is accepted or required.
    # No minimum password length enforced here: a "password too short" message
    # would leak that an account exists. All failures are treated identically.
    password: str = Field(min_length=1, max_length=256)


class OwnerPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    created_at: datetime


class LoginResponse(BaseModel):
    owner: OwnerPublic
    message: str = "Login successful"


class LogoutResponse(BaseModel):
    message: str = "Logged out"