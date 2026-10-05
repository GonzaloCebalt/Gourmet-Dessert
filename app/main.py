from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.database import engine, Base
from app import models
from app.routers import productos, auth, pedidos, usuarios
from app.core.config import settings
from app.dependencies import get_db

# Crea tablas si no existen (respaldo; las migraciones son via Alembic)
models.Base.metadata.create_all(bind=engine)

# Crea la carpeta de uploads si no existe (Render borra el disco en cada deploy)
Path("uploads/productos").mkdir(parents=True, exist_ok=True)

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

app.include_router(productos.router)
app.include_router(auth.router)
app.include_router(pedidos.router)
app.include_router(usuarios.router)

# Archivos subidos en vivo (efimeros en Render - se pierden al reiniciar)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Imagenes de demo (vienen del repositorio, persisten en Render)
app.mount("/demo", StaticFiles(directory="app/static/demo"), name="demo")


@app.get("/", summary="Bienvenida a la API", tags=["General"])
async def root():
    return {
        "bienvenida": f"Bienvenidos a {settings.PROJECT_NAME}!",
        "documentacion": "/docs",
    }


@app.get("/salud", tags=["Salud"], summary="Verificar estado del servicio y la base de datos")
def salud(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"estado": "ok", "base": "ok"}
