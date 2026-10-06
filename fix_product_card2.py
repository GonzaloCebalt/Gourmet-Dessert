with open("tienda-frontend/src/components/ProductCard.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("?? Subir/Cambiar Foto", "{\"\\uD83D\\uDCF7\"} Subir/Cambiar Foto")

btn = """</button>
            <button 
              onClick={handleEliminarImagen} 
              disabled={subiendo || !imagen_url} 
              className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full font-bold hover:bg-red-100 transition mb-2 ml-2 disabled:opacity-50"
            >
              {"\\uD83D\\uDDD1"} Eliminar Foto
            </button>
            {showImgUpload && ("""

# Replace using split to avoid regex escaping issues
parts = text.split("</button>")
for i in range(len(parts) - 1):
    if "{showImgUpload && (" in parts[i+1]:
        parts[i] = parts[i] + btn
        parts[i+1] = parts[i+1].replace("{showImgUpload && (", "", 1)
        break

text = "</button>".join(parts)

if "handleEliminarImagen" not in text:
    text = text.replace("subirImagen } from", "subirImagen, eliminarImagen } from")
    handler = """
  const handleEliminarImagen = async () => {
    try {
      setSubiendo(true);
      const prodActualizado = await eliminarImagen(id);
      if (onUpdateImagen) onUpdateImagen(null);
      setShowImgUpload(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleFileChange"""
    text = text.replace("const handleFileChange", handler)

with open("tienda-frontend/src/components/ProductCard.jsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Done.")
