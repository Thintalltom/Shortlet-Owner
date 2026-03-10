from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import models
from database import engine, get_db, init_db
from routers import auth, verification, details, properties, saved_properties
from pathlib import Path

# Initialize database and run migrations
init_db()

app = FastAPI()

# Mount static files for uploads
uploads_path = Path("uploads")
if uploads_path.exists():
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(verification.router)
app.include_router(details.router)
app.include_router(properties.router)
app.include_router(saved_properties.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
