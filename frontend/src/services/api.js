const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");
export const TOKEN_KEY = "ferreteriaLosMaestrosToken";

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getToken() {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function guardarToken(token) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function limpiarToken() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
}

function construirUrl(ruta, parametros) {
  const url = `${BASE_URL}${ruta}`;
  if (!parametros) return url;

  const consulta = new URLSearchParams();
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      consulta.append(clave, valor);
    }
  });

  const texto = consulta.toString();
  return texto ? `${url}?${texto}` : url;
}

async function solicitar(ruta, { method = "GET", body, parametros, autenticado = false } = {}) {
  const cabeceras = { Accept: "application/json" };
  if (body !== undefined) cabeceras["Content-Type"] = "application/json";

  const token = getToken();
  if (autenticado && token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(construirUrl(ruta, parametros), {
      method,
      headers: cabeceras,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("No fue posible conectar con el servidor.", 0);
  }

  let datos = null;
  if (respuesta.status !== 204) {
    const texto = await respuesta.text();
    if (texto) {
      try {
        datos = JSON.parse(texto);
      } catch {
        datos = texto;
      }
    }
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.message || datos?.error || `Error ${respuesta.status} al procesar la solicitud.`;
    throw new ApiError(mensaje, respuesta.status, datos);
  }

  return datos;
}

export const api = {
  listarProductos: (filtros) => solicitar("/productos", { parametros: filtros }),
  obtenerCategorias: () => solicitar("/productos/categorias"),
  obtenerTipos: () => solicitar("/productos/tipos"),
  obtenerProducto: (codigo) =>
    solicitar(`/productos/${encodeURIComponent(codigo)}`),

  registrar: (datos) => solicitar("/auth/registro", { method: "POST", body: datos }),
  login: (datos) => solicitar("/auth/login", { method: "POST", body: datos }),
  perfil: () => solicitar("/auth/me", { autenticado: true }),

  crearProducto: (producto) =>
    solicitar("/productos", { method: "POST", body: producto, autenticado: true }),
  actualizarProducto: (producto) =>
    solicitar(`/productos/${encodeURIComponent(producto.codigo)}`, {
      method: "PUT",
      body: producto,
      autenticado: true,
    }),
  eliminarProducto: (codigo) =>
    solicitar(`/productos/${encodeURIComponent(codigo)}`, {
      method: "DELETE",
      autenticado: true,
    }),

  crearPedido: (pedido) =>
    solicitar("/pedidos", { method: "POST", body: pedido, autenticado: true }),
  listarMisPedidos: () => solicitar("/pedidos/mios", { autenticado: true }),
  listarPedidos: () => solicitar("/pedidos", { autenticado: true }),

  listarUsuarios: () => solicitar("/usuarios", { autenticado: true }),
  actualizarCuentaCorriente: (id, aprobada) =>
    solicitar(`/usuarios/${id}/cuenta-corriente`, {
      method: "PUT",
      parametros: { aprobada },
      autenticado: true,
    }),

  enviarContacto: ({ nombre, correo, comentario }) =>
    solicitar("/contacto", {
      method: "POST",
      body: { nombre, email: correo, mensaje: comentario },
    }),
};
