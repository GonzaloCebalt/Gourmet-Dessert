import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMisDatos, exportarDatos, eliminarMiCuenta } from "../services/api";
import { useCarrito } from "../context/CarritoContext";

export default function MisDatos({ onLogout }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState("");
  const [bajando, setBajando] = useState(false);
  const [msgBaja, setMsgBaja] = useState(null);
  const { vaciar } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    getMisDatos()
      .then(data => setDatos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const handleExportar = async () => {
    try {
      await exportarDatos();
    } catch {
      alert("Error al descargar tus datos.");
    }
  };

  const handleEliminar = async () => {
    if (bajando) return;
    setBajando(true);
    try {
      await eliminarMiCuenta();
      vaciar();
      onLogout();
      navigate("/?baja=true");
    } catch {
      setMsgBaja("Hubo un error al intentar dar de baja tu cuenta. Intentalo de nuevo.");
      setBajando(false);
    }
  };

  if (cargando) return <div className="container mx-auto px-6 py-20 text-center"><div className="animate-spin text-4xl">🍯</div><p className="text-stone-400 mt-4 uppercase tracking-widest text-sm font-bold">Cargando tus datos...</p></div>;
  if (error) return <div className="container mx-auto px-6 py-20 text-center"><p className="text-red-500 font-bold">Error: {error}</p></div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2 text-[#3D2B1F]">Mis datos</h1>
      <p className="text-stone-400 text-sm mb-8">Ley 25.326 art. 14 — Todo lo que guardamos sobre vos.</p>

      {/* Datos personales */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <h2 className="text-lg font-bold mb-4 text-[#3D2B1F]">Datos personales</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-stone-400 font-semibold">Nombre</span><span className="font-bold">{datos.nombre}</span></div>
          <div className="flex justify-between"><span className="text-stone-400 font-semibold">Email</span><span className="font-bold">{datos.email}</span></div>
          <div className="flex justify-between"><span className="text-stone-400 font-semibold">Rol</span><span className="font-bold capitalize">{datos.rol}</span></div>
          <div className="flex justify-between"><span className="text-stone-400 font-semibold">Cuenta activa</span><span className={`font-bold ${datos.activo ? "text-green-600" : "text-red-400"}`}>{datos.activo ? "Si" : "No"}</span></div>
          <div className="flex justify-between"><span className="text-stone-400 font-semibold">Consentimiento de datos</span><span className={`font-bold ${datos.acepto_tratamiento ? "text-green-600" : "text-red-400"}`}>{datos.acepto_tratamiento ? "Aceptado" : "No aceptado"}</span></div>
          <div className="flex justify-between"><span className="text-stone-400 font-semibold">Fecha del consentimiento</span><span className="font-bold">{datos.fecha_consentimiento ? new Date(datos.fecha_consentimiento).toLocaleString("es-AR") : "—"}</span></div>
        </div>
      </div>

      {/* Pedidos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <h2 className="text-lg font-bold mb-4 text-[#3D2B1F]">Historial de pedidos</h2>
        {datos.pedidos.length === 0 ? (
          <p className="text-stone-400 text-sm">No tenes pedidos registrados.</p>
        ) : (
          <div className="space-y-4">
            {datos.pedidos.map(p => (
              <div key={p.id} className="border border-stone-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Pedido #{p.id}</span>
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${p.estado === "cancelado" ? "bg-red-50 text-red-400" : "bg-[#FCE4EC] text-primary-brown"}`}>{p.estado}</span>
                </div>
                <p className="text-xs text-stone-400 mb-1">{new Date(p.creado_en).toLocaleString("es-AR")}</p>
                <p className="font-bold text-primary-brown">${parseFloat(p.total).toLocaleString("es-AR")}</p>
                {p.solicitud_revocacion && (
                  <p className="text-xs text-green-600 mt-2 font-mono">Revocacion: {p.solicitud_revocacion.codigo}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exportar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <h2 className="text-lg font-bold mb-2 text-[#3D2B1F]">Exportar mis datos</h2>
        <p className="text-stone-400 text-sm mb-4">Descarga un archivo JSON con todo lo que guardamos de vos (Ley 25.326 art. 14).</p>
        <button onClick={handleExportar} className="bg-stone-800 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-stone-700 transition">
          Descargar mis datos (.json)
        </button>
      </div>

      {/* Baja de cuenta */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-2 text-red-600">Eliminar mi cuenta</h2>
        <p className="text-stone-500 text-sm mb-4">
          <strong>Que se borra:</strong> tu nombre, correo electronico y contraseña seran reemplazados por datos anonimos.<br/>
          <strong>Que queda:</strong> el historial de tus pedidos permanece en la base de datos sin informacion que te identifique, para cumplir con obligaciones contables y legales.
        </p>
        <p className="text-sm font-semibold text-stone-600 mb-2">Escribi <span className="font-mono bg-red-100 px-1 rounded">ELIMINAR</span> para confirmar:</p>
        <input
          type="text"
          value={confirmacion}
          onChange={e => setConfirmacion(e.target.value)}
          placeholder="ELIMINAR"
          className="w-full border border-red-200 bg-white rounded-xl px-4 py-3 mb-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-300 select-text"
        />
        {msgBaja && <p className="text-red-500 text-sm font-semibold mb-3">{msgBaja}</p>}
        <button
          onClick={handleEliminar}
          disabled={confirmacion !== "ELIMINAR" || bajando}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {bajando ? "Dando de baja..." : "Eliminar mi cuenta definitivamente"}
        </button>
      </div>
    </div>
  );
}
