"""
test_tp_cebalt.py · Tests de la Tarjeta A · Gonzalo Cebalt · DSI2

BT2 · Permisos: cliente contra visitante (Clase 7)
BT9 · Arrepentimiento con correo que no coincide (Clase 9)
"""

# ──────────────────────────────────────────────
# BT2 · Permisos: cliente contra visitante
# ──────────────────────────────────────────────

def test_cliente_no_puede_crear_producto(client, cliente):
    """Un cliente autenticado recibe 403 al intentar crear un producto."""
    headers = {"Authorization": f"Bearer {cliente['access_token']}"}
    r = client.post("/productos/", json={
        "nombre": "Producto Intruso",
        "precio_final": 999.0,
        "cuotas_cantidad": 1,
        "cuotas_valor": 999.0,
        "garantia_meses": 0,
        "stock": 1,
    }, headers=headers)
    assert r.status_code == 403, f"Esperaba 403, obtuve {r.status_code}: {r.text}"


def test_visitante_no_puede_crear_producto(client):
    """Sin sesion (sin token), recibe 401."""
    r = client.post("/productos/", json={
        "nombre": "Producto Intruso",
        "precio_final": 999.0,
        "cuotas_cantidad": 1,
        "cuotas_valor": 999.0,
        "garantia_meses": 0,
        "stock": 1,
    })
    assert r.status_code == 401, f"Esperaba 401, obtuve {r.status_code}: {r.text}"


# ──────────────────────────────────────────────
# BT9 · Arrepentimiento con correo incorrecto
# ──────────────────────────────────────────────

def test_arrepentimiento_correo_incorrecto_no_cancela(client, cliente, producto):
    """
    Revocacion con un usuario que NO es dueño del pedido:
    el pedido debe quedar en estado 'pendiente' (stock no vuelve).

    La ruta POST /pedidos/{id}/revocacion usa get_current_user, 
    por lo que un usuario distinto recibe 404 (pedido no encontrado 
    para ese usuario) — respuesta uniforme que no revela información.
    El stock no vuelve.
    """
    # 1. Comprar como cliente principal
    headers_a = {"Authorization": f"Bearer {cliente['access_token']}"}
    r_compra = client.post("/pedidos/", json={
        "items": [{"producto_id": producto["id"], "cantidad": 2}]
    }, headers=headers_a)
    assert r_compra.status_code == 201, f"No se pudo crear el pedido: {r_compra.text}"
    pedido_id = r_compra.json()["id"]

    def _get_stock(prod_id):
        """Helper: obtiene el stock actual del producto via el listado."""
        productos_resp = client.get("/productos/?skip=0&limit=100").json()
        for p in productos_resp:
            if p["id"] == prod_id:
                return p["stock"]
        return None

    # Stock después de comprar (stock inicial - 2)
    stock_tras_compra = _get_stock(producto["id"])

    # 2. Registrar un segundo usuario (el del "correo incorrecto")
    client.post("/auth/register", json={
        "nombre": "Otro Usuario",
        "email": "otro@prueba.com",
        "password": "clave456",
        "acepto_tratamiento": True,
    })
    r_login_otro = client.post("/auth/login", data={"username": "otro@prueba.com", "password": "clave456"})
    token_otro = r_login_otro.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_otro}"}

    # 3. El otro usuario intenta revocar el pedido ajeno
    r_rev = client.post(f"/pedidos/{pedido_id}/revocacion", headers=headers_b)
    # Debe ser 404 (respuesta uniforme: no revela que el pedido existe)
    assert r_rev.status_code == 404, (
        f"Esperaba 404 (pedido ajeno), obtuve {r_rev.status_code}: {r_rev.text}"
    )

    # 4. El stock NO debe haber vuelto
    stock_final = _get_stock(producto["id"])
    assert stock_final == stock_tras_compra, (
        f"El stock volvio ({stock_final} != {stock_tras_compra}): "
        "la revocacion fue aplicada cuando no debería."
    )
