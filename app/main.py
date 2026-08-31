from fastapi import FastAPI, status, Depends, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from .database import engine, Base, get_db
from . import models, schemas
from .services import productos as productos_service

# Crea tablas si no existen (respaldo; las migraciones son via Alembic)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gourmet Dessert IRESM - API",
    description="API oficial del e-commerce de postres artesanales Gourmet Dessert.",
    version="1.0.0",
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/", summary="Bienvenida a la API", tags=["General"])
async def root():
    return {
        "bienvenida": "¡Bienvenidos a Gourmet Dessert! 🍰",
        "frontend": "/ui",
        "documentacion": "/docs",
    }


@app.get(
    "/productos",
    response_model=list[schemas.ProductoOut],
    summary="Listado de productos",
    tags=["Productos"],
)
async def get_productos(
    response: Response,
    skip: int = 0,
    limit: int = 10,
    nombre: str | None = None,
    precio_max: float | None = None,
    db: Session = Depends(get_db),
):
    # Obtenemos el total de productos sin paginar y lo metemos en los Headers
    total_count = productos_service.contar_productos(db, nombre, precio_max)
    response.headers["X-Total-Count"] = str(total_count)
    
    return productos_service.listar_productos(db, skip, limit, nombre, precio_max)


@app.post(
    "/productos",
    response_model=schemas.ProductoOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo producto",
    tags=["Productos"],
)
async def create_producto(
    producto: schemas.ProductoCreate,
    db: Session = Depends(get_db),
):
    """
    Crea un nuevo producto en el catálogo.
    El campo **id** es asignado automáticamente por la base de datos.
    """
    return productos_service.crear_producto(db, producto)


@app.get("/ui", include_in_schema=False)
async def serve_frontend():
    index_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(index_path)
