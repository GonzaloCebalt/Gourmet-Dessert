from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    rol = Column(String)

    pedidos = relationship("Pedido", back_populates="usuario")

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
    estado = Column(String)
    total = Column(Float)

    usuario = relationship("Usuario", back_populates="pedidos")
    items = relationship("ItemPedido", back_populates="pedido")

class ItemPedido(Base):
    __tablename__ = "items_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    producto_id = Column(Integer, ForeignKey("productos.id"))
    cantidad = Column(Integer)
    precio_unitario = Column(Float)

    pedido = relationship("Pedido", back_populates="items")
    producto = relationship("Producto")
