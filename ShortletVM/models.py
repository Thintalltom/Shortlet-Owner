from sqlalchemy import Column, Integer, String, Float, JSON, Date, DateTime
from database import Base
from datetime import datetime


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    PropertyName = Column(String)
    Description = Column(String)
    price = Column(Float)
    owner_price = Column(Float)
    bedrooms = Column(String)
    city = Column(String)
    fullAddress = Column(String)
    Ammenities = Column(JSON)
    propertyImage = Column(JSON)
    mgtType = Column(String)
    status = Column(String, default="available")
    available_from = Column(Date, nullable=True)
    available_to = Column(Date, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    phone_number = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=False)
    role = Column(String, default="owner")
    is_verified = Column(Integer, default=0)
    otp_code = Column(String, nullable=True)
    otp_expiry = Column(String, nullable=True)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer)


class UserDeatils(Base):
    __tablename__ = "user_details"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    profile_picture = Column(String)
    bio = Column(String)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer)
    guest_id = Column(Integer)
    check_in = Column(Date)
    check_out = Column(Date)
    total_price = Column(Float)
    commission = Column(Float)  # 3% of total price
    net_price = Column(Float)  # total_price - commission


class SavedProperty(Base):
    __tablename__ = "saved_properties"

    id = Column(Integer, primary_key=True, index=True)
    # Authenticated user saving the property
    user_id = Column(Integer, index=True)
    property_id = Column(Integer, index=True)  # Property being saved
    role = Column(String)  # Role of user (guest, agent, owner)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)  # Admin, Owner, or Agent
    booking_id = Column(Integer)  # Reference to booking
    property_id = Column(Integer)  # Reference to property
    guest_id = Column(Integer)  # Reference to guest
    title = Column(String)
    message = Column(String)
    # "booking_confirmed", "commission_earned", etc.
    notification_type = Column(String)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    commission_amount = Column(Float, nullable=True)
