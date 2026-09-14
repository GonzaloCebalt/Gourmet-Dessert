import { useCarrito } from "../context/CarritoContext";
import { crearPedido } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const { items, quitar, vaciar, total } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const confirmar = async () => {
    if (enviando) return;
    setEnviando(true);
    setMensaje(null);
    try {
      await crearPedido(items);
      vaciar();
      navigate("/mis-pedidos");
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0) return (
    <div className="container mx-auto px-6 py-20 text-center">
      <p className="text-2xl text-stone-400 font-bold mb-6">Tu carrito esta vacio</p>
      <a href="/" className="bg-primary-brown text-white px-8 py-3 rounded-pill font-bold text-sm uppercase tracking-widest">Ver catalogo</a>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Tu carrito</h1>
      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-lg">{item.nombre}</p>
              <p className="text-stone-400 text-sm">{item.cantidad} x ${item.precio_final.toLocaleString("es-AR")}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-primary-brown">${(item.precio_final * item.cantidad).toLocaleString("es-AR")}</span>
              <button onClick={() => quitar(item.id)} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none">&times;</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FCE4EC] rounded-2xl p-6 flex items-center justify-between mb-6">
        <span className="font-bold text-xl">Total</span>
        <span className="font-bold text-2xl text-primary-brown">${total.toLocaleString("es-AR")}</span>
      </div>

      {mensaje && <div className="bg-red-50 text-red-500 border border-red-100 rounded-xl p-4 mb-4 font-semibold">{mensaje}</div>}

      <button
        onClick={confirmar}
        disabled={enviando}
        className="w-full bg-primary-brown text-white py-4 rounded-pill font-bold uppercase tracking-widest text-sm hover:bg-[#5a402e] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enviando ? "Confirmando..." : "Confirmar compra"}
      </button>
    </div>
  );
}
