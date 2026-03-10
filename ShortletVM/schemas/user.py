from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: str
    password: str
    role: str = "guest"  # Default role
    bio: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str
