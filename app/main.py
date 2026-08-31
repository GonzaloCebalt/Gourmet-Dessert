from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os

from .database import engine, Base, get_db
from . import models

# CREAR LAS TABLAS EN POSTGRES
models.Base.metadata.create_all(bind=engine)

class Producto(BaseModel):
    id: int
    nombre: str
    precio_final: float
    cuotas_cantidad: int
    cuotas_valor: float
    garantia_meses: int
    stock: int
    
    class Config:
        from_attributes = True

app = FastAPI(
    title="Gourmet Dessert IRESM - API",
    description="API oficial del e-commerce de postres artesanales Gourmet Dessert.",
    version="1.0.0"
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

@app.get("/productos", response_model=list[Producto], summary="Listado de productos", tags=["Productos"])
async def get_productos(db: Session = Depends(get_db)):
    productos = db.query(models.Producto).all()
    return productos

@app.post("/productos", response_model=Producto, status_code=status.HTTP_201_CREATED, summary="Crear un nuevo producto", tags=["Productos"])
async def create_producto(producto: Producto, db: Session = Depends(get_db)):
    nuevo_producto = models.Producto(
        id=producto.id,
        nombre=producto.nombre,
        precio_final=producto.precio_final,
        cuotas_cantidad=producto.cuotas_cantidad,
        cuotas_valor=producto.cuotas_valor,
        garantia_meses=producto.garantia_meses,
        stock=producto.stock
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@app.get("/ui", include_in_schema=False)
async def serve_frontend():
    index_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(index_path)
