from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
import models
from database import engine, get_db
from routers import auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)


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


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/createProperty/")
def create_property(property: PropertyModel, db: Session = Depends(get_db)):
    new_property = models.Property(PropertyName=property.PropertyName,
                                   Description=property.Description,
                                   price=property.price,
                                   owner_price=property.owner_price,
                                   bedrooms=property.bedrooms,
                                   city=property.city,
                                   fullAddress=property.fullAddress,
                                   Ammenities=str(property.Ammenities),
                                   propertyImage=str(property.propertyImage),
                                   mgtType=property.mgtType)
    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    return new_property

@app.get("/properties/")
def get_properties(db: Session = Depends(get_db)):
    properties = db.query(models.Property).all()
    return properties

