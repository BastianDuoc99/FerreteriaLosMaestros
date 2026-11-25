import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CARRITO_KEY = "ferreteriaLosMaestrosCart";
export const MAX_UNIDADES_POR_PRODUCTO = 999;

const CarritoContext = createContext(null);

function leerCarrito() {
  if (typeof localStorage === "undefined") return [];
  try {
    const guardado = JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

function stockDisponible(producto) {
  const stock = Number(producto?.stock);
  return Number.isFinite(stock) ? stock : MAX_UNIDADES_POR_PRODUCTO;
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  }, [items]);

  const limpiarAviso = useCallback(() => setAviso(""), []);

  function agregar(producto) {
    const disponible = stockDisponible(producto);
    if (disponible <= 0) {
      setAviso(`${producto.nombre} no tiene stock disponible por el momento.`);
      return false;
    }

    const existente = items.find((item) => item.codigo === producto.codigo);

    if (existente && existente.qty >= disponible) {
      setAviso(
        `Solo hay ${disponible} ${producto.unidad || "unidades"} disponibles de ${producto.nombre}.`
      );
      return false;
    }

    setItems((previos) => {
      const actual = previos.find((item) => item.codigo === producto.codigo);
      if (actual) {
        return previos.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...previos, { ...producto, qty: 1 }];
    });

    setAviso(`${producto.nombre} fue añadido al carrito.`);
    return true;
  }

  function cambiarCantidad(codigo, delta) {
    const actual = items.find((item) => item.codigo === codigo);
    if (!actual) return;

    const nuevaCantidad = actual.qty + delta;
    const disponible = stockDisponible(actual);

    if (nuevaCantidad > disponible) {
      setAviso(
        `Solo hay ${disponible} ${actual.unidad || "unidades"} disponibles de ${actual.nombre}.`
      );
      return;
    }

    if (nuevaCantidad <= 0) {
      setItems((previos) => previos.filter((item) => item.codigo !== codigo));
      return;
    }

    setItems((previos) =>
      previos.map((item) =>
        item.codigo === codigo ? { ...item, qty: nuevaCantidad } : item
      )
    );
  }

  function eliminar(codigo) {
    setItems((previos) => previos.filter((item) => item.codigo !== codigo));
  }

  function vaciar() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.qty, 0),
    [items]
  );

  const cantidadTotal = useMemo(
    () => items.reduce((suma, item) => suma + item.qty, 0),
    [items]
  );

  const valor = {
    items,
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar,
    total,
    cantidadTotal,
    aviso,
    limpiarAviso,
    MAX_UNIDADES_POR_PRODUCTO,
  };

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return contexto;
}
