import { useRegisterSW } from "virtual:pwa-register/react";

export default function ActualizacionDisponible() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#3D2B1F] text-white p-4 rounded-2xl shadow-2xl border border-[#D4A96A] max-w-sm flex items-center justify-between gap-4">
      <div>
        <p className="font-bold text-sm">Hay una versión nueva de la tienda</p>
        <p className="text-xs text-stone-300">Actualizá para ver los últimos cambios.</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-[#D4A96A] text-[#3D2B1F] font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-[#c39556] transition"
        >
          Actualizar
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-stone-400 hover:text-white text-xs px-2 py-1.5 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
