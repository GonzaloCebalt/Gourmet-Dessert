const BASE_URL = import.meta.env.VITE_API_URL;

export function urlImagen(producto) {
  if (!producto.imagen_url) return null;
  return `${BASE_URL}${producto.imagen_url}`;
}
