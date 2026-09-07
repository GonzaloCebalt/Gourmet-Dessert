from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    acepto_tratamiento: bool

    @validator('acepto_tratamiento')
    def validar_consentimiento(cls, v):
        if not v:
            raise ValueError('Debe aceptar el tratamiento de datos personales (Ley 25.326).')
        return v

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
