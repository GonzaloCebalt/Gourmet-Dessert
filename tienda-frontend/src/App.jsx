import { useState, useEffect } from 'react'
import { getProductos } from './services/api'
import ProductCard from './components/ProductCard'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProductos()
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      {/* ── NAVBAR ── */}
      <header className="navbar">
        <div className="navbar-logo">
          <span className="navbar-logo-icon">🍯</span>
          <div>
            <div className="navbar-logo-text">Gourmet Dessert</div>
            <div className="navbar-logo-sub">IRESM · Postres Artesanales</div>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="hero-strip">
        <h1>🌸 Postres que parecen arte 🌸</h1>
        <p>Encargá tus postres favoritos · Sacá fotos · Difundí el sabor del IRESM</p>
        <div className="hero-ley">
          ⚖️ Servicio amparado por la Ley 24.240 · Defensa del Consumidor Argentina
        </div>
      </div>

      {/* ── CATÁLOGO ── */}
      <main className="page-main">
        <h2 className="section-title">🛍️ Productos</h2>

        {cargando && <p className="estado-msg">Cargando productos... 🍰</p>}
        {error    && <p className="estado-msg estado-error">Error: {error}</p>}

        <div className="catalogo">
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
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <strong>Gourmet Dessert 🍯</strong> · Instituto Remedios Escalada de San Martín (IRESM)<br />
        Todos los precios en pesos argentinos (ARS) e incluyen IVA.<br />
        Servicio amparado por la <strong>Ley 24.240 de Defensa del Consumidor</strong> · República Argentina
      </footer>
    </>
  )
}

export default App
