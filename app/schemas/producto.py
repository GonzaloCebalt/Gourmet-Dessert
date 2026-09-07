from pydantic import BaseModel


class ProductoCreate(BaseModel):
    """Datos necesarios para crear un producto (sin id, lo genera la DB)."""
    nombre: str
    precio_final: float
    cuotas_cantidad: int
    cuotas_valor: float
    garantia_meses: int
    stock: int


class ProductoOut(ProductoCreate):
    """Datos que devuelve la API (incluye id generado por la DB)."""
    id: int

    class Config:
        from_attributes = True
