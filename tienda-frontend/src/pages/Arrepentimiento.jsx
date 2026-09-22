import { Link } from "react-router-dom";

export default function Arrepentimiento({ usuario }) {
  return (
    <div className="container mx-auto px-6 py-16 max-w-2xl">

      {/* Encabezado legal */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Ley 24.240 art. 34 · Disposicion 954/2025</p>
        <h1 className="text-4xl font-bold text-[#3D2B1F] mb-4">Boton de arrepentimiento</h1>
        <p className="text-stone-500 text-sm">Podemos aceptar cancelaciones segun la normativa argentina.</p>
      </div>

      {/* Explicacion en castellano llano */}
      <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6 mb-8 border border-stone-100">
        <h2 className="text-xl font-bold text-[#3D2B1F]">Tus derechos como consumidor</h2>

        <div className="flex gap-4 items-start">
          <span className="text-2xl mt-1">📅</span>
          <div>
            <p className="font-bold text-stone-800">10 dias corridos para arrepentirte</p>
            <p className="text-stone-500 text-sm mt-1">Contados desde que recibis el producto o confirmás la compra. No importa el motivo, no tenes que explicar nada.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <span className="text-2xl mt-1">💸</span>
          <div>
            <p className="font-bold text-stone-800">Sin costo para vos</p>
            <p className="text-stone-500 text-sm mt-1">El ejercicio de este derecho es completamente gratuito. Los gastos de devolucion los paga el vendedor.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <span className="text-2xl mt-1">🔒</span>
          <div>
            <p className="font-bold text-stone-800">Sin justificacion necesaria</p>
            <p className="text-stone-500 text-sm mt-1">No necesitas dar ninguna razon para arrepentirte. Es un derecho que la ley te reconoce sin condiciones.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <span className="text-2xl mt-1">📄</span>
          <div>
            <p className="font-bold text-stone-800">Recibis un codigo de solicitud</p>
            <p className="text-stone-500 text-sm mt-1">Cuando cancelas una compra, la plataforma te entrega un codigo unico de identificacion de tu solicitud, tal como exige la Disposicion 954/2025.</p>
          </div>
        </div>
      </div>

      {/* CTA segun sesion */}
      <div className="text-center">
        {usuario ? (
          <div>
            <p className="text-stone-500 mb-6">Para ejercer tu derecho, ingresa al historial de compras y hace clic en <strong>"Arrepentirme de esta compra"</strong> en el pedido correspondiente.</p>
            <Link
              to="/mis-pedidos"
              className="inline-block bg-primary-brown text-white px-10 py-4 rounded-pill font-bold uppercase tracking-widest text-sm hover:bg-[#5a402e] transition shadow-md"
            >
              Ver mis pedidos
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-stone-500 mb-6">Para arrepentirte de una compra, necesitas iniciar sesion para que podamos identificar tu pedido.</p>
            <Link
              to="/login"
              className="inline-block bg-primary-brown text-white px-10 py-4 rounded-pill font-bold uppercase tracking-widest text-sm hover:bg-[#5a402e] transition shadow-md"
            >
              Iniciar sesion para continuar
            </Link>
          </div>
        )}
        <p className="text-stone-300 text-xs mt-6">Esta pagina es de acceso libre, sin necesidad de iniciar sesion previamente (Disp. 954/2025).</p>
      </div>
    </div>
  );
}
