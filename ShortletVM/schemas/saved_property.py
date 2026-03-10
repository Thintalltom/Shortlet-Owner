from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SavedPropertyBase(BaseModel):
    property_id: int


class SavedPropertyCreate(SavedPropertyBase):
    pass


class SavedPropertyResponse(SavedPropertyBase):
    id: int
    user_id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class SavedPropertyList(BaseModel):
    """Response for listing saved properties with property details"""
    id: int
    user_id: int
    property_id: int
    role: str
    created_at: datetime
    property_name: Optional[str] = None
    price: Optional[float] = None
    city: Optional[str] = None

    class Config:
        from_attributes = True
