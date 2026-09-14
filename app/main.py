from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.db.database import engine, Base
from app import models
from app.routers import productos, auth, pedidos, usuarios
from app.core.config import settings

# Crea tablas si no existen (respaldo; las migraciones son via Alembic)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API oficial del e-commerce de postres artesanales Gourmet Dessert.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(productos.router)
app.include_router(auth.router)
app.include_router(pedidos.router)
app.include_router(usuarios.router)

@app.get("/", summary="Bienvenida a la API", tags=["General"])
async def root():
    return {
        "bienvenida": f"Â¡Bienvenidos a {settings.PROJECT_NAME}! ðŸ°",
        "frontend": "/ui",
        "documentacion": "/docs",
    }

@app.get("/ui", include_in_schema=False)
async def serve_frontend():
    index_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(index_path)


