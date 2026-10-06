import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { urlImagen } from "../utils/imagenes";
import AdminModal from "./AdminModal";

const EMOJIS = ["\uD83C\uDF70","\uD83E\uDDC1","\uD83C\uDF6B","\uD83C\uDF6C","\uD83C\uDF6D","\uD83C\uDF6E","\uD83C\uDF6F","\uD83C\uDF82","\uD83C\uDF69","\uD83C\uDF6A","\uD83E\uDD67","\uD83C\uDF61","\uD83C\uDF67","\uD83C\uDF68","\uD83C\uDF66","\uD83E\uDD6E"];
function emojiPara(nombre, id) {
  const n = nombre.toLowerCase();
  if (n.includes("torta") || n.includes("amor")) return "\uD83C\uDF82";
  if (n.includes("volcan") || n.includes("dulce")) return "\uD83C\uDF6E";
  if (n.includes("esponja")) return "\uD83E\uDDFC";
  if (n.includes("morcilla") || n.includes("chocolate")) return "\uD83C\uDF6B";
  if (n.includes("limon")) return "\uD83C\uDF4B";
  if (n.includes("cactus") || n.includes("matcha")) return "\uD83C\uDF35";
  if (n.includes("alfiletero") || n.includes("fresa")) return "\uD83C\uDF53";
  if (n.includes("tomate") || n.includes("cacao")) return "\uD83C\uDF45";
  if (n.includes("piedra") || n.includes("avellana")) return "\uD83E\uDD5C";
  if (n.includes("tiramisu")) return "\u2615";
  if (n.includes("macaron") || n.includes("pistacho")) return "\uD83C\uDF75";
  return EMOJIS[id % EMOJIS.length];
}

export default function ProductCard({ id, nombre, precio_final, cuotas_cantidad, cuotas_valor, stock, imagen_url, usuario, onUpdateStock, onUpdateImagen }) {
  const emoji = emojiPara(nombre, id);
  const { agregar, cantidadEnCarrito } = useCarrito();
  const [aviso, setAviso] = useState(false);
  const [stockActual, setStockActual] = useState(stock);
  const [imagenActual, setImagenActual] = useState(imagen_url);
  const [showModal, setShowModal] = useState(false);

  const isAdmin = usuario?.rol === "admin";
  const enCarrito = cantidadEnCarrito(id);
  // Stock disponible en tiempo real = stock real menos lo que ya hay en el carrito
  const stockDisponible = Math.max(0, stockActual - enCarrito);
  const sinStock = stockActual === 0;
  const llegueAlMax = enCarrito >= stockActual;

  const handleAgregar = () => {
    if (sinStock || llegueAlMax) return;
    const exito = agregar({ id, nombre, precio_final, stock: stockActual }, 1);
    if (!exito) {
      setAviso(true);
      setTimeout(() => setAviso(false), 2500);
    }
  };

  const handleUpdateStock = (nuevoStock) => {
    setStockActual(nuevoStock);
    onUpdateStock && onUpdateStock(nuevoStock);
  };

  const handleUpdateImagen = (nuevaUrl) => {
    setImagenActual(nuevaUrl);
    onUpdateImagen && onUpdateImagen(nuevaUrl);
  };

  const imgUrlCompleta = urlImagen({ imagen_url: imagenActual });

  // Indicador visual de stock: barra de color
  const pct = stockActual > 0 ? Math.min(100, (stockDisponible / stockActual) * 100) : 0;
  const barColor = pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-red-500";

  return (
    <>
      {/* Modal de admin */}
      {showModal && isAdmin && (
        <AdminModal
          producto={{ id, nombre, stock: stockActual, imagen_url: imagenActual }}
          onClose={() => setShowModal(false)}
          onUpdateStock={handleUpdateStock}
          onUpdateImagen={handleUpdateImagen}
        />
      )}

      <div className={`bg-white rounded-3xl flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3D2B1F]/15 group overflow-hidden ${sinStock ? "opacity-70" : ""}`}>

        {/* Imagen con overlay de "sin stock" */}
        <div className="relative">
          {/* Badge IRESM */}
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-white/90 backdrop-blur text-[9px] font-bold rounded-full uppercase tracking-widest text-[#3D2B1F] shadow-sm">
            IRESM
          </div>

          {/* Badge en carrito */}
          {enCarrito > 0 && (
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#3D2B1F] text-[#D4A96A] text-[10px] font-bold rounded-full shadow">
              {enCarrito} en carrito
            </div>
          )}

          {/* Botón editar admin */}
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-3 right-3 z-10 bg-[#3D2B1F]/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-[#3D2B1F] transition shadow flex items-center gap-1"
            >
              {"\u270F\uFE0F"} Editar
            </button>
          )}

          {sinStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 rounded-t-3xl">
              <span className="bg-white text-[#3D2B1F] font-bold text-sm px-4 py-2 rounded-full shadow">Sin stock</span>
            </div>
          )}

          <div className="aspect-square bg-gradient-to-br from-[#F9F0E8] to-[#EEE0D2] flex items-center justify-center text-7xl group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
            {imgUrlCompleta ? (
              <img
                src={imgUrlCompleta}
                alt={nombre}
                loading="lazy"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <span className="drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{emoji}</span>
            )}
          </div>
        </div>

        {/* Franja decorativa marrón */}
        <div className="h-1 bg-gradient-to-r from-[#3D2B1F] via-[#D4A96A] to-[#3D2B1F]" />

        {/* Contenido */}
        <div className="p-5 flex-1 flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4A96A] mb-1">Postre de Autor</p>
          <h3 className="text-base font-bold text-[#3D2B1F] mb-3 leading-tight">{nombre}</h3>

          {/* Stock en tiempo real */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-semibold text-[#8B6952] uppercase tracking-wide">
                {sinStock ? "Sin stock" : `Disponible: ${stockDisponible}`}
              </span>
              {enCarrito > 0 && !sinStock && (
                <span className="text-[10px] text-[#D4A96A] font-bold">{enCarrito} en tu carrito</span>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-[#F2EBE6] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {aviso && (
            <p className="text-xs text-red-500 font-semibold mb-2 bg-red-50 rounded-xl py-1 px-3 text-center">
              No hay más stock disponible
            </p>
          )}

          {/* Precio y botón */}
          <div className="mt-auto pt-4 border-t border-[#F2EBE6]">
            <p className="text-[10px] text-[#B89882] mb-2">{cuotas_cantidad}x de ${cuotas_valor.toLocaleString("es-AR")}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#3D2B1F]">${precio_final.toLocaleString("es-AR")}</span>
              <button
                onClick={handleAgregar}
                disabled={sinStock || llegueAlMax}
                className="bg-[#3D2B1F] text-white p-3 rounded-2xl hover:bg-[#5a402e] hover:scale-105 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 active:scale-95"
                title={sinStock ? "Sin stock" : llegueAlMax ? "Stock máximo alcanzado" : "Agregar al carrito"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
