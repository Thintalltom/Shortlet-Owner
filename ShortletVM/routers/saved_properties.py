from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from database import get_db
from models import SavedProperty, Property, User
from schemas.saved_property import SavedPropertyCreate, SavedPropertyResponse, SavedPropertyList
from core.dependencies import get_current_user
from datetime import datetime

router = APIRouter(
    prefix="/saved-properties",
    tags=["Saved Properties"]
)


@router.post("", response_model=SavedPropertyResponse, status_code=status.HTTP_201_CREATED)
async def save_property(
    saved_property: SavedPropertyCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save a property for authenticated user (guest or agent).
    Role is automatically set based on the authenticated user's role.
    """
    # Verify property exists
    property_obj = db.query(Property).filter(
        Property.id == saved_property.property_id).first()
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Check if already saved
    existing = db.query(SavedProperty).filter(
        and_(
            SavedProperty.user_id == current_user["id"],
            SavedProperty.property_id == saved_property.property_id
        )
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property already saved"
        )

    # Create saved property record
    db_saved = SavedProperty(
        user_id=current_user["id"],
        property_id=saved_property.property_id,
        role=current_user["role"]  # Store the user's role
    )

    db.add(db_saved)
    db.commit()
    db.refresh(db_saved)

    return db_saved


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_property(
    property_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a saved property for the authenticated user.
    """
    saved_property = db.query(SavedProperty).filter(
        and_(
            SavedProperty.user_id == current_user["id"],
            SavedProperty.property_id == property_id
        )
    ).first()

    if not saved_property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved property not found"
        )

    db.delete(saved_property)
    db.commit()

    return None


@router.get("", response_model=list[SavedPropertyList])
async def get_user_saved_properties(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all saved properties for the authenticated user.
    Filtered by user ID and their role.
    """
    saved_properties = db.query(SavedProperty).filter(
        SavedProperty.user_id == current_user["id"]
    ).all()

    # Enrich with property details
    result = []
    for sp in saved_properties:
        property_obj = db.query(Property).filter(
            Property.id == sp.property_id).first()
        if property_obj:
            result.append(
                SavedPropertyList(
                    id=sp.id,
                    user_id=sp.user_id,
                    property_id=sp.property_id,
                    role=sp.role,
                    created_at=sp.created_at,
                    property_name=property_obj.PropertyName,
                    price=property_obj.price,
                    city=property_obj.city
                )
            )

    return result


@router.get("/role-stats/{role}")
async def get_saved_properties_by_role(
    role: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics of saved properties by role.
    Returns count of properties saved by users with specific role.
    """
    # For security, only allow users to see stats for their own role unless they're admin
    if role != current_user["role"] and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this data"
        )

    saved_count = db.query(SavedProperty).filter(
        SavedProperty.role == role).count()

    return {
        "role": role,
        "total_saved": saved_count,
        "saved_properties": db.query(SavedProperty)
        .filter(SavedProperty.role == role)
        .all()
    }


@router.get("/check/{property_id}")
async def check_property_saved(
    property_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if a property is saved by the current user.
    """
    saved = db.query(SavedProperty).filter(
        and_(
            SavedProperty.user_id == current_user["id"],
            SavedProperty.property_id == property_id
        )
    ).first()

    return {"is_saved": saved is not None}
