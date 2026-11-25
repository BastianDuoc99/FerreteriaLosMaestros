import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { formatearCLP, stockBajo } from "../data/productos.js";
import { api } from "../services/api.js";

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const { agregar } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    api.obtenerProducto(codigo)
      .then((datos) => {
        if (activo) setProducto(datos);
      })
      .catch(() => {
        if (activo) setProducto(null);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [codigo]);

  if (cargando) {
    return (
      <section className="section-ferreteria">
        <div className="container estado-vacio">
          <p>Cargando producto…</p>
        </div>
      </section>
    );
  }

  if (!producto) {
    return (
      <section className="section-ferreteria">
        <div className="container">
          <div className="estado-vacio">
            <h1 className="h3">Producto no encontrado</h1>
            <p>El producto solicitado no existe en el catálogo.</p>
            <Link className="btn btn-ferreteria" to="/productos">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const bajo = stockBajo(producto);
  const sinStock = Number(producto.stock || 0) <= 0;

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Detalle de producto</span>
          <h1>{producto.nombre}</h1>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-6">
              <img
                className="img-fluid detalle-imagen"
                src={producto.imagen || "/assets/img/cat-varios.svg"}
                alt={producto.nombre}
              />
            </div>

            <div className="col-12 col-lg-6">
              <div className="d-flex flex-wrap gap-2">
                <span className="badge-categoria">{producto.categoria}</span>
                <span className="badge-categoria">{producto.subcategoria}</span>
              </div>
              <h2 className="mt-3">{producto.nombre}</h2>
              <p className="precio fs-4">{formatearCLP(producto.precio)}</p>
              <p>{producto.descripcion}</p>

              <div className="row g-2 mb-3">
                <div className="col-6 col-lg-4">
                  <div className="ficha-dato">
                    <span>Código</span>
                    <strong>{producto.codigo}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="ficha-dato">
                    <span>Marca</span>
                    <strong>{producto.marca}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="ficha-dato">
                    <span>Unidad</span>
                    <strong>{producto.unidad}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="ficha-dato">
                    <span>Stock</span>
                    <strong>{producto.stock}</strong>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="ficha-dato">
                    <span>Stock mínimo</span>
                    <strong>{producto.stockMinimo}</strong>
                  </div>
                </div>
              </div>

              <div
                className={`aviso-producto ${bajo || sinStock ? "aviso-alerta" : ""}`}
              >
                {sinStock ? (
                  <strong>Sin stock disponible.</strong>
                ) : bajo ? (
                  <strong>Stock bajo:</strong>
                ) : (
                  <strong>Disponible:</strong>
                )}{" "}
                {sinStock
                  ? "Consulta por la próxima reposición con un vendedor."
                  : `${producto.stock} ${producto.unidad.toLowerCase()} disponibles. Puedes retirar en tienda o solicitar despacho en La Serena y Coquimbo.`}
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-ferreteria"
                  disabled={sinStock}
                  onClick={() => agregar(producto)}
                >
                  Añadir al carrito
                </button>
                <Link className="btn btn-ferreteria-secundario" to="/carrito">
                  Ver carrito
                </Link>
                <Link className="btn btn-outline-secondary" to="/productos">
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
