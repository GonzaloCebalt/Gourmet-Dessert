const BASE_URL = "/api";

export async function getProductos() {
  const response = await fetch(`${BASE_URL}/productos`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }
  return response.json();
}
