from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.dependencies import get_db, get_current_user
from app import models
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service, revocacion_service
from pydantic import BaseModel

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


class RevocacionOut(BaseModel):
    codigo: str
    pedido_id: int
    creada_en: datetime

    model_config = {"from_attributes": True}


@router.post("/", response_model=PedidoOut, status_code=201)
def checkout(datos: PedidoCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return pedido_service.crear_pedido(db, current_user, datos)


@router.get("/mios", response_model=List[PedidoOut])
def mis_pedidos(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return db.query(models.Pedido).filter(
        models.Pedido.usuario_id == current_user.id
    ).order_by(models.Pedido.creado_en.desc()).all()


@router.get("/{pedido_id}", response_model=PedidoOut)
def get_pedido(pedido_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    if pedido.usuario_id != current_user.id and current_user.rol != "admin":
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


@router.post("/{pedido_id}/revocacion", response_model=RevocacionOut, status_code=201,
             summary="Revocar una compra (Ley 24.240 art.34, Disposicion 954/2025)")
def revocar_pedido(
    pedido_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    return revocacion_service.revocar(db, current_user, pedido_id)
