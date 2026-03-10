from database import SessionLocal, get_db
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from models import UserDeatils, User
from core.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(
    prefix="/details",
    tags=["User Details"]
)


class UserDetailsResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone_number: str
    profile_picture: str | None
    bio: str | None
    is_verified: int
    badge: str | None

    class Config:
        from_attributes = True


@router.get("/me", response_model=UserDetailsResponse)
def get_user_details(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get authenticated user's details including verification status.
    A verification badge is included if user is verified.
    """
    # Get user details from UserDetails table
    user_details = db.query(UserDeatils).filter(
        UserDeatils.user_id == current_user.id).first()

    if not user_details:
        # Create default user details if they don't exist
        user_details = UserDeatils(
            user_id=current_user.id,
            profile_picture=None,
            bio=None
        )
        db.add(user_details)
        db.commit()
        db.refresh(user_details)

    # Determine badge based on verification status
    badge = "verified" if current_user.is_verified else None

    return {
        "id": user_details.id,
        "user_id": user_details.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "profile_picture": user_details.profile_picture,
        "bio": user_details.bio,
        "is_verified": current_user.is_verified,
        "badge": badge
    }
