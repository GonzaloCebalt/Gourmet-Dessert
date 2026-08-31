const BASE_URL = "/api";

export async function getProductos({ page = 0, limit = 2, nombre = "" } = {}) {
  // Calculamos 'skip' a partir de 'page' y 'limit'
  const skip = page * limit;
  
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (nombre) {
    params.append("nombre", nombre);
  }

  const response = await fetch(`${BASE_URL}/productos?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }
  
  // Extraemos los datos JSON y el total de la cabecera
  const data = await response.json();
  const totalStr = response.headers.get("X-Total-Count");
  const total = totalStr ? parseInt(totalStr, 10) : 0;

  return { data, total };
}
