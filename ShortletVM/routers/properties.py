from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import date, datetime
from sqlalchemy.orm import Session
import models
from database import get_db
from core.dependencies import get_current_user, require_role

router = APIRouter(
    prefix="",
    tags=["Properties and Bookings"]
)


class PropertyModel(BaseModel):
    PropertyName: str
    Description: str
    price: float
    owner_price: float
    bedrooms: str
    city: str
    fullAddress: str
    Ammenities: List[str]
    propertyImage: List[str]
    mgtType: str
    status: str = "available"
    available_from: Optional[date] = None
    available_to: Optional[date] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ["booked", "available", "unavailable"]
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of {allowed_statuses}')
        return v


class PropertyUpdateModel(BaseModel):
    """Model for partial property updates"""
    PropertyName: Optional[str] = None
    Description: Optional[str] = None
    price: Optional[float] = None
    owner_price: Optional[float] = None
    bedrooms: Optional[str] = None
    city: Optional[str] = None
    fullAddress: Optional[str] = None
    Ammenities: Optional[List[str]] = None
    propertyImage: Optional[List[str]] = None
    mgtType: Optional[str] = None
    status: Optional[str] = None
    available_from: Optional[date] = None
    available_to: Optional[date] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is None:
            return v
        allowed_statuses = ["booked", "available", "unavailable"]
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of {allowed_statuses}')
        return v


class BookingModel(BaseModel):
    """Model for creating bookings and calculating commission"""
    property_id: int
    check_in: date
    check_out: date


@router.post("/createProperty/")
def create_property(property: PropertyModel, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["owner", "agent", "admin", 'guest']))):
    new_property = models.Property(PropertyName=property.PropertyName,
                                   Description=property.Description,
                                   price=property.price,
                                   owner_price=property.owner_price,
                                   bedrooms=property.bedrooms,
                                   city=property.city,
                                   fullAddress=property.fullAddress,
                                   Ammenities=property.Ammenities,
                                   propertyImage=property.propertyImage,
                                   mgtType=property.mgtType,
                                   status=property.status,
                                   available_from=property.available_from,
                                   available_to=property.available_to
                                   )

    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    return new_property


@router.get("/properties/")
def get_properties(db: Session = Depends(get_db),):
    properties = db.query(models.Property).all()
    return properties


@router.get("/personal/properties/")
def get_properties(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    properties = db.query(models.Property).all()
    return properties


@router.patch('/editproperties')
def edit_property(property_id: int, property: PropertyUpdateModel, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["owner", "agent", "admin"]))):
    db_property = db.query(models.Property).filter(
        models.Property.id == property_id).first()
    if not db_property:
        return {"error": "Property not found"}

    # Only update fields that are provided (not None)
    for key, value in property.dict(exclude_unset=True).items():
        if value is not None:
            setattr(db_property, key, value)

    db.commit()
    db.refresh(db_property)
    return db_property


@router.delete('/deleteproperty')
def delete_property(property_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["owner", "agent", "admin"]))):
    db_property = db.query(models.Property).filter(
        models.Property.id == property_id).first()
    if not db_property:
        return {"error": "Property not found"}

    db.delete(db_property)
    db.commit()
    return {"message": "Property deleted successfully"}


@router.post("/book/")
def book_property(booking: BookingModel, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Book a property and calculate 3% commission

    Example:
    - Guest books from March 6 to March 8 (2 nights)
    - Property price per night: 10,000
    - Total price: 10,000 * 2 = 20,000
    - Commission (3%): 20,000 * 0.03 = 600
    - Net price: 20,000 - 600 = 19,400
    """

    # Validate dates
    if booking.check_in >= booking.check_out:
        raise HTTPException(
            status_code=400, detail="Check-out date must be after check-in date")

    # Get property
    db_property = db.query(models.Property).filter(
        models.Property.id == booking.property_id
    ).first()

    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    # Calculate number of nights
    num_nights = (booking.check_out - booking.check_in).days
    if num_nights <= 0:
        raise HTTPException(status_code=400, detail="Invalid booking dates")

    # Calculate prices
    total_price = db_property.price * num_nights
    commission = total_price * 0.03  # 3% commission
    net_price = total_price - commission

    # Create booking
    new_booking = models.Booking(
        property_id=booking.property_id,
        guest_id=current_user.id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        total_price=total_price,
        commission=commission,
        net_price=net_price
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Create notifications for all admins, owners, and agents
    privileged_users = db.query(models.User).filter(
        models.User.role.in_(["admin", "owner", "agent"])
    ).all()

    for user in privileged_users:
        notification_message = f"New booking confirmed! Guest booked {db_property.PropertyName} from {booking.check_in} to {booking.check_out}. Commission: {round(commission, 2)} (3%)"

        new_notification = models.Notification(
            user_id=user.id,
            booking_id=new_booking.id,
            property_id=db_property.id,
            guest_id=current_user.id,
            title="Booking Confirmed",
            message=notification_message,
            notification_type="booking_confirmed",
            commission_amount=commission,
            created_at=datetime.utcnow()
        )
        db.add(new_notification)

    db.commit()

    return {
        "booking_id": new_booking.id,
        "property_id": new_booking.property_id,
        "property_name": db_property.PropertyName,
        "guest_id": new_booking.guest_id,
        "check_in": new_booking.check_in,
        "check_out": new_booking.check_out,
        "number_of_nights": num_nights,
        "price_per_night": db_property.price,
        "total_price": total_price,
        "commission_3_percent": round(commission, 2),
        "net_price": round(net_price, 2),
        "notifications_sent_to": len(privileged_users),
        "message": f"Booking confirmed! Commission of {round(commission, 2)} (3%) has been deducted from total price. Notifications sent to all admins, owners, and agents."
    }


@router.get("/bookings/")
def get_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get all bookings for the current user"""
    bookings = db.query(models.Booking).filter(
        models.Booking.guest_id == current_user.id
    ).all()
    return bookings


@router.get("/notifications/")
def get_notifications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get all notifications for the current user"""
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).all()
    return notifications


@router.get("/notifications/unread/")
def get_unread_notifications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get unread notifications for the current user"""
    unread_notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == 0
    ).order_by(models.Notification.created_at.desc()).all()

    return {
        "unread_count": len(unread_notifications),
        "notifications": unread_notifications
    }


@router.patch("/notifications/{notification_id}/read/")
def mark_notification_as_read(notification_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Mark a notification as read"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = 1
    db.commit()
    db.refresh(notification)

    return {"message": "Notification marked as read", "notification": notification}


@router.post("/notifications/mark-all-read/")
def mark_all_notifications_as_read(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Mark all notifications as read for the current user"""
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == 0
    ).all()

    for notification in notifications:
        notification.is_read = 1

    db.commit()

    return {"message": f"Marked {len(notifications)} notifications as read"}
