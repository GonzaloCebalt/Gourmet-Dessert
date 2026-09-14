import { useState, useEffect } from "react";
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

  if (cargando) return <div className="container mx-auto px-6 py-20 text-center"><div className="animate-spin text-4xl">🍯</div><p className="text-stone-400 mt-4 uppercase tracking-widest text-sm font-bold">Cargando tus pedidos...</p></div>;
  if (error) return <div className="container mx-auto px-6 py-20 text-center"><p className="text-red-500 font-bold">Error: {error}</p></div>;
  if (pedidos.length === 0) return <div className="container mx-auto px-6 py-20 text-center"><p className="text-stone-400 text-xl">Todavia no hiciste ninguna compra.</p><a href="/" className="mt-6 inline-block bg-primary-brown text-white px-8 py-3 rounded-pill font-bold text-sm uppercase tracking-widest">Ver catalogo</a></div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mis pedidos</h1>
      <div className="space-y-6">
        {pedidos.map(pedido => (
          <div key={pedido.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Pedido #{pedido.id}</span>
                <p className="font-bold text-lg text-primary-brown mt-1">${parseFloat(pedido.total).toLocaleString("es-AR")}</p>
              </div>
              <span className="bg-[#FCE4EC] text-primary-brown px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{pedido.estado}</span>
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
    </div>
  );
}
