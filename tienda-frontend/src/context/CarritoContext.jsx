import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const agregar = (producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i);
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const quitar = (producto_id) => setItems(prev => prev.filter(i => i.id !== producto_id));
  const vaciar = () => setItems([]);
  const total = items.reduce((acc, i) => acc + i.precio_final * i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, vaciar, total }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
