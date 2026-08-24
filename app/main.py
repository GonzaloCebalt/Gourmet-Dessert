from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

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


@app.get("/ui", include_in_schema=False)
async def serve_frontend():
    """Sirve la interfaz web del e-commerce."""
    index_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(index_path)
