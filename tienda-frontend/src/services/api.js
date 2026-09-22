const BASE_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProductos({ page = 0, limit = 4, nombre = "" } = {}) {
  const skip = page * limit;
  const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
  if (nombre) params.append("nombre", nombre);

  const response = await fetch(`${BASE_URL}/productos/?${params.toString()}`);
  if (!response.ok) throw new Error(`Error al obtener productos: ${response.status}`);

  const data = await response.json();
  const totalStr = response.headers.get("X-Total-Count");
  const total = totalStr ? parseInt(totalStr, 10) : 0;
  return { data, total };
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });
  if (!response.ok) throw new Error("Credenciales incorrectas");
  return response.json();
}

export async function register(nombre, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password, acepto_tratamiento: true }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Error al registrarse");
  }
  return response.json();
}

export async function getMe() {
  const response = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders() });
  if (!response.ok) throw new Error("No autenticado");
  return response.json();
}

export async function crearPedido(items) {
  const body = {
    items: items.map(i => ({ producto_id: i.id, cantidad: i.cantidad }))
  };
  const response = await fetch(`${BASE_URL}/pedidos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  if (response.status === 401) throw new Error("Tu sesion vencio. Vuelve a iniciar sesion.");
  if (response.status === 409) {
    const err = await response.json();
    throw new Error(err.detail);
  }
  if (!response.ok) throw new Error("Algo salio mal al confirmar el pedido.");
  return response.json();
}

export async function getMisPedidos() {
  const response = await fetch(`${BASE_URL}/pedidos/mios`, { headers: authHeaders() });
  if (!response.ok) throw new Error("No se pudieron cargar tus pedidos.");
  return response.json();
}

export async function updateStock(producto_id, stock) {
  const response = await fetch(`${BASE_URL}/productos/${producto_id}/stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ stock }),
  });
  if (!response.ok) throw new Error("Error al actualizar el stock");
  return response.json();
}


export async function revocarPedido(pedidoId) {
  const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/revocacion`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (response.status === 401) throw new Error("Tu sesion vencio. Vuelve a iniciar sesion.");
  if (response.status === 404) { const e = await response.json(); throw new Error(e.detail || "Pedido no encontrado"); }
  if (response.status === 409) { const e = await response.json(); throw new Error(e.detail); }
  if (!response.ok) throw new Error("Error al procesar la revocacion.");
  return response.json();
}

export async function getMisDatos() {
  const response = await fetch(`${BASE_URL}/usuarios/me/datos`, { headers: authHeaders() });
  if (!response.ok) throw new Error("No se pudieron obtener tus datos.");
  return response.json();
}

export async function exportarDatos() {
  const response = await fetch(`${BASE_URL}/usuarios/me/exportar`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Error al exportar.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mis_datos.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function eliminarMiCuenta() {
  const response = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok && response.status !== 204) throw new Error("Error al dar de baja la cuenta.");
}
