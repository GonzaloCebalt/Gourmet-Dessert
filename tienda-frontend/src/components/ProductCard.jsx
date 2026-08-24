import './ProductCard.css'

// Emoji ilustrativo por nombre de producto (fallback genérico)
const EMOJIS = ['🍯', '🍰', '🧁', '🍩', '🍫', '🥐', '🍪', '🎂', '🍬', '🧇']
function emojiPara(nombre, id) {
  const n = nombre.toLowerCase()
  if (n.includes('torta') || n.includes('amor'))  return '🎂'
  if (n.includes('alfajor'))                       return '🍯'
  if (n.includes('medialuna'))                     return '🥐'
  if (n.includes('churro'))                        return '🍫'
  if (n.includes('palmerita'))                     return '🍪'
  if (n.includes('esponja') || n.includes('lavar')) return '🧽'
  if (n.includes('morcilla') || n.includes('dulce')) return '🌭'
  return EMOJIS[id % EMOJIS.length]
}

export default function ProductCard({ id, nombre, precio_final, cuotas_cantidad, cuotas_valor, garantia_meses }) {
  return (
    <div className="product-card">
      <div className="product-card-emoji">
        {emojiPara(nombre, id)}
      </div>
      <div className="product-card-body">
        <p className="product-card-nombre">{nombre}</p>
        <p className="product-card-precio">
          ${precio_final.toLocaleString('es-AR')}
        </p>
        <p className="product-card-cuotas">
          {cuotas_cantidad}x ${cuotas_valor.toLocaleString('es-AR')} sin interés
        </p>
        <p className="product-card-garantia">
          🛡️ Garantía: {garantia_meses} {garantia_meses === 1 ? 'mes' : 'meses'}
        </p>
        <div className="product-card-btn">
          <button>Agregar al carrito</button>
        </div>
      </div>
    </div>
  )
}