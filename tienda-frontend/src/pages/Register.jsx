import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    
    try {
      await register(nombre, email, password);
      // Tras registro exitoso, mandar al login con un alert o de inmediato
      alert("Cuenta creada con exito. Ahora podes iniciar sesion.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#3D2B1F]">Crear Cuenta</h1>
        <p className="text-center text-stone-400 mb-8">Sumate a Gourmet Dessert</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wider">Nombre Completo</label>
            <input 
              type="text" 
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20 select-text" 
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20 select-text" 
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wider">Contrasena</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D2B1F]/20 select-text" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-primary-brown text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#5a402e] transition disabled:opacity-50"
          >
            {cargando ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-stone-500 font-semibold">
          ¿Ya tenes cuenta?{" "}
          <Link to="/login" className="text-primary-brown hover:underline">Inicia Sesion</Link>
        </p>
      </div>
    </div>
  );
}
