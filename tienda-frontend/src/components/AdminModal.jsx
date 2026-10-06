import { useState, useRef, useEffect } from "react";
import { updateStock, subirImagen, eliminarImagen } from "../services/api";

export default function AdminModal({ producto, onClose, onUpdateStock, onUpdateImagen }) {
  const { id, nombre, stock, imagen_url } = producto;
  const [nuevoStock, setNuevoStock] = useState(stock);
  const [guardandoStock, setGuardandoStock] = useState(false);
  const [stockOk, setStockOk] = useState(false);

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorImagen, setErrorImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [imgOk, setImgOk] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleGuardarStock = async () => {
    const val = parseInt(nuevoStock, 10);
    if (isNaN(val) || val < 0) return;
    setGuardandoStock(true);
    try {
      const updated = await updateStock(id, val);
      onUpdateStock && onUpdateStock(updated.stock);
      setStockOk(true);
      setTimeout(() => setStockOk(false), 2000);
    } catch {
      alert("Error al actualizar el stock");
    } finally {
      setGuardandoStock(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorImagen(null);
    if (!file.type.startsWith("image/")) {
      setErrorImagen("El archivo debe ser una imagen (JPG, PNG, WebP).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setArchivoSeleccionado(null);
      setPreview(null);
      return;
    }
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
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImgOk(true);
      setTimeout(() => setImgOk(false), 2000);
    } catch (err) {
      setErrorImagen(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminarImagen = async () => {
    if (!imagen_url) return;
    if (!window.confirm("¿Seguro que querés eliminar la imagen?")) return;
    setSubiendo(true);
    try {
      await eliminarImagen(id);
      onUpdateImagen && onUpdateImagen(null);
      setImgOk(true);
      setTimeout(() => setImgOk(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con color marrón */}
        <div className="bg-[#3D2B1F] px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[#D4A96A] text-[10px] font-bold uppercase tracking-widest mb-0.5">Panel Admin</p>
            <h2 className="text-white font-bold text-lg leading-tight">{nombre}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* — Sección Stock — */}
          <div className="bg-[#F9F5F0] rounded-2xl p-5 border border-[#E8DDD5]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{"\uD83D\uDCE6"}</span>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Stock actual</h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                className="flex-1 border-2 border-[#D4A96A]/40 rounded-xl px-4 py-2 text-lg font-bold text-[#3D2B1F] text-center focus:outline-none focus:border-[#D4A96A] bg-white transition"
              />
              <button
                onClick={handleGuardarStock}
                disabled={guardandoStock}
                className="bg-[#3D2B1F] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#5a402e] transition disabled:opacity-50 min-w-[80px]"
              >
                {guardandoStock ? "..." : stockOk ? "\u2713 Guardado" : "Guardar"}
              </button>
            </div>
          </div>

          {/* — Sección Imagen — */}
          <div className="bg-[#F9F5F0] rounded-2xl p-5 border border-[#E8DDD5]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{"\uD83D\uDDBC"}</span>
              <h3 className="font-bold text-[#3D2B1F] text-sm uppercase tracking-wider">Imagen del producto</h3>
            </div>

            {/* Upload */}
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-[#D4A96A]/50 rounded-xl p-4 text-center hover:border-[#D4A96A] hover:bg-[#FDF8F3] transition">
                {preview ? (
                  <img src={preview} alt="Vista previa" className="w-28 h-28 object-cover rounded-xl mx-auto mb-2 shadow-md" />
                ) : (
                  <div className="text-3xl mb-1">{"\uD83D\uDCF7"}</div>
                )}
                <p className="text-xs text-[#8B6952] font-semibold">
                  {preview ? "Cambiar archivo" : "Elegir imagen (JPG, PNG · máx. 2 MB)"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </label>

            {errorImagen && (
              <p className="text-xs text-red-500 font-semibold mt-2 bg-red-50 rounded-lg px-3 py-1">{errorImagen}</p>
            )}

            {imgOk && (
              <p className="text-xs text-green-600 font-semibold mt-2 bg-green-50 rounded-lg px-3 py-1">{"\u2713"} Imagen actualizada</p>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubirImagen}
                disabled={!archivoSeleccionado || subiendo}
                className="flex-1 bg-[#3D2B1F] text-white py-2 rounded-xl font-bold text-sm hover:bg-[#5a402e] transition disabled:opacity-40"
              >
                {subiendo ? "Subiendo..." : "Confirmar subida"}
              </button>
              {imagen_url && (
                <button
                  onClick={handleEliminarImagen}
                  disabled={subiendo}
                  className="px-4 py-2 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-40"
                >
                  {"\uD83D\uDDD1"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border-2 border-[#E8DDD5] text-[#8B6952] font-bold text-sm hover:bg-[#F9F5F0] transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
