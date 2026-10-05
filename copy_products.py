import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Producto

local_engine = create_engine('postgresql://postgres:1234@localhost:5432/ecommerce_db')
render_url = "postgresql://gourmet_db_pvlv_user:fnFFxEXQaBss1Q6z2ZVWlqcbyDmzpsPi@dpg-db1qm3p7lnhs73e4ngr0-a.ohio-postgres.render.com/gourmet_db_pvlv"
render_engine = create_engine(render_url)

LocalSession = sessionmaker(bind=local_engine)
RenderSession = sessionmaker(bind=render_engine)

local_db = LocalSession()
render_db = RenderSession()

local_products = local_db.query(Producto).all()
added_count = 0

for p in local_products:
    exists = render_db.query(Producto).filter(Producto.nombre == p.nombre).first()
    if not exists:
        new_p = Producto(
            nombre=p.nombre,
            precio_final=p.precio_final,
            cuotas_cantidad=p.cuotas_cantidad,
            cuotas_valor=p.cuotas_valor,
            garantia_meses=p.garantia_meses,
            stock=p.stock,
            imagen_url=p.imagen_url
        )
        render_db.add(new_p)
        added_count += 1
        print(f"Added {p.nombre}")

render_db.commit()
local_db.close()
render_db.close()

print(f"Successfully copied {added_count} products from local to Render.")
