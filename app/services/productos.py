from sqlalchemy.orm import Session
from app import models, schemas


def crear_producto(db: Session, producto: schemas.ProductoCreate) -> models.Producto:
    """Inserta un nuevo producto en la base de datos y lo devuelve."""
    nuevo = models.Producto(**producto.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def listar_productos(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    nombre: str | None = None,
    precio_max: float | None = None,
) -> list[models.Producto]:
    query = db.query(models.Producto)
    if nombre:
        query = query.filter(models.Producto.nombre.ilike(f"%{nombre}%"))
    if precio_max is not None:
        query = query.filter(models.Producto.precio_final <= precio_max)
    return query.offset(skip).limit(limit).all()


def contar_productos(
    db: Session,
    nombre: str | None = None,
    precio_max: float | None = None,
) -> int:
    """Devuelve la cantidad total de productos que coinciden con los filtros (sin paginación)."""
    query = db.query(models.Producto)
    if nombre:
        query = query.filter(models.Producto.nombre.ilike(f"%{nombre}%"))
    if precio_max is not None:
        query = query.filter(models.Producto.precio_final <= precio_max)
    return query.count()
