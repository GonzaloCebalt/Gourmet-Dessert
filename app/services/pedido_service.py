from sqlalchemy.orm import Session
from fastapi import HTTPException
from decimal import Decimal
from app import models
from app.schemas.pedido import PedidoCreate

def crear_pedido(db: Session, usuario: models.Usuario, datos: PedidoCreate) -> models.Pedido:
    total = Decimal("0")
    items_a_guardar = []

    try:
        for item_in in datos.items:
            producto = db.query(models.Producto).filter(models.Producto.id == item_in.producto_id).first()

            if not producto:
                raise HTTPException(status_code=404, detail=f"Producto con id {item_in.producto_id} no encontrado")

            if producto.stock < item_in.cantidad:
                raise HTTPException(
                    status_code=409,
                    detail=f"Stock insuficiente para '{producto.nombre}'. Stock disponible: {producto.stock} unidades"
                )

            # Descontar stock y congelar precio
            producto.stock -= item_in.cantidad
            precio_unitario = Decimal(str(producto.precio_final))
            total += precio_unitario * item_in.cantidad

            items_a_guardar.append(models.ItemPedido(
                producto_id=producto.id,
                cantidad=item_in.cantidad,
                precio_unitario=precio_unitario
            ))

        pedido = models.Pedido(
            usuario_id=usuario.id,
            estado="pendiente",
            total=total,
            items=items_a_guardar
        )

        db.add(pedido)
        db.commit()
        db.refresh(pedido)
        return pedido

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
