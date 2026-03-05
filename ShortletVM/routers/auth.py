from database import SessionLocal, get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, RefreshToken
from schemas.user import UserCreate, UserLogin
from core.security import hash_password, verify_password
from core.auth import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from core.dependencies import get_current_user
from jose import jwt, JWTError

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post('/register')
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    hashed_pw = hash_password(user.password)
    new_user = User(full_name=user.full_name, phone_number=user.phone_number, email=user.email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {'message': 'user creted successfully' }

@router.post('/login')
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail='Invalid Credentials')
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail='Invalid Credentials')

    access_token = create_access_token(data={'sub': db_user.email})
    refresh_token = create_refresh_token(data={'sub': db_user.email})

    return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}

@router.get('/me')
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
@router.post('/refresh')
def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")

        if email is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check if the refresh token exists in the database
    db_token = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Create a new access token
    new_access_token = create_access_token(data={"sub": email})

    return {"access_token": new_access_token, "token_type": "bearer"}
