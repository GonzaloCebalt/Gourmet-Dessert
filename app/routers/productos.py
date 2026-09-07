from fastapi import APIRouter, status, Depends, Response
from sqlalchemy.orm import Session
from app.schemas import producto as schemas
from app.services import productos as productos_service
from app.dependencies import get_db, require_admin

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
    db: Session = Depends(get_db), current_user=Depends(require_admin),
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
    Crea un nuevo producto en el catálogo.
    El campo **id** es asignado automáticamente por la base de datos.
    """
    return productos_service.crear_producto(db, producto)


