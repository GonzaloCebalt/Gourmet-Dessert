// Emoji ilustrativo por nombre de producto (fallback genérico)
const EMOJIS = ['🍯', '🍰', '🧁', '🍩', '🍫', '🥐', '🍪', '🎂', '🍬', '🧇', '🍋', '🌵', '📍', '🧽', '🍅', '🪨']
function emojiPara(nombre, id) {
  const n = nombre.toLowerCase()
  if (n.includes('torta') || n.includes('amor'))  return '🎂'
  if (n.includes('alfajor'))                       return '🍯'
  if (n.includes('medialuna'))                     return '🥐'
  if (n.includes('churro'))                        return '🍫'
  if (n.includes('palmerita'))                     return '🍪'
  if (n.includes('esponja') || n.includes('lavar')) return '🧽'
  if (n.includes('morcilla') || n.includes('dulce')) return '🍫'
  if (n.includes('limon') || n.includes('limón')) return '🍋'
  if (n.includes('cactus')) return '🌵'
  if (n.includes('alfiletero')) return '📍'
  if (n.includes('tomate')) return '🍅'
  if (n.includes('piedra')) return '🪨'
  return EMOJIS[id % EMOJIS.length]
}

export default function ProductCard({ id, nombre, precio_final, cuotas_cantidad, cuotas_valor, garantia_meses }) {
  const emoji = emojiPara(nombre, id);
  
  return (
    <div className="bg-white p-4 rounded-gourmet flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3D2B1F]/10 group">
      {/* Imágen / Emoji */}
      <div className="relative cursor-pointer">
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur text-[9px] font-bold rounded-full uppercase tracking-widest text-[#3D2B1F] shadow-sm">
              IRESM
          </div>
          <div className="h-64 rounded-[2rem] bg-[#F2EBE6] flex items-center justify-center text-7xl group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden relative">
              <span className="relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{emoji}</span>
          </div>
      </div>
      
      {/* Contenido */}
      <div className="p-6 text-center flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-stone-800 mb-1 leading-tight">{nombre}</h3>
          <p className="text-stone-400 text-sm mb-4">Postre de Autor</p>
          
          <div className="mt-auto">
            <p className="text-xs text-stone-400 mb-4">{cuotas_cantidad}x de ${cuotas_valor.toLocaleString('es-AR')}</p>
            <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                <span className="text-xl font-bold text-[#3D2B1F]">${precio_final.toLocaleString('es-AR')}</span>
                <button className="bg-primary-brown text-white p-3 rounded-2xl hover:bg-[#5a402e] hover:scale-105 transition-all shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </button>
            </div>
          </div>
      </div>
    </div>
  )
}
