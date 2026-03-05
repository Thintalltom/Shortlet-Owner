from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: str
    password: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
