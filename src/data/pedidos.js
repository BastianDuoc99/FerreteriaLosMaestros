export const PEDIDOS_KEY = "ferreteriaLosMaestrosPedidos";

function leerPedidos() {
  if (typeof localStorage === "undefined") return [];
  try {
    const guardados = JSON.parse(localStorage.getItem(PEDIDOS_KEY) || "[]");
    return Array.isArray(guardados) ? guardados : [];
  } catch {
    return [];
  }
}

export function getPedidos() {
  return leerPedidos();
}

export function getPedidosUsuario(email) {
  const correo = String(email || "").trim().toLowerCase();
  if (!correo) return [];
  return leerPedidos().filter(
    (pedido) => String(pedido.usuario || "").toLowerCase() === correo
  );
}

export function guardarPedido(pedido) {
  if (typeof localStorage === "undefined") return null;

  const nuevoPedido = {
    id: `PED-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    fecha: new Date().toISOString(),
    estado: "Registrado",
    ...pedido,
  };

  const pedidos = leerPedidos();
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify([nuevoPedido, ...pedidos]));
  return nuevoPedido;
}
