from database import SessionLocal, get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User
from schemas.user import UserCreate, UserLogin
from core.security import hash_password, verify_password
from core.auth import create_access_token

