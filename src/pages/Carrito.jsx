import { useState } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { guardarPedido } from "../data/pedidos.js";
import {
  formatearCLP,
  getProductos,
  guardarProducto,
} from "../data/productos.js";

export default function Carrito() {
  const { items, cambiarCantidad, eliminar, vaciar, total } = useCarrito();
  const { usuario } = useSesion();
  const [confirmado, setConfirmado] = useState("");
  const [error, setError] = useState("");
  const [entrega, setEntrega] = useState("retiro");
  const [pago, setPago] = useState("contado");
  const [direccion, setDireccion] = useState("");

  const habilitaCuentaCorriente = Boolean(
    usuario &&
      (usuario.rol === "Contratista" ||
        usuario.rol === "Administrador" ||
        usuario.cuentaCorriente)
  );

  if (!items.length) {
    return (
      <section className="section-ferreteria">
        <div className="container">
          {confirmado ? (
            <div className="alert alert-success" role="status">
              {confirmado}{" "}
              <Link className="alert-link" to="/mis-pedidos">
                Ver mis pedidos
              </Link>
            </div>
          ) : null}
          <div className="estado-vacio">
            <h1 className="h3">
              {confirmado ? "Pedido registrado" : "Tu carrito está vacío"}
            </h1>
            <p>
              {confirmado
                ? "Gracias por comprar en Ferretería Los Maestros. Puedes revisar el estado de tu pedido en tu historial."
                : "Agrega materiales o herramientas para comenzar tu pedido."}
            </p>
            <Link className="btn btn-ferreteria" to="/productos">
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  function confirmarPedido() {
    if (entrega === "despacho" && !direccion.trim()) {
      setError("Ingresa la dirección de despacho.");
      setConfirmado("");
      return;
    }

    items.forEach((item) => {
      const producto = getProductos().find(
        (candidato) => candidato.codigo === item.codigo
      );
      if (!producto) return;

      guardarProducto({
        ...producto,
        stock: Math.max(0, Number(producto.stock) - Number(item.qty)),
      });
    });

    const pedido = guardarPedido({
      usuario: usuario?.email || "invitado",
      nombre: usuario?.nombre || "Cliente invitado",
      items: items.map((item) => ({
        codigo: item.codigo,
        nombre: item.nombre,
        marca: item.marca,
        unidad: item.unidad,
        precio: item.precio,
        qty: item.qty,
      })),
      total,
      entrega,
      pago,
      direccion: entrega === "despacho" ? direccion.trim() : "",
    });

    const detallePago =
      pago === "cuenta-corriente"
        ? "El pago queda pendiente para fin de mes."
        : entrega === "retiro"
          ? "Puedes pagar y retirar en tienda."
          : "Coordinaremos el despacho con la dirección indicada.";

    vaciar();
    setDireccion("");
    setEntrega("retiro");
    setPago("contado");
    setError("");
    setConfirmado(`Pedido ${pedido.id} registrado. ${detallePago}`);
  }

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Tu pedido</span>
          <h1>Carrito de compras</h1>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          {confirmado ? (
            <div className="alert alert-success" role="status">
              {confirmado}
            </div>
          ) : null}
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          <div className="lista-carrito">
            {items.map((item) => (
              <div className="item-carrito" key={item.codigo}>
                <div className="item-info">
                  <strong>{item.nombre}</strong>
                  <span className="texto-muted small">
                    {item.codigo} · {item.marca} · {item.unidad} · Stock:{" "}
                    {item.stock}
                  </span>
                  <span className="texto-muted small">
                    {formatearCLP(item.precio)} c/u
                  </span>
                </div>

                <div className="cantidad-control">
                  <button
                    type="button"
                    aria-label={`Disminuir cantidad de ${item.nombre}`}
                    onClick={() => cambiarCantidad(item.codigo, -1)}
                  >
                    −
                  </button>
                  <input
                    aria-label={`Cantidad de ${item.nombre}`}
                    value={item.qty}
                    readOnly
                  />
                  <button
                    type="button"
                    aria-label={`Aumentar cantidad de ${item.nombre}`}
                    onClick={() => cambiarCantidad(item.codigo, 1)}
                  >
                    +
                  </button>
                </div>

                <strong className="item-subtotal">
                  {formatearCLP(item.precio * item.qty)}
                </strong>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => eliminar(item.codigo)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="row g-4 mt-1">
            <div className="col-12 col-lg-6">
              <div className="form-card h-100">
                <h2 className="h5 mb-3">Entrega</h2>
                <div className="form-check">
                  <input
                    id="entrega-retiro"
                    className="form-check-input"
                    type="radio"
                    name="entrega"
                    value="retiro"
                    checked={entrega === "retiro"}
                    onChange={(evento) => setEntrega(evento.target.value)}
                  />
                  <label className="form-check-label" htmlFor="entrega-retiro">
                    Retiro en tienda (Av. Los Maestros 1234, La Serena)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="entrega-despacho"
                    className="form-check-input"
                    type="radio"
                    name="entrega"
                    value="despacho"
                    checked={entrega === "despacho"}
                    onChange={(evento) => setEntrega(evento.target.value)}
                  />
                  <label className="form-check-label" htmlFor="entrega-despacho">
                    Despacho a domicilio (La Serena y Coquimbo)
                  </label>
                </div>

                {entrega === "despacho" ? (
                  <div className="mt-3">
                    <label className="form-label" htmlFor="direccion-despacho">
                      Dirección de despacho *
                    </label>
                    <input
                      id="direccion-despacho"
                      className="form-control"
                      maxLength={300}
                      value={direccion}
                      onChange={(evento) => setDireccion(evento.target.value)}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="form-card h-100">
                <h2 className="h5 mb-3">Pago</h2>
                <div className="form-check">
                  <input
                    id="pago-contado"
                    className="form-check-input"
                    type="radio"
                    name="pago"
                    value="contado"
                    checked={pago === "contado"}
                    onChange={(evento) => setPago(evento.target.value)}
                  />
                  <label className="form-check-label" htmlFor="pago-contado">
                    Contado (al retirar o recibir)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="pago-cuenta"
                    className="form-check-input"
                    type="radio"
                    name="pago"
                    value="cuenta-corriente"
                    checked={pago === "cuenta-corriente"}
                    disabled={!habilitaCuentaCorriente}
                    onChange={(evento) => setPago(evento.target.value)}
                  />
                  <label className="form-check-label" htmlFor="pago-cuenta">
                    Cuenta corriente (pago pendiente a fin de mes)
                  </label>
                </div>

                {!usuario ? (
                  <p className="texto-muted small mt-3 mb-0">
                    <Link className="enlace-ferreteria" to="/login">
                      Inicia sesión
                    </Link>{" "}
                    como contratista para usar cuenta corriente.
                  </p>
                ) : !habilitaCuentaCorriente ? (
                  <p className="texto-muted small mt-3 mb-0">
                    La cuenta corriente está disponible para contratistas
                    registrados.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="banner-ferreteria d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
            <div>
              <span className="texto-muted">Total del pedido</span>
              <div className="total-carrito">{formatearCLP(total)}</div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => {
                  vaciar();
                  setConfirmado("");
                  setError("");
                }}
              >
                Vaciar carrito
              </button>
              <button
                type="button"
                className="btn btn-ferreteria"
                onClick={confirmarPedido}
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
