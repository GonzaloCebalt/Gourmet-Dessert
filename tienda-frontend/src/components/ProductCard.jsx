import { useState, useRef, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { updateStock, subirImagen } from "../services/api";
import { urlImagen } from "../utils/imagenes";

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

export default function ProductCard({ id, nombre, precio_final, cuotas_cantidad, cuotas_valor, garantia_meses, stock, imagen_url, usuario, onUpdateStock, onUpdateImagen }) {
  const emoji = emojiPara(nombre, id);
  const { agregar, cantidadEnCarrito } = useCarrito();
  const [aviso, setAviso] = useState(false);
  const [editandoStock, setEditandoStock] = useState(false);
  const [nuevoStock, setNuevoStock] = useState(stock);
  const [guardando, setGuardando] = useState(false);
  const [stockActual, setStockActual] = useState(stock);
  const [showImgUpload, setShowImgUpload] = useState(false);

  // Estados de la imagen
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorImagen, setErrorImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef(null);

  const isAdmin = usuario?.rol === "admin";
  const enCarrito = cantidadEnCarrito(id);
  const llegueAlMax = enCarrito >= stockActual;
  const sinStock = stockActual === 0;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleAgregar = () => {
    if (sinStock) return;
    const exito = agregar({ id, nombre, precio_final, stock: stockActual }, 1);
    if (!exito) {
      setAviso(true);
      setTimeout(() => setAviso(false), 2500);
    }
  };

  const handleGuardarStock = async () => {
    const val = parseInt(nuevoStock, 10);
    if (isNaN(val) || val < 0) return;
    setGuardando(true);
    try {
      const updated = await updateStock(id, val);
      setStockActual(updated.stock);
      setNuevoStock(updated.stock);
      onUpdateStock && onUpdateStock(updated.stock);
      setEditandoStock(false);
    } catch {
      alert("Error al actualizar el stock");
    } finally {
      setGuardando(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limpiar errores anteriores
    setErrorImagen(null);

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      setErrorImagen("El archivo debe ser una imagen (JPG, PNG, WebP).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setArchivoSeleccionado(null);
      setPreview(null);
      return;
    }

    // Validar tamaño (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorImagen("La imagen supera los 2 MB permitidos.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setArchivoSeleccionado(null);
      setPreview(null);
      return;
    }

    setArchivoSeleccionado(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubirImagen = async () => {
    if (!archivoSeleccionado || subiendo) return;
    setSubiendo(true);
    setErrorImagen(null);
    try {
      const p = await subirImagen(id, archivoSeleccionado);
      onUpdateImagen && onUpdateImagen(p.imagen_url);
      setArchivoSeleccionado(null);
      setPreview(null);
      setShowImgUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setErrorImagen(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const imgUrlCompleta = urlImagen({ imagen_url });

  return (
    <div className={`bg-white p-4 rounded-gourmet flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3D2B1F]/10 group ${sinStock ? "opacity-70" : ""}`}>
      <div className="relative cursor-pointer">
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur text-[9px] font-bold rounded-full uppercase tracking-widest text-[#3D2B1F] shadow-sm">IRESM</div>
        {enCarrito > 0 && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary-brown text-white text-[10px] font-bold rounded-full">{enCarrito} en carrito</div>
        )}
        {sinStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 rounded-[2rem]">
            <span className="bg-white text-[#3D2B1F] font-bold text-sm px-4 py-2 rounded-full shadow">Sin stock</span>
          </div>
        )}
        <div className="aspect-square rounded-[2rem] bg-[#F2EBE6] flex items-center justify-center text-7xl group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden relative">
          {imgUrlCompleta ? (
            <img src={imgUrlCompleta} alt={nombre} loading="lazy" className="object-cover w-full h-full relative z-10 group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <span className="relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{emoji}</span>
          )}
        </div>
      </div>

      <div className="p-6 text-center flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-stone-800 mb-1 leading-tight">{nombre}</h3>
        <p className="text-stone-400 text-sm mb-1">Postre de Autor</p>

        {/* Administrador: opciones de imagen */}
        {isAdmin && (
          <div className="mb-2">
            <button onClick={() => setShowImgUpload(!showImgUpload)} className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full font-bold hover:bg-indigo-100 transition mb-2">
              📷 Subir/Cambiar Foto
            </button>
            {showImgUpload && (
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl mb-4 text-left">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                  className="text-xs mb-2 block w-full text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-brown file:text-white hover:file:bg-[#5a402e]"
                />
                {preview && (
                  <div className="flex flex-col items-center justify-center my-2">
                    <img src={preview} alt="Vista previa" className="w-20 h-20 object-cover rounded-lg border border-stone-300 shadow-sm mb-2" />
                    <button 
                      onClick={handleSubirImagen} 
                      disabled={subiendo}
                      className="bg-green-600 text-white text-xs px-4 py-1.5 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {subiendo ? "Subiendo..." : "Confirmar subida"}
                    </button>
                  </div>
                )}
                {errorImagen && <p className="text-xs text-red-500 font-semibold mt-1">{errorImagen}</p>}
              </div>
            )}
          </div>
        )}

        {/* Stock: normal o editable si es admin */}
        {isAdmin && editandoStock ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              type="number"
              min="0"
              value={nuevoStock}
              onChange={e => setNuevoStock(e.target.value)}
              className="w-20 border border-stone-300 rounded-lg px-2 py-1 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20"
            />
            <button onClick={handleGuardarStock} disabled={guardando} className="bg-primary-brown text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#5a402e] transition disabled:opacity-50">
              {guardando ? "..." : "OK"}
            </button>
            <button onClick={() => { setEditandoStock(false); setNuevoStock(stockActual); }} className="text-stone-400 hover:text-stone-600 px-2 py-1 rounded-lg text-xs font-bold">
              &times;
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className={`text-xs font-semibold ${sinStock ? "text-red-400" : "text-stone-300"}`}>
              {sinStock ? "Sin stock" : `Stock: ${stockActual}`}
            </p>
            {isAdmin && (
              <button
                onClick={() => setEditandoStock(true)}
                className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold hover:bg-amber-200 transition"
                title="Editar stock"
              >
                Editar
              </button>
            )}
          </div>
        )}

        {aviso && (
          <p className="text-xs text-red-400 font-semibold mb-2 bg-red-50 rounded-lg py-1 px-2">
            No hay mas stock disponible
          </p>
        )}

        <div className="mt-auto">
          <p className="text-xs text-stone-400 mb-4">{cuotas_cantidad}x de ${cuotas_valor.toLocaleString("es-AR")}</p>
          <div className="flex items-center justify-between pt-4 border-t border-stone-50">
            <span className="text-xl font-bold text-[#3D2B1F]">${precio_final.toLocaleString("es-AR")}</span>
            <button
              onClick={handleAgregar}
              disabled={sinStock || llegueAlMax}
              className="bg-primary-brown text-white p-3 rounded-2xl hover:bg-[#5a402e] hover:scale-105 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              title={sinStock ? "Sin stock" : llegueAlMax ? "Stock maximo alcanzado" : "Agregar al carrito"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
