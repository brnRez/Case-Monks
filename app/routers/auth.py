from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.services import data_service
from app.security import auth_handler

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = data_service.get_user_by_email(form_data.username)
    if user is None or form_data.password != user['password']:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = auth_handler.create_access_token(
        data={"sub": user['email'], "role": user['role']}
    )
    return {"access_token": access_token, "token_type": "bearer"}