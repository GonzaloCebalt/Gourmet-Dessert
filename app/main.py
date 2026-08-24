from fastapi import FastAPI, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os


class Producto(BaseModel):
    id: int
    nombre: str
    precio_final: float
    cuotas_cantidad: int
    cuotas_valor: float
    garantia_meses: int
    stock: int


# Base de datos simulada en memoria
productos_db: list[Producto] = [
    Producto(
        id=1,
        nombre="Historia de amor",
        precio_final=7000.0,
        cuotas_cantidad=3,
        cuotas_valor=2333.33,
        garantia_meses=1,
        stock=15,
    ),
    Producto(
        id=2,
        nombre="Esponja de lavar",
        precio_final=3000.0,
        cuotas_cantidad=1,
        cuotas_valor=3000.0,
        garantia_meses=1,
        stock=30,
    ),
    Producto(
        id=3,
        nombre="Morcilla dulce",
        precio_final=4500.0,
        cuotas_cantidad=2,
        cuotas_valor=2250.0,
        garantia_meses=1,
        stock=20,
    ),
]



app = FastAPI(
    title="Gourmet Dessert IRESM - API",
    description=(
        "API oficial del e-commerce de postres artesanales Gourmet Dessert, "
        "pensada para los estudiantes del IRESM. "
        "Sujeta a la Ley 24.240 de Defensa del Consumidor (Argentina)."
    ),
    version="1.0.0",
    contact={
        "name": "Gourmet Dessert IRESM",
        "url": "https://iresm.edu.ar",
    },
    license_info={
        "name": "Ley 24.240 - Defensa del Consumidor (Argentina)",
    },
)

# Montamos los archivos estáticos (frontend)
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get(
    "/",
    summary="Bienvenida a la API",
    tags=["General"],
)
async def root():
    """
    Endpoint de bienvenida.

    Devuelve información general sobre la API y el marco legal aplicable.
    """
    return {
        "bienvenida": "¡Bienvenidos a Gourmet Dessert! 🍰",
        "descripcion": (
            "API de e-commerce argentino de postres artesanales "
            "para los estudiantes del IRESM."
        ),
        "ley_aplicable": {
            "nombre": "Ley 24.240 - Defensa del Consumidor",
            "pais": "Argentina",
            "detalle": (
                "Todos los productos y transacciones están amparados "
                "por la Ley 24.240 de Defensa del Consumidor de la "
                "República Argentina."
            ),
        },
        "version": "1.0.0",
        "estado": "activo",
        "frontend": "/ui",
        "documentacion": "/docs",
    }


@app.get(
    "/productos",
    response_model=list[Producto],
    summary="Listado de productos",
    tags=["Productos"],
)
async def get_productos():
    """
    Devuelve la lista completa de productos disponibles en la tienda.
    """
    return productos_db


@app.post(
    "/productos",
    response_model=Producto,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo producto",
    tags=["Productos"],
)
async def create_producto(producto: Producto):
    """
    Recibe los datos de un producto, los valida con Pydantic y lo agrega a la base de datos en memoria.
    """
    productos_db.append(producto)
    return producto




@app.get("/ui", include_in_schema=False)
async def serve_frontend():
    """Sirve la interfaz web del e-commerce."""
    index_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(index_path)
