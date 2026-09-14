import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMisPedidos } from "../services/api";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMisPedidos()
      .then(data => setPedidos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="animate-spin text-4xl">🍯</div>
      <p className="text-stone-400 mt-4 uppercase tracking-widest text-sm font-bold">Cargando tus pedidos...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <p className="text-red-500 font-bold mb-4">Error: {error}</p>
      <Link to="/" className="inline-block bg-primary-brown text-white px-8 py-3 rounded-pill font-bold text-sm uppercase tracking-widest">
        Volver al inicio
      </Link>
    </div>
  );

  if (pedidos.length === 0) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <p className="text-stone-400 text-xl mb-6">Todavia no hiciste ninguna compra.</p>
      <Link to="/" className="inline-block bg-primary-brown text-white px-8 py-3.5 rounded-pill font-bold text-sm uppercase tracking-widest hover:bg-[#5a402e] transition shadow-md">
        ← Volver al inicio / Ver catalogo
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#3D2B1F]">Mis pedidos</h1>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2.5 rounded-pill font-bold text-xs uppercase tracking-widest transition"
        >
          ← Volver al inicio
        </Link>
      </div>

      <div className="space-y-6">
        {pedidos.map(pedido => (
          <div key={pedido.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Pedido #{pedido.id}</span>
                <p className="font-bold text-xl text-primary-brown mt-1">${parseFloat(pedido.total).toLocaleString("es-AR")}</p>
              </div>
              <span className="bg-[#FCE4EC] text-primary-brown px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {pedido.estado}
              </span>
            </div>
            <div className="border-t border-stone-100 pt-4 space-y-2">
              {pedido.items.map(item => (
                <div key={item.producto_id} className="flex justify-between text-sm text-stone-600">
                  <span>Producto #{item.producto_id} x{item.cantidad}</span>
                  <span>${parseFloat(item.precio_unitario).toLocaleString("es-AR")} c/u</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary-brown hover:bg-[#5a402e] text-white px-8 py-4 rounded-pill font-bold text-sm uppercase tracking-widest shadow-md hover:scale-105 transition-all"
        >
          ← Volver al inicio / Seguir comprando
        </Link>
      </div>
    </div>
  );
}
