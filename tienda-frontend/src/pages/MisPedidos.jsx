import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMisPedidos, revocarPedido } from "../services/api";

const DIAS_PARA_REVOCAR = 10;

function puedeRevocar(pedido) {
  if (pedido.estado === "cancelado") return false;
  const ms = Date.now() - new Date(pedido.creado_en);
  return ms / 86400000 <= DIAS_PARA_REVOCAR;
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [revocando, setRevocando] = useState(null); // id del pedido que se esta revocando
  const [codigosRevocacion, setCodigosRevocacion] = useState({}); // pedidoId -> codigo
  const [erroresRevocacion, setErroresRevocacion] = useState({});

  const cargarPedidos = useCallback(() => {
    setCargando(true);
    getMisPedidos()
      .then(data => setPedidos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargarPedidos(); }, [cargarPedidos]);

  const handleRevocar = async (pedidoId) => {
    if (revocando) return;
    const confirmar = window.confirm(
      "Vas a arrepentirte de esta compra. El stock sera restituido y recibiras un codigo de solicitud. Confirmas?"
    );
    if (!confirmar) return;

    setRevocando(pedidoId);
    setErroresRevocacion(prev => ({ ...prev, [pedidoId]: null }));
    try {
      const resultado = await revocarPedido(pedidoId);
      setCodigosRevocacion(prev => ({ ...prev, [pedidoId]: resultado.codigo }));
      cargarPedidos(); // Refrescar historial
    } catch (err) {
      setErroresRevocacion(prev => ({ ...prev, [pedidoId]: err.message }));
    } finally {
      setRevocando(null);
    }
  };

  if (cargando) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="animate-spin text-4xl">🍯</div>
      <p className="text-stone-400 mt-4 uppercase tracking-widest text-sm font-bold">Cargando tus pedidos...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <p className="text-red-500 font-bold mb-4">Error: {error}</p>
      <Link to="/" className="inline-block bg-primary-brown text-white px-8 py-3 rounded-pill font-bold text-sm uppercase tracking-widest">Volver al inicio</Link>
    </div>
  );

  if (pedidos.length === 0) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <p className="text-stone-400 text-xl mb-6">Todavia no hiciste ninguna compra.</p>
      <Link to="/" className="inline-block bg-primary-brown text-white px-8 py-3.5 rounded-pill font-bold text-sm uppercase tracking-widest hover:bg-[#5a402e] transition shadow-md">
        Ver catalogo
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#3D2B1F]">Mis pedidos</h1>
        <Link to="/" className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2.5 rounded-pill font-bold text-xs uppercase tracking-widest transition">
          Seguir comprando
        </Link>
      </div>

      <div className="space-y-6">
        {pedidos.map(pedido => (
          <div key={pedido.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Pedido #{pedido.id}</span>
                <p className="font-bold text-xl text-primary-brown mt-1">${parseFloat(pedido.total).toLocaleString("es-AR")}</p>
                <p className="text-xs text-stone-300 mt-1">{new Date(pedido.creado_en).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                pedido.estado === "cancelado" ? "bg-red-50 text-red-400" : "bg-[#FCE4EC] text-primary-brown"
              }`}>
                {pedido.estado}
              </span>
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-2 mb-4">
              {pedido.items.map(item => (
                <div key={item.producto_id} className="flex justify-between text-sm text-stone-600">
                  <span>Producto #{item.producto_id} x{item.cantidad}</span>
                  <span>${parseFloat(item.precio_unitario).toLocaleString("es-AR")} c/u</span>
                </div>
              ))}
            </div>

            {/* Codigo de revocacion si existe */}
            {codigosRevocacion[pedido.id] && (
              <div role="status" className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Solicitud de arrepentimiento registrada</p>
                <p className="font-mono font-bold text-green-800 text-lg">{codigosRevocacion[pedido.id]}</p>
                <p className="text-xs text-green-600 mt-1">Guarda este codigo. Es tu comprobante legal (Disp. 954/2025).</p>
              </div>
            )}

            {/* Error de revocacion */}
            {erroresRevocacion[pedido.id] && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-red-500">{erroresRevocacion[pedido.id]}</p>
              </div>
            )}

            {/* Boton de arrepentimiento: solo si puede revocar */}
            {puedeRevocar(pedido) && (
              <button
                onClick={() => handleRevocar(pedido.id)}
                disabled={revocando === pedido.id}
                className="w-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {revocando === pedido.id ? "Procesando..." : "Arrepentirme de esta compra"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="inline-flex items-center gap-2 bg-primary-brown hover:bg-[#5a402e] text-white px-8 py-4 rounded-pill font-bold text-sm uppercase tracking-widest shadow-md hover:scale-105 transition-all">
          Volver al inicio / Seguir comprando
        </Link>
      </div>
    </div>
  );
}
