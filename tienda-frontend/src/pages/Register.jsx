import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

function ModalTerminos({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3D2B1F] px-7 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[#D4A96A] text-[10px] font-bold uppercase tracking-widest mb-0.5">
              Gourmet Dessert · IRESM
            </p>
            <h2 className="text-white font-bold text-lg">Términos y Condiciones de Uso</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none transition">
            &times;
          </button>
        </div>

        {/* Cuerpo con scroll */}
        <div className="overflow-y-auto flex-1 px-7 py-6 text-sm text-stone-700 space-y-6 leading-relaxed">

          <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
            Última actualización: octubre de 2026
          </p>

          <p>
            Bienvenido/a a <strong>Gourmet Dessert</strong>, plataforma de comercio electrónico de
            repostería artesanal desarrollada en el Instituto de Referencia para la Educación
            Secundaria de Mendoza (<strong>IRESM</strong>). Al crear una cuenta y utilizar este
            sitio, usted acepta los presentes Términos y Condiciones en su totalidad. Si no está de
            acuerdo, le solicitamos que no se registre ni utilice la plataforma.
          </p>

          {/* 1 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">1. Identificación del responsable</h3>
            <p>
              El servicio es prestado por el equipo de desarrollo del área de Informática del IRESM,
              con sede en la Provincia de Mendoza, República Argentina. Para consultas puede
              comunicarse al correo institucional:{" "}
              <span className="font-semibold text-[#5a402e]">informatica@iresm.edu.ar</span>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">2. Recopilación y tratamiento de datos personales</h3>
            <p>
              De conformidad con la{" "}
              <strong>Ley N.° 25.326 de Protección de Datos Personales</strong> de la República
              Argentina y sus disposiciones reglamentarias, le informamos que al registrarse en
              Gourmet Dessert recopilamos los siguientes datos:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-stone-600">
              <li>Nombre completo o alias de identificación.</li>
              <li>Dirección de correo electrónico.</li>
              <li>
                Contraseña, almacenada en forma de <em>hash</em> irreversible mediante el algoritmo
                bcrypt (nunca en texto plano).
              </li>
              <li>Fecha y hora de creación de la cuenta y de cada sesión iniciada.</li>
              <li>Historial de pedidos realizados en la plataforma.</li>
            </ul>
            <p className="mt-3">
              Estos datos son tratados con la única finalidad de prestar el servicio de venta en
              línea, gestionar su cuenta, procesar sus pedidos y cumplir con las obligaciones legales
              aplicables. <strong>No cedemos ni vendemos sus datos a terceros</strong> con fines
              comerciales o publicitarios.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">3. Base legal del tratamiento</h3>
            <p>
              El tratamiento de sus datos personales se basa en el consentimiento libre, específico e
              informado que usted otorga al aceptar estos Términos al momento del registro (art. 5,
              Ley 25.326). Dicho consentimiento puede ser revocado en cualquier momento a través de
              la opción <em>"Eliminar mi cuenta"</em> disponible en la sección{" "}
              <strong>Mis Datos</strong>, lo que producirá la anonimización de su información
              personal conforme al artículo 6 de la misma ley.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">4. Derechos del titular de los datos</h3>
            <p>
              En virtud de la Ley 25.326, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-stone-600">
              <li>
                <strong>Acceso:</strong> conocer qué datos suyos obran en nuestros registros y con
                qué finalidad (sección <em>Mis Datos</em>).
              </li>
              <li>
                <strong>Rectificación:</strong> contactarnos para corregir datos inexactos o
                incompletos.
              </li>
              <li>
                <strong>Cancelación/Supresión:</strong> solicitar la baja de su cuenta y la
                anonimización de sus datos desde <em>Mis Datos → Eliminar cuenta</em>.
              </li>
              <li>
                <strong>Portabilidad:</strong> descargar su información personal en formato JSON
                desde <em>Mis Datos → Descargar mis datos</em>.
              </li>
            </ul>
            <p className="mt-3">
              La Dirección Nacional de Protección de Datos Personales (DNPDP) tiene atribuciones para
              atender denuncias relacionadas con el incumplimiento de la ley mencionada.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">5. Derechos del consumidor — Ley 24.240</h3>
            <p>
              Gourmet Dessert opera en el marco de la{" "}
              <strong>Ley N.° 24.240 de Defensa del Consumidor</strong> y sus modificatorias
              (Leyes 26.361 y 27.250). En consecuencia:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-stone-600">
              <li>
                Los precios publicados incluyen todos los impuestos aplicables y son los precios
                finales al consumidor.
              </li>
              <li>
                El consumidor dispone de un plazo de <strong>10 (diez) días hábiles</strong> desde
                la recepción del producto para ejercer el derecho de arrepentimiento sin
                expresión de causa, según el artículo 34 de la Ley 24.240 y la Disposición
                DNCI N.° 954/2025.
              </li>
              <li>
                Para ejercer dicho derecho, el consumidor puede utilizar el{" "}
                <strong>Botón de Arrepentimiento</strong> disponible en el pie de página del sitio.
              </li>
              <li>
                Gourmet Dessert no aplica cargos por flete o penalidades al ejercicio del derecho de
                arrepentimiento.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">6. Seguridad de la información</h3>
            <p>
              Adoptamos medidas técnicas y organizativas adecuadas para proteger sus datos contra
              acceso no autorizado, pérdida o divulgación indebida. La comunicación entre su
              navegador y nuestros servidores se realiza mediante protocolo <strong>HTTPS</strong>.
              Las contraseñas se almacenan con hash bcrypt y nunca son legibles por el personal del
              sitio.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">7. Modificación de los términos</h3>
            <p>
              Nos reservamos el derecho de actualizar estos Términos. Cualquier cambio relevante
              será notificado por correo electrónico o mediante un aviso en la plataforma con una
              anticipación mínima de 30 días. El uso continuado del sitio implica la aceptación de
              las nuevas condiciones.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h3 className="font-bold text-[#3D2B1F] mb-2">8. Jurisdicción y legislación aplicable</h3>
            <p>
              Estos Términos se rigen por las leyes de la República Argentina. Para cualquier
              controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de
              la Provincia de Mendoza, con renuncia expresa a cualquier otro fuero que pudiera
              corresponder.
            </p>
          </section>
        </div>

        {/* Footer del modal */}
        <div className="px-7 py-5 border-t border-stone-100 bg-[#FDFAF7] flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#3D2B1F] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#5a402e] transition"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showTerminos, setShowTerminos] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debés aceptar los Términos y Condiciones para continuar.");
      return;
    }
    setError(null);
    setCargando(true);
    try {
      await register(nombre, email, password);
      alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {showTerminos && <ModalTerminos onClose={() => setShowTerminos(false)} />}

      <div className="container mx-auto px-6 py-20 flex justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{"\uD83C\uDF70"}</div>
            <h1 className="text-3xl font-bold text-[#3D2B1F]">Crear Cuenta</h1>
            <p className="text-stone-400 mt-1">Sumate a Gourmet Dessert</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">Nombre Completo</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20 select-text"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20 select-text"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20 select-text"
                placeholder="••••••••"
              />
            </div>

            {/* Checkbox de términos */}
            <div className="bg-[#FDFAF7] border border-[#E8DDD5] rounded-2xl p-4">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#3D2B1F] cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-stone-600 leading-relaxed">
                  He leído y acepto los{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerminos(true)}
                    className="font-bold text-[#3D2B1F] underline underline-offset-2 hover:text-[#5a402e] transition"
                  >
                    Términos y Condiciones de Uso
                  </button>
                  , incluyendo la política de tratamiento de mis datos personales conforme a la Ley
                  N.° 25.326 (Protección de Datos Personales) y la Ley N.° 24.240 (Defensa del
                  Consumidor) de la República Argentina.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={cargando || !aceptaTerminos}
              className="w-full bg-[#3D2B1F] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#5a402e] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cargando ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-400 leading-relaxed">
            Al registrarte, tus datos (nombre, email y contraseña cifrada) quedan resguardados en
            nuestros servidores exclusivamente para gestionar tu cuenta y tus pedidos.
          </p>

          <p className="mt-5 text-center text-sm text-stone-500 font-semibold">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-[#3D2B1F] hover:underline font-bold">
              Iniciá Sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
