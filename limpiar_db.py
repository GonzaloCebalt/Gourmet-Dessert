from app.db.database import SessionLocal
from app.models import Producto

db = SessionLocal()

# Buscar y eliminar los que se llaman "string"
productos_string = db.query(Producto).filter(Producto.nombre == 'string').all()
for p in productos_string:
    db.delete(p)

# Agregar 3 productos gourmet nuevos y lindos
nuevos_productos = [
    Producto(nombre="Volcán de Dulce de Leche", precio_final=14000.0, cuotas_cantidad=1, cuotas_valor=14000.0, garantia_meses=1, stock=10),
    Producto(nombre="Tiramisú de Especialidad", precio_final=18000.0, cuotas_cantidad=2, cuotas_valor=9000.0, garantia_meses=1, stock=5),
    Producto(nombre="Macarons de Pistacho (x6)", precio_final=21000.0, cuotas_cantidad=3, cuotas_valor=7000.0, garantia_meses=1, stock=15)
]

db.add_all(nuevos_productos)
db.commit()

print("✅ Base de datos limpiada. Los productos 'string' fueron borrados y reemplazados.")
db.close()
