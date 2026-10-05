"""
app/seed.py
-----------
Pobla la base de produccion con el admin y los productos de demo.
Se lee con: python -m app.seed

Variables necesarias en el entorno:
  DATABASE_URL          La External Database URL de Render
  SEED_ADMIN_EMAIL      Email del admin de produccion
  SEED_ADMIN_PASSWORD   Contrasena del admin de produccion

Idempotente: si el admin o los productos ya existen, no los duplica.
"""
import os
import sys

# Forzar DATABASE_URL antes de importar app para que settings la levante
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("ERROR: falta la variable DATABASE_URL en el entorno.")
    sys.exit(1)

from app.db.database import SessionLocal, engine, Base
from app import models
from app.core.security import hash_password

PRODUCTOS_DEMO = [
    {
        "nombre": "Tiramisu Clasico",
        "precio_final": 7500.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 2500.0,
        "garantia_meses": 0,
        "stock": 20,
        "imagen_url": "/demo/tiramisu.jpg",
    },
    {
        "nombre": "Torta de Amor",
        "precio_final": 12000.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 2000.0,
        "garantia_meses": 0,
        "stock": 10,
        "imagen_url": "/demo/torta-amor.jpg",
    },
    {
        "nombre": "Volcan de Chocolate",
        "precio_final": 5500.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 1833.33,
        "garantia_meses": 0,
        "stock": 30,
        "imagen_url": "/demo/volcan.jpg",
    },
    {
        "nombre": "Macaron de Pistacho",
        "precio_final": 9800.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 3266.67,
        "garantia_meses": 0,
        "stock": 15,
        "imagen_url": "/demo/macaron-pistacho.jpg",
    },
    {
        "nombre": "Tarta de Limon",
        "precio_final": 8200.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 2733.33,
        "garantia_meses": 0,
        "stock": 25,
        "imagen_url": "/demo/tarta-limon.jpg",
    },
]


def run():
    admin_email = os.environ.get("SEED_ADMIN_EMAIL")
    admin_password = os.environ.get("SEED_ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("ERROR: faltan SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD.")
        sys.exit(1)

    # Crear tablas si no existen (primer run)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # --- Admin ---
        existente = db.query(models.Usuario).filter(models.Usuario.email == admin_email).first()
        if not existente:
            admin = models.Usuario(
                nombre="Admin Gourmet",
                email=admin_email,
                hashed_password=hash_password(admin_password),
                rol="admin",
                activo=True,
                acepto_tratamiento=True,
            )
            db.add(admin)
            db.commit()
            print(f"Admin creado: {admin_email}")
        else:
            print(f"Admin ya existe: {admin_email} (sin cambios)")

        # --- Productos ---
        for datos in PRODUCTOS_DEMO:
            existe = db.query(models.Producto).filter(models.Producto.nombre == datos["nombre"]).first()
            if not existe:
                producto = models.Producto(**datos)
                db.add(producto)
                print(f"Producto creado: {datos['nombre']}")
            else:
                print(f"Producto ya existe: {datos['nombre']} (sin cambios)")

        db.commit()
        print("\nSeed listo.")

    finally:
        db.close()


if __name__ == "__main__":
    run()
