import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-100 py-16 mt-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-logo text-4xl text-[#3D2B1F] mb-6">Gourmet Dessert</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-stone-400 font-bold text-xs uppercase tracking-widest">
          <Link to="/mis-pedidos" className="hover:text-[#3D2B1F] transition">Mis pedidos</Link>
          <Link to="/mis-datos" className="hover:text-[#3D2B1F] transition">Mis datos</Link>
          <Link to="/arrepentimiento" className="hover:text-red-500 transition font-bold text-red-400 border border-red-200 px-3 py-1 rounded-full">
            Boton de arrepentimiento
          </Link>
        </div>
        <p className="text-stone-300 text-sm italic">"Donde la vista se confunde y el alma se deleita."</p>
        <p className="text-stone-300 text-xs mt-4">Ley 24.240 Defensa del Consumidor · Disposicion 954/2025 · Todos los precios en ARS.</p>
      </div>
    </footer>
  );
}
