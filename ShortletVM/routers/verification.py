from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from core.dependencies import get_current_user
from core.email_service import send_otp_email
from pydantic import BaseModel
import random
from datetime import datetime, timedelta

router = APIRouter(prefix="/verify", tags=["Verification"])

class VerifyOTP(BaseModel):
    otp_code: str

@router.post("/send-otp")
def send_otp(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")
    
    otp = str(random.randint(100000, 999999))
    expiry = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
    
    current_user.otp_code = otp
    current_user.otp_expiry = expiry
    db.commit()
    
    email_sent = send_otp_email(current_user.email, otp)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")
    
    return {"message": f"OTP sent to {current_user.email}"}

@router.post("/verify-otp")
def verify_otp(data: VerifyOTP, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")
    
    if not current_user.otp_code or not current_user.otp_expiry:
        raise HTTPException(status_code=400, detail="No OTP sent")
    
    if datetime.utcnow() > datetime.fromisoformat(current_user.otp_expiry):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if current_user.otp_code != data.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    current_user.is_verified = 1
    current_user.otp_code = None
    current_user.otp_expiry = None
    db.commit()
    
    return {"message": "Email verified successfully", "badge": "verified"}
