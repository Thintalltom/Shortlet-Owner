from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

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

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    phone_number = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=False)
    role = Column(String, default="owner")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer)
