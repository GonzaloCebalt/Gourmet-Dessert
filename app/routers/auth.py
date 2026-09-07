from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.dependencies import get_db, get_current_user
from app import models
from app.schemas.usuario import UsuarioCreate, UsuarioOut, Token
from app.core.security import hash_password, verificar_password, crear_token
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        hashed_password=hash_password(usuario.password),
        acepto_tratamiento=usuario.acepto_tratamiento
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    if not db_user or not verificar_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas", headers={"WWW-Authenticate": "Bearer"})
    
    access_token_expires = timedelta(minutes=settings.ACCESS_MIN)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_MIN)
    
    payload = {"sub": db_user.email, "rol": db_user.rol}
    
    access_token = crear_token(data=payload, expires_delta=access_token_expires, tipo="access")
    refresh_token = crear_token(data=payload, expires_delta=refresh_token_expires, tipo="refresh")
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/refresh", response_model=Token)
def refresh(request: RefreshRequest, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Refresh token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(request.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        tipo: str = payload.get("tipo")
        if email is None or tipo != "refresh":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    db_user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not db_user:
        raise credentials_exception
        
    access_token_expires = timedelta(minutes=settings.ACCESS_MIN)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_MIN)
    new_payload = {"sub": db_user.email, "rol": db_user.rol}
    
    access_token = crear_token(data=new_payload, expires_delta=access_token_expires, tipo="access")
    refresh_token = crear_token(data=new_payload, expires_delta=refresh_token_expires, tipo="refresh")
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.get("/me", response_model=UsuarioOut)
def get_me(current_user: models.Usuario = Depends(get_current_user)):
    return current_user
