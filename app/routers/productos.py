from fastapi import APIRouter, status, Depends, Response
from fastapi import UploadFile, File, HTTPException
import os
import secrets
from app.utils.archivos import parece_imagen
from sqlalchemy.orm import Session
from app.schemas import producto as schemas
from app.services import productos as productos_service
from app.dependencies import get_db, require_admin
from app import models

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get(
    "/",
    response_model=list[schemas.ProductoOut],
    summary="Listado de productos",
)
async def get_productos(
    response: Response,
    skip: int = 0,
    limit: int = 10,
    nombre: str | None = None,
    precio_max: float | None = None,
    db: Session = Depends(get_db),
):
    total_count = productos_service.contar_productos(db, nombre, precio_max)
    response.headers["X-Total-Count"] = str(total_count)
    return productos_service.listar_productos(db, skip, limit, nombre, precio_max)

@router.post(
    "/",
    response_model=schemas.ProductoOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo producto",
)
async def create_producto(
    producto: schemas.ProductoCreate,
    db: Session = Depends(get_db), current_user=Depends(require_admin),
):
    """
    Crea un nuevo producto en el catÃ¡logo.
    El campo **id** es asignado automÃ¡ticamente por la base de datos.
    """
    return productos_service.crear_producto(db, producto)



from pydantic import BaseModel
class StockUpdate(BaseModel):
    stock: int

@router.patch(
    "/{producto_id}/stock",
    response_model=schemas.ProductoOut,
    summary="Actualizar stock de un producto",
)
async def update_stock(
    producto_id: int,
    datos: StockUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    from fastapi import HTTPException
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if datos.stock < 0:
        raise HTTPException(status_code=400, detail="El stock no puede ser negativo")
    
    producto.stock = datos.stock
    db.commit()
    db.refresh(producto)
    return producto


MAX_SIZE = 2 * 1024 * 1024 # 2 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("/{producto_id}/imagen", response_model=schemas.ProductoOut)
async def upload_imagen(
    producto_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # 1. Extension (barato)
    ext = os.path.splitext(archivo.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=415, detail="Formato no permitido")

    # 2. Tamano
    contenido = await archivo.read()
    if len(contenido) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="El archivo no puede superar los 2 MB")

    # 3. Firma (caro, despues de leer)
    if not parece_imagen(contenido):
        raise HTTPException(status_code=415, detail="El archivo no parece ser una imagen valida")

    nuevo_nombre = f"{producto_id}-{secrets.token_hex(8)}{ext}"
    ruta_guardado = f"uploads/productos/{nuevo_nombre}"
    
    with open(ruta_guardado, "wb") as f:
        f.write(contenido)
        
    producto.imagen_url = f"/static/productos/{nuevo_nombre}"
    db.commit()
    db.refresh(producto)
    
    return producto
