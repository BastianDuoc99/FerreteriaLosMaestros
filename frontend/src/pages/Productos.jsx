import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { CATEGORIAS } from "../data/productos.js";
import { api } from "../services/api.js";

export default function Productos() {
  const { agregar } = useCarrito();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [soloConStock, setSoloConStock] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    api.listarProductos()
      .then((datos) => {
        if (activo) setProductos(Array.isArray(datos) ? datos : []);
      })
      .catch((fallo) => {
        if (activo) setError(fallo.message || "No se pudo cargar el catálogo.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideTexto =
        !termino ||
        `${producto.nombre} ${producto.descripcion} ${producto.codigo} ${producto.marca} ${producto.subcategoria}`
          .toLowerCase()
          .includes(termino);
      const coincideCategoria = !categoria || producto.categoria === categoria;
      const tieneStock = !soloConStock || Number(producto.stock || 0) > 0;
      return coincideTexto && coincideCategoria && tieneStock;
    });
  }, [busqueda, categoria, soloConStock, productos]);

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Catálogo</span>
          <h1>Productos y stock</h1>
          <p className="mb-0">
            Busca por nombre, código o marca, filtra por categoría y revisa la
            disponibilidad antes de cotizar.
          </p>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="filtros-ferreteria mb-4">
            <div className="filtro-campo flex-grow-1">
              <label className="form-label" htmlFor="buscar-producto">
                Buscar producto
              </label>
              <input
                id="buscar-producto"
                className="form-control"
                type="search"
                placeholder="Buscar producto, código o marca…"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </div>

            <div className="filtro-campo">
              <label className="form-label" htmlFor="filtrar-categoria">
                Categoría
              </label>
              <select
                id="filtrar-categoria"
                className="form-select"
                value={categoria}
                onChange={(evento) => setCategoria(evento.target.value)}
              >
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-check">
              <input
                id="filtrar-stock"
                className="form-check-input"
                type="checkbox"
                checked={soloConStock}
                onChange={(evento) => setSoloConStock(evento.target.checked)}
              />
              <label className="form-check-label" htmlFor="filtrar-stock">
                Solo con stock
              </label>
            </div>
          </div>

          <p className="texto-muted small">
            {filtrados.length} producto(s) encontrado(s) de {productos.length}.
          </p>

          {error ? <div className="alert alert-danger">{error}</div> : null}
          {cargando ? (
            <div className="estado-vacio">
              <p>Cargando catálogo…</p>
            </div>
          ) : filtrados.length ? (
            <div className="row g-3">
              {filtrados.map((producto) => (
                <div className="col-12 col-sm-6 col-lg-3" key={producto.codigo}>
                  <ProductCard producto={producto} onAgregar={agregar} />
                </div>
              ))}
            </div>
          ) : (
            <div className="estado-vacio">
              <h2 className="h4">No se encontraron productos.</h2>
              <p className="mb-0">
                Prueba con otro nombre, marca o categoría.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
