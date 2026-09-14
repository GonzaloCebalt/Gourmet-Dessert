import secrets
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models


def generar_codigo() -> str:
    fecha = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"ARR-{fecha}-{secrets.token_hex(3).upper()}"


def revocar(db: Session, usuario: models.Usuario, pedido_id: int) -> models.SolicitudRevocacion:
    # 1. Es tuyo (404 si no existe o no te pertenece)
    pedido = db.query(models.Pedido).filter(
        models.Pedido.id == pedido_id,
        models.Pedido.usuario_id == usuario.id
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    # 2. No esta cancelado (409)
    if pedido.estado == "cancelado":
        raise HTTPException(status_code=409, detail="Este pedido ya fue cancelado")

    # 3. Dentro de los 10 dias corridos (Ley 24.240, art. 34; Disposicion 954/2025)
    ahora = datetime.now(timezone.utc)
    dias_transcurridos = (ahora - pedido.creado_en).days
    if dias_transcurridos > 10:
        raise HTTPException(
            status_code=409,
            detail=f"El plazo de revocacion de 10 dias corridos vencio hace {dias_transcurridos - 10} dias (Ley 24.240 art.34, Disp. 954/2025)"
        )

    try:
        # Devolver stock de cada item
        for item in pedido.items:
            producto = db.query(models.Producto).filter(models.Producto.id == item.producto_id).first()
            if producto:
                producto.stock += item.cantidad

        # Cambiar estado
        pedido.estado = "cancelado"

        # Crear solicitud con codigo unico
        solicitud = models.SolicitudRevocacion(
            codigo=generar_codigo(),
            pedido_id=pedido.id,
            usuario_id=usuario.id
        )
        db.add(solicitud)
        db.commit()
        db.refresh(solicitud)
        return solicitud

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
