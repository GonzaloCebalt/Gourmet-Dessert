from sqlalchemy import Column, Integer, String, Float, Numeric, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    rol = Column(String, default="customer")
    acepto_tratamiento = Column(Boolean, default=False)
    fecha_consentimiento = Column(DateTime(timezone=True), server_default=func.now())
    activo = Column(Boolean, default=True)
    fecha_baja = Column(DateTime(timezone=True), nullable=True)

    pedidos = relationship("Pedido", back_populates="usuario")
    solicitudes = relationship("SolicitudRevocacion", back_populates="usuario")

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    precio_final = Column(Float)
    cuotas_cantidad = Column(Integer)
    cuotas_valor = Column(Float)
    garantia_meses = Column(Integer)
    stock = Column(Integer)

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    estado = Column(String, default="pendiente")
    total = Column(Numeric(12, 2))
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="pedidos")
    items = relationship("ItemPedido", back_populates="pedido", cascade="all, delete-orphan")
    solicitud_revocacion = relationship("SolicitudRevocacion", back_populates="pedido", uselist=False)

class ItemPedido(Base):
    __tablename__ = "items_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    producto_id = Column(Integer, ForeignKey("productos.id"))
    cantidad = Column(Integer)
    precio_unitario = Column(Numeric(12, 2))

    pedido = relationship("Pedido", back_populates="items")
    producto = relationship("Producto")

class SolicitudRevocacion(Base):
    __tablename__ = "solicitudes_revocacion"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    creada_en = Column(DateTime(timezone=True), server_default=func.now())

    pedido = relationship("Pedido", back_populates="solicitud_revocacion")
    usuario = relationship("Usuario", back_populates="solicitudes")
