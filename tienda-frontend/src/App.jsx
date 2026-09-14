import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
import { getProductos, getMe } from "./services/api"
import ProductCard from "./components/ProductCard"
import RutaProtegida from "./components/RutaProtegida"
import Carrito from "./pages/Carrito"
import MisPedidos from "./pages/MisPedidos"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { CarritoProvider, useCarrito } from "./context/CarritoContext"
import "./App.css"

function Navbar({ usuario, onLogout }) {
  const { items } = useCarrito();
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-1">
          <Link to="/" className="font-logo text-3xl font-bold text-[#3D2B1F]">Gourmet Dessert</Link>
        </div>
        <div className="flex-1 flex justify-end items-center space-x-4">
          {usuario ? (
            <>
              <div className="flex items-center gap-2 mr-2">
                <span className="text-xs font-semibold text-stone-700 hidden sm:inline">{usuario.nombre}</span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  usuario.rol === 'admin'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}>
                  {usuario.rol === 'admin' ? '\u{1F451} Admin' : '\u{1F464} Cliente'}
                </span>
              </div>
              <Link to="/mis-pedidos" className="font-semibold text-sm hover:text-stone-500 transition">Mis Pedidos</Link>
              <button onClick={onLogout} className="font-semibold text-sm hover:text-stone-500 transition">Salir</button>
            </>
          ) : (
            <Link to="/login" className="font-semibold text-sm hover:text-stone-500 transition">Iniciar Sesion</Link>
          )}
          <Link to="/carrito" className="relative p-2 hover:bg-stone-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-brown text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Catalogo({ usuario, onLogout }) {
  const [productos, setProductos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const LIMIT = 4;

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    getProductos({ page, limit: LIMIT, nombre: busqueda })
      .then(({ data, total }) => {
        setProductos(data)
        setTotalPages(Math.max(1, Math.ceil(total / LIMIT)))
      })
      .catch(() => setError("No se pudieron cargar los productos."))
      .finally(() => setIsLoading(false))
  }, [page, busqueda])

  return (
    <>
      <Navbar usuario={usuario} onLogout={onLogout} />
      <main className="container mx-auto px-6 py-10">
        <div className="bg-[#FCE4EC] rounded-gourmet p-12 mb-12 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          <div className="z-10 text-center md:text-left">
            <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#3D2B1F]/60">Coleccion Premium 2024</span>
            <h2 className="text-5xl font-bold mt-2 mb-6 max-w-md leading-tight">El arte de enganar al paladar.</h2>
          </div>
          <div className="text-[12rem] opacity-20 absolute -right-10 md:static md:opacity-100">🍰</div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Seleccion Gourmet</h2>
          <div className="relative w-64">
            <input type="text" placeholder="Buscar..." value={busqueda}
              onChange={e => { setPage(0); setBusqueda(e.target.value); }}
              className="w-full bg-stone-100 border-none rounded-pill px-5 py-2 text-sm focus:ring-2 focus:ring-[#3D2B1F]/20 outline-none" />
          </div>
        </div>

        {isLoading && <div className="text-center py-20"><div className="animate-spin text-4xl">🍯</div><p className="text-stone-400 mt-4 uppercase tracking-widest text-sm font-bold">Preparando delicias...</p></div>}
        {error && <div className="bg-red-50 text-red-500 p-8 rounded-gourmet text-center border border-red-100"><p className="font-bold">⚠️ {error}</p></div>}

        {!isLoading && !error && (
          <>
            {productos.length === 0
              ? <div className="text-center py-20 bg-white rounded-gourmet shadow-sm"><p className="text-stone-400 text-lg">No encontramos postres que coincidan.</p></div>
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {productos.map(p => <ProductCard key={p.id} id={p.id} nombre={p.nombre} precio_final={p.precio_final} cuotas_cantidad={p.cuotas_cantidad} cuotas_valor={p.cuotas_valor} garantia_meses={p.garantia_meses} stock={p.stock} />)}
                </div>
            }
            <div className="flex justify-center items-center space-x-6 mt-16">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="px-6 py-3 rounded-pill font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 bg-stone-100">Anterior</button>
              <span className="font-bold text-stone-400 text-sm">Pagina {page + 1} de {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page + 1 >= totalPages} className="px-6 py-3 rounded-pill font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 bg-stone-100">Siguiente</button>
            </div>
          </>
        )}
      </main>
      <footer className="bg-white border-t border-stone-100 py-20 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-logo text-4xl text-[#3D2B1F] mb-6">Gourmet Dessert</h2>
          <p className="text-stone-300 text-sm italic">"Donde la vista se confunde y el alma se deleita."</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    getMe().then(setUsuario).catch(() => setUsuario(null));
  }, []);

  const onLogout = () => {
    localStorage.removeItem("access_token");
    setUsuario(null);
  };

  return (
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Catalogo usuario={usuario} onLogout={onLogout} />} />`n          <Route path="/register" element={<><Navbar usuario={usuario} onLogout={onLogout} /><Register /></>} />`n          <Route path="/login" element={<><Navbar usuario={usuario} onLogout={onLogout} /><Login onLoginExitoso={() => getMe().then(setUsuario)} /></>} />
          <Route path="/carrito" element={<><Navbar usuario={usuario} onLogout={onLogout} /><Carrito /></>} />
          <Route path="/mis-pedidos" element={<RutaProtegida><><Navbar usuario={usuario} onLogout={onLogout} /><MisPedidos /></></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;


