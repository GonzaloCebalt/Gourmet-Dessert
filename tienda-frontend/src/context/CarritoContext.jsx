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

  // Retorna true si se agrego, false si ya alcanzo el stock
  const agregar = (producto, cantidad = 1) => {
    let exito = true;
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        const nuevaCantidad = existe.cantidad + cantidad;
        if (nuevaCantidad > producto.stock) {
          exito = false;
          return prev; // No cambia nada
        }
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: nuevaCantidad } : i);
      }
      if (cantidad > producto.stock) {
        exito = false;
        return prev;
      }
      return [...prev, { ...producto, cantidad }];
    });
    return exito;
  };

  const incrementar = (producto_id) => {
    setItems(prev => prev.map(i => {
      if (i.id !== producto_id) return i;
      if (i.cantidad >= i.stock) return i; // No pasa del stock
      return { ...i, cantidad: i.cantidad + 1 };
    }));
  };

  const decrementar = (producto_id) => {
    setItems(prev => prev.map(i => {
      if (i.id !== producto_id) return i;
      if (i.cantidad <= 1) return i; // No baja de 1
      return { ...i, cantidad: i.cantidad - 1 };
    }));
  };

  const quitar = (producto_id) => setItems(prev => prev.filter(i => i.id !== producto_id));
  const vaciar = () => setItems([]);
  const total = items.reduce((acc, i) => acc + i.precio_final * i.cantidad, 0);

  const cantidadEnCarrito = (producto_id) => {
    const item = items.find(i => i.id === producto_id);
    return item ? item.cantidad : 0;
  };

  return (
    <CarritoContext.Provider value={{ items, agregar, incrementar, decrementar, quitar, vaciar, total, cantidadEnCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
