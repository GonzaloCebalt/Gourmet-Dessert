from pydantic import BaseModel, Field
from typing import List
from decimal import Decimal
from datetime import datetime

# Lo que el CLIENTE manda (sin precios, sin total, sin usuario_id)
class ItemIn(BaseModel):
    producto_id: int
    cantidad: int = Field(gt=0, description="Debe ser mayor a cero")

class PedidoCreate(BaseModel):
    items: List[ItemIn] = Field(min_length=1, description="Al menos un item es requerido")

# Lo que el SERVIDOR devuelve
class ItemOut(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: Decimal
    model_config = {"from_attributes": True}

class PedidoOut(BaseModel):
    id: int
    estado: str
    total: Decimal
    creado_en: datetime
    items: List[ItemOut]
    model_config = {"from_attributes": True}
