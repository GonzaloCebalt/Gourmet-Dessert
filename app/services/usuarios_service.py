from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models
from app.core.security import hash_password


def obtener_datos_usuario(db: Session, usuario: models.Usuario) -> dict:
    pedidos_data = []
    for pedido in usuario.pedidos:
        items_data = [
            {
                "producto_id": i.producto_id,
                "cantidad": i.cantidad,
                "precio_unitario": str(i.precio_unitario)
            }
            for i in pedido.items
        ]
        solicitud = pedido.solicitud_revocacion
        pedidos_data.append({
            "id": pedido.id,
            "estado": pedido.estado,
            "total": str(pedido.total),
            "creado_en": pedido.creado_en.isoformat() if pedido.creado_en else None,
            "items": items_data,
            "solicitud_revocacion": {
                "codigo": solicitud.codigo,
                "creada_en": solicitud.creada_en.isoformat()
            } if solicitud else None
        })

    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "rol": usuario.rol,
        "activo": usuario.activo,
        "acepto_tratamiento": usuario.acepto_tratamiento,
        "fecha_consentimiento": usuario.fecha_consentimiento.isoformat() if usuario.fecha_consentimiento else None,
        "fecha_baja": usuario.fecha_baja.isoformat() if usuario.fecha_baja else None,
        "pedidos": pedidos_data
    }


def dar_de_baja(db: Session, usuario: models.Usuario) -> None:
    """Anonimiza el usuario sin borrar la fila (LOPD + Ley 25.326)."""
    usuario.nombre = f"Usuario eliminado #{usuario.id}"
    usuario.email = f"eliminado_{usuario.id}@baja.invalid"
    usuario.hashed_password = hash_password(f"BAJA_{usuario.id}_{datetime.now(timezone.utc).timestamp()}")
    usuario.activo = False
    usuario.fecha_baja = datetime.now(timezone.utc)
    db.commit()
