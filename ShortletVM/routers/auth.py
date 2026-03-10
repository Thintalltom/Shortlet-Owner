from database import SessionLocal, get_db
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from models import User, RefreshToken, UserDeatils
from schemas.user import UserCreate, UserLogin
from core.security import hash_password, verify_password
from core.auth import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from core.dependencies import get_current_user
from jose import jwt, JWTError
import os
import shutil
from pathlib import Path

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def convert_path_to_url(file_path: str) -> str:
    """Convert file path to accessible URL"""
    if not file_path:
        return None
    # Convert backslashes to forward slashes and prepend /
    url_path = file_path.replace("\\", "/")
    if not url_path.startswith("/"):
        url_path = "/" + url_path
    return url_path


@router.post('/register')
async def register_user(
    email: str = Form(),
    full_name: str = Form(),
    phone_number: str = Form(),
    password: str = Form(),
    role: str = Form(default="guest"),
    bio: str = Form(default=None),
    profile_picture: UploadFile = File(default=None),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')

    # Save profile picture if provided
    profile_picture_path = None
    if profile_picture:
        try:
            # Create uploads directory if it doesn't exist
            uploads_dir = Path("uploads/profiles")
            uploads_dir.mkdir(parents=True, exist_ok=True)

            # Save file with user email as identifier
            file_extension = os.path.splitext(profile_picture.filename)[1]
            file_path = uploads_dir / f"{email}{file_extension}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(profile_picture.file, buffer)

            profile_picture_path = str(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload profile picture: {str(e)}")

    hashed_pw = hash_password(password)
    new_user = User(
        full_name=full_name,
        phone_number=phone_number,
        email=email,
        password=hashed_pw,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create user details record
    user_details = UserDeatils(
        user_id=new_user.id,
        profile_picture=profile_picture_path,
        bio=bio if bio else None
    )
    db.add(user_details)
    db.commit()

    return {'message': 'User created successfully', 'user_id': new_user.id}


@router.post('/login')
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail='User does not exist')

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail='Incorrect password')

    access_token = create_access_token(data={'sub': db_user.email})
    refresh_token = create_refresh_token(data={'sub': db_user.email})

    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'bearer',
        'user': {
            'id': db_user.id,
            'email': db_user.email,
            'full_name': db_user.full_name,
            'role': db_user.role,
            'is_verified': db_user.is_verified
        }
    }


@router.post('/token')
def token_login(username: str = Form(), password: str = Form(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail='User does not exist')
    if not verify_password(password, db_user.password):
        raise HTTPException(status_code=401, detail='Incorrect password')

    access_token = create_access_token(data={'sub': db_user.email})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user': {
            'id': db_user.id,
            'email': db_user.email,
            'full_name': db_user.full_name,
            'role': db_user.role,
            'is_verified': db_user.is_verified
        }
    }


@router.get('/me')
def read_users_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch user details
    user_details = db.query(UserDeatils).filter(
        UserDeatils.user_id == current_user.id
    ).first()

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone_number": current_user.phone_number,
        "role": current_user.role,
        "is_verified": current_user.is_verified,
        "bio": user_details.bio if user_details else None,
        "profile_picture": convert_path_to_url(user_details.profile_picture) if user_details else None,
        "badge": "verified" if current_user.is_verified else None
    }


@router.post('/refresh')
def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")

        if email is None or token_type != "refresh":
            raise HTTPException(
                status_code=401, detail="Invalid refresh token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check if the refresh token exists in the database
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token).first()
    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Create a new access token
    new_access_token = create_access_token(data={"sub": email})

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.put('/userProfile')
def update_user_profile(
    full_name: str = Form(default=None),
    phone_number: str = Form(default=None),
    bio: str = Form(default=None),
    profile_picture: UploadFile = File(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    PUT endpoint - Replace entire user profile (all fields required or will be set to None)
    """
    # Update User table
    if full_name is not None:
        current_user.full_name = full_name
    if phone_number is not None:
        current_user.phone_number = phone_number

    # Handle profile picture upload
    profile_picture_path = None
    if profile_picture:
        try:
            uploads_dir = Path("uploads/profiles")
            uploads_dir.mkdir(parents=True, exist_ok=True)

            file_extension = os.path.splitext(profile_picture.filename)[1]
            file_path = uploads_dir / f"{current_user.email}{file_extension}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(profile_picture.file, buffer)

            profile_picture_path = str(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload profile picture: {str(e)}")

    # Update UserDetails table
    user_details = db.query(UserDeatils).filter(
        UserDeatils.user_id == current_user.id
    ).first()

    if not user_details:
        # Create if doesn't exist
        user_details = UserDeatils(
            user_id=current_user.id,
            profile_picture=profile_picture_path,
            bio=bio
        )
        db.add(user_details)
    else:
        # Update existing
        if profile_picture_path:
            user_details.profile_picture = profile_picture_path
        if bio is not None:
            user_details.bio = bio

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    db.refresh(user_details)

    return {
        'message': 'User profile updated successfully',
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'full_name': current_user.full_name,
            'phone_number': current_user.phone_number,
            'bio': user_details.bio,
            'profile_picture': convert_path_to_url(user_details.profile_picture)
        }
    }


@router.patch('/userProfile')
def partial_update_user_profile(
    full_name: str = Form(default=None),
    phone_number: str = Form(default=None),
    bio: str = Form(default=None),
    profile_picture: UploadFile = File(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    PATCH endpoint - Partially update user profile (only provided fields are updated)
    """
    # Update User table if fields provided
    if full_name is not None:
        current_user.full_name = full_name
    if phone_number is not None:
        current_user.phone_number = phone_number

    # Handle profile picture upload
    if profile_picture:
        try:
            uploads_dir = Path("uploads/profiles")
            uploads_dir.mkdir(parents=True, exist_ok=True)

            file_extension = os.path.splitext(profile_picture.filename)[1]
            file_path = uploads_dir / f"{current_user.email}{file_extension}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(profile_picture.file, buffer)

            profile_picture_path = str(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload profile picture: {str(e)}")

    # Update UserDetails table
    user_details = db.query(UserDeatils).filter(
        UserDeatils.user_id == current_user.id
    ).first()

    if not user_details:
        # Create if doesn't exist (only if fields provided)
        if bio is not None or 'profile_picture_path' in locals():
            user_details = UserDeatils(
                user_id=current_user.id,
                profile_picture=profile_picture_path if 'profile_picture_path' in locals() else None,
                bio=bio
            )
            db.add(user_details)
    else:
        # Update only provided fields
        if bio is not None:
            user_details.bio = bio
        if 'profile_picture_path' in locals():
            user_details.profile_picture = profile_picture_path

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    if user_details:
        db.refresh(user_details)

    return {
        'message': 'User profile updated successfully',
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'full_name': current_user.full_name,
            'phone_number': current_user.phone_number,
            'bio': user_details.bio if user_details else None,
            'profile_picture': convert_path_to_url(user_details.profile_picture) if user_details else None
        }
    }
