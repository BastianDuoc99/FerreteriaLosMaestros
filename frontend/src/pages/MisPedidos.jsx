import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatearCLP } from "../data/productos.js";
import { api } from "../services/api.js";

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    api.listarMisPedidos()
      .then((datos) => {
        if (activo) setPedidos(Array.isArray(datos) ? datos : []);
      })
      .catch((fallo) => {
        if (activo) setError(fallo.message || "No se pudo cargar el historial.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Historial de compras</span>
          <h1>Mis pedidos</h1>
          <p className="mb-0">
            Revisa el detalle, la entrega y la forma de pago de tus pedidos.
          </p>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {cargando ? (
            <div className="estado-vacio">
              <p>Cargando pedidos…</p>
            </div>
          ) : !pedidos.length ? (
            <div className="estado-vacio">
              <h2 className="h4">Todavía no tienes pedidos</h2>
              <p>Cuando confirmes una compra aparecerá aquí.</p>
              <Link className="btn btn-ferreteria" to="/productos">
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="lista-pedidos">
              {pedidos.map((pedido) => (
                <article className="pedido-card" key={pedido.id}>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                    <div>
                      <span className="eyebrow">{pedido.id}</span>
                      <h2 className="h5 mb-1">
                        {formatearFecha(pedido.fecha)}
                      </h2>
                      <p className="texto-muted small mb-0">
                        {pedido.items.length} producto(s) ·{" "}
                        {pedido.nombre || pedido.usuario}
                      </p>
                    </div>
                    <span className="badge-stock">{pedido.estado}</span>
                  </div>

                  <div className="pedido-items">
                    {pedido.items.map((item) => (
                      <div className="pedido-item" key={item.codigo}>
                        <span>
                          <strong>{item.nombre}</strong>
                          <span className="texto-muted small">
                            {" "}
                            · {item.codigo} · {item.qty} {item.unidad}
                          </span>
                        </span>
                        <strong>{formatearCLP(item.precio * item.qty)}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex flex-wrap justify-content-between align-items-end gap-2">
                    <div className="texto-muted small">
                      <div>
                        Entrega:{" "}
                        {pedido.entrega === "retiro"
                          ? "Retiro en tienda"
                          : `Despacho a ${pedido.direccion}`}
                      </div>
                      <div>
                        Pago:{" "}
                        {pedido.pago === "cuenta-corriente"
                          ? "Cuenta corriente"
                          : "Contado"}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="texto-muted small d-block">Total</span>
                      <strong className="precio">
                        {formatearCLP(pedido.total)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
