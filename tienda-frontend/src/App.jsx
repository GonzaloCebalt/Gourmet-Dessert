import { useState, useEffect } from 'react'
import { getProductos } from './services/api'
import ProductCard from './components/ProductCard'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1) // <-- NUEVO ESTADO
  const [busqueda, setBusqueda] = useState("")

  const LIMIT = 4; // Productos por página

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    getProductos({ page, limit: LIMIT, nombre: busqueda })
      .then(({ data, total }) => {
        setProductos(data)
        // Calculamos el total de páginas (si es 0, al menos mostramos 1)
        setTotalPages(Math.max(1, Math.ceil(total / LIMIT)))
      })
      .catch((err) => setError("No se pudieron cargar los productos. Por favor, intentá de nuevo más tarde."))
      .finally(() => setIsLoading(false))
  }, [page, busqueda])

  const handleBuscar = (e) => {
    setPage(0);
    setBusqueda(e.target.value);
  }

  return (
    <div className="font-sans bg-bg-creme min-h-screen text-primary-brown">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex-1">
                <h1 className="font-logo text-3xl font-bold text-[#3D2B1F] cursor-pointer">
                    Gourmet Dessert
                </h1>
            </div>

            {/* Buscador Central */}
            <div className="hidden md:flex flex-[2] max-w-xl mx-4">
                <div className="relative w-full">
                    <input type="text" 
                           placeholder="Buscar una indulgencia..." 
                           value={busqueda}
                           onChange={handleBuscar}
                           className="w-full bg-stone-100 border-none rounded-pill px-6 py-3 text-sm focus:ring-2 focus:ring-[#3D2B1F]/20 outline-none" />
                    <svg className="absolute right-4 top-3 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </div>

            {/* Iconos Derecha */}
            <div className="flex-1 flex justify-end items-center space-x-6">
                <button className="font-semibold text-sm hover:text-stone-500 transition">Tienda</button>
                <button className="relative p-2 hover:bg-stone-100 rounded-full transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </button>
            </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        
        {/* Banner de Bienvenida */}
        <div className="bg-[#FCE4EC] rounded-gourmet p-12 mb-12 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
            <div className="z-10 text-center md:text-left">
                <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#3D2B1F]/60">Colección Premium 2024</span>
                <h2 className="text-5xl font-bold mt-2 mb-6 max-w-md leading-tight">El arte de engañar al paladar.</h2>
                <button className="bg-primary-brown hover:bg-[#5a402e] transition-transform hover:scale-105 text-white px-8 py-4 rounded-pill font-bold text-sm uppercase tracking-widest shadow-lg">Descubrir Ahora</button>
            </div>
            <div className="text-[12rem] opacity-20 absolute -right-10 md:static md:opacity-100">🍰</div>
        </div>

        {/* CONTENIDO */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-bold">Selección Gourmet</h2>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">🍯</div>
            <p className="text-stone-400 font-semibold tracking-widest uppercase text-sm">Preparando delicias...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-8 rounded-gourmet text-center border border-red-100">
            <p className="font-bold">⚠️ {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {productos.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-gourmet shadow-sm">
                 <p className="text-stone-400 text-lg">No encontramos postres que coincidan con tu paladar.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {productos.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    id={producto.id}
                    nombre={producto.nombre}
                    precio_final={producto.precio_final}
                    cuotas_cantidad={producto.cuotas_cantidad}
                    cuotas_valor={producto.cuotas_valor}
                    garantia_meses={producto.garantia_meses}
                  />
                ))}
              </div>
            )}
            
            {/* PAGINACIÓN */}
            <div className="flex justify-center items-center space-x-6 mt-16">
              <button 
                onClick={() => setPage(p => p - 1)} 
                disabled={page === 0}
                className="px-6 py-3 rounded-pill font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 bg-stone-100"
              >
                Anterior
              </button>
              
              {/* ACÁ MOSTRAMOS EL TOTAL DE PÁGINAS */}
              <span className="font-bold text-stone-400 text-sm">
                Página {page + 1} de {totalPages}
              </span>
              
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page + 1 >= totalPages} // Ahora el botón se desactiva si llegamos al máximo
                className="px-6 py-3 rounded-pill font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 bg-stone-100"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-stone-100 py-20 mt-20">
          <div className="container mx-auto px-6 text-center">
              <h2 className="font-logo text-4xl text-[#3D2B1F] mb-6">Gourmet Dessert</h2>
              <div className="flex justify-center space-x-8 mb-10 text-stone-400 font-bold text-xs uppercase tracking-widest">
                  <a href="#" className="hover:text-[#3D2B1F]">Nosotros</a>
                  <a href="#" className="hover:text-[#3D2B1F]">Técnicas</a>
                  <a href="#" className="hover:text-[#3D2B1F]">IRESM</a>
              </div>
              <p className="text-stone-300 text-sm italic">"Donde la vista se confunde y el alma se deleita."</p>
              <p className="text-stone-300 text-xs mt-4">Ley 24.240 Defensa del Consumidor - Todos los precios en ARS.</p>
          </div>
      </footer>
    </div>
  )
}

export default App
