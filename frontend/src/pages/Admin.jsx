import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIAS, formatearCLP, stockBajo } from "../data/productos.js";
import { api } from "../services/api.js";
import { useSesion } from "../context/SesionContext.jsx";
import { validarProducto } from "../utils/validaciones.js";

const FORMULARIO_INICIAL = {
  codigo: "",
  nombre: "",
  categoria: CATEGORIAS[0],
  subcategoria: "",
  marca: "",
  unidad: "Unidad",
  precioCompra: "",
  precio: "",
  stock: "",
  stockMinimo: "",
  descripcion: "",
  imagen: "",
};

export default function Admin() {
  const { usuario } = useSesion();
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const bajos = useMemo(
    () => productos.filter((producto) => stockBajo(producto)).length,
    [productos]
  );

  useEffect(() => {
    let activo = true;

    api.listarProductos()
      .then((datos) => {
        if (activo) setProductos(Array.isArray(datos) ? datos : []);
      })
      .catch((fallo) => {
        if (activo) setErrorGeneral(fallo.message || "No se pudo cargar el inventario.");
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (usuario?.rol !== "Administrador") return undefined;
    let activo = true;

    api.listarUsuarios()
      .then((datos) => {
        if (activo) setUsuarios(Array.isArray(datos) ? datos : []);
      })
      .catch(() => {
        if (activo) setUsuarios([]);
      });

    return () => {
      activo = false;
    };
  }, [usuario?.rol]);

  function actualizar(campo, valor) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  }

  async function refrescarUsuarios() {
    const datos = await api.listarUsuarios();
    setUsuarios(Array.isArray(datos) ? datos : []);
  }

  async function cambiarCuenta(usuarioSeleccionado, aprobada) {
    setErrorGeneral("");
    try {
      await api.actualizarCuentaCorriente(usuarioSeleccionado.id, aprobada);
      await refrescarUsuarios();
    } catch (error) {
      setErrorGeneral(error.message || "No se pudo actualizar la cuenta corriente.");
    }
  }

  async function refrescar() {
    const datos = await api.listarProductos();
    setProductos(Array.isArray(datos) ? datos : []);
  }

  async function enviar(evento) {
    evento.preventDefault();
    const erroresEncontrados = validarProducto(formulario);
    setErrores(erroresEncontrados);
    setMensaje("");
    setErrorGeneral("");

    if (Object.keys(erroresEncontrados).length > 0) return;

    const producto = {
      ...formulario,
      codigo: formulario.codigo.trim().toUpperCase(),
      nombre: formulario.nombre.trim(),
      subcategoria: formulario.subcategoria.trim(),
      marca: formulario.marca.trim(),
      unidad: formulario.unidad.trim(),
      precioCompra: Number(formulario.precioCompra),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      stockMinimo: Number(formulario.stockMinimo),
      descripcion: formulario.descripcion.trim(),
      imagen: formulario.imagen.trim() || "/assets/img/cat-varios.svg",
      tipo: formulario.tipo || "personalizado",
    };

    setGuardando(true);
    try {
      if (productos.some((item) => item.codigo === producto.codigo)) {
        await api.actualizarProducto(producto);
      } else {
        await api.crearProducto(producto);
      }
      await refrescar();
      setMensaje(`Producto ${producto.codigo} guardado correctamente.`);
      setFormulario(FORMULARIO_INICIAL);
    } catch (error) {
      setErrorGeneral(error.message || "No se pudo guardar el producto.");
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(codigo) {
    setErrorGeneral("");
    try {
      await api.eliminarProducto(codigo);
      await refrescar();
      setMensaje(`Producto ${codigo} eliminado del mantenedor.`);
    } catch (error) {
      setErrorGeneral(error.message || "No se pudo eliminar el producto.");
    }
  }

  function editar(producto) {
    setErrores({});
    setMensaje("");
    setErrorGeneral("");
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre || "",
      categoria: producto.categoria || CATEGORIAS[0],
      subcategoria: producto.subcategoria || "",
      marca: producto.marca || "",
      unidad: producto.unidad || "Unidad",
      precioCompra: String(producto.precioCompra ?? ""),
      precio: String(producto.precio ?? ""),
      stock: String(producto.stock ?? ""),
      stockMinimo: String(producto.stockMinimo ?? ""),
      descripcion: producto.descripcion || "",
      imagen: producto.imagen || "",
      tipo: producto.tipo || "personalizado",
    });
    window.scrollTo?.({ top: 0, behavior: "smooth" });
    setMensaje(`Editando ${producto.codigo}. Guarda para aplicar los cambios.`);
  }

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Panel interno · Administrador / Vendedor</span>
          <h1>Gestión de inventario</h1>
          <p className="mb-0">
            Mantenedor de productos con stock, stock mínimo y alertas de
            reposición.
          </p>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="stat-card">
                <span>Productos</span>
                <strong>{productos.length}</strong>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card">
                <span>Stock bajo</span>
                <strong className={bajos ? "texto-alerta" : ""}>{bajos}</strong>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-xl-5">
              <div className="form-card">
                <h2 className="h5 mb-3">Agregar o actualizar producto</h2>

                {mensaje ? (
                  <div className="alert alert-success" role="status">
                    {mensaje}
                  </div>
                ) : null}

                {errorGeneral ? (
                  <div className="alert alert-danger" role="alert">
                    {errorGeneral}
                  </div>
                ) : null}

                <form onSubmit={enviar} noValidate>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-codigo">
                        Código *
                      </label>
                      <input
                        id="admin-codigo"
                        className="form-control"
                        value={formulario.codigo}
                        onChange={(evento) =>
                          actualizar("codigo", evento.target.value)
                        }
                      />
                      {errores.codigo ? (
                        <p className="error-campo">{errores.codigo}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-nombre">
                        Nombre *
                      </label>
                      <input
                        id="admin-nombre"
                        className="form-control"
                        maxLength={100}
                        value={formulario.nombre}
                        onChange={(evento) =>
                          actualizar("nombre", evento.target.value)
                        }
                      />
                      {errores.nombre ? (
                        <p className="error-campo">{errores.nombre}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-categoria">
                        Categoría *
                      </label>
                      <select
                        id="admin-categoria"
                        className="form-select"
                        value={formulario.categoria}
                        onChange={(evento) =>
                          actualizar("categoria", evento.target.value)
                        }
                      >
                        {CATEGORIAS.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                      {errores.categoria ? (
                        <p className="error-campo">{errores.categoria}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-subcategoria">
                        Subcategoría *
                      </label>
                      <input
                        id="admin-subcategoria"
                        className="form-control"
                        maxLength={60}
                        placeholder="Ej: Cementos"
                        value={formulario.subcategoria}
                        onChange={(evento) =>
                          actualizar("subcategoria", evento.target.value)
                        }
                      />
                      {errores.subcategoria ? (
                        <p className="error-campo">{errores.subcategoria}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-marca">
                        Marca *
                      </label>
                      <input
                        id="admin-marca"
                        className="form-control"
                        maxLength={60}
                        value={formulario.marca}
                        onChange={(evento) =>
                          actualizar("marca", evento.target.value)
                        }
                      />
                      {errores.marca ? (
                        <p className="error-campo">{errores.marca}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-unidad">
                        Unidad *
                      </label>
                      <input
                        id="admin-unidad"
                        className="form-control"
                        maxLength={30}
                        placeholder="Saco, Unidad, Metro, Caja…"
                        value={formulario.unidad}
                        onChange={(evento) =>
                          actualizar("unidad", evento.target.value)
                        }
                      />
                      {errores.unidad ? (
                        <p className="error-campo">{errores.unidad}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-precio-compra">
                        Precio compra *
                      </label>
                      <input
                        id="admin-precio-compra"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formulario.precioCompra}
                        onChange={(evento) =>
                          actualizar("precioCompra", evento.target.value)
                        }
                      />
                      {errores.precioCompra ? (
                        <p className="error-campo">{errores.precioCompra}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-precio">
                        Precio venta *
                      </label>
                      <input
                        id="admin-precio"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formulario.precio}
                        onChange={(evento) =>
                          actualizar("precio", evento.target.value)
                        }
                      />
                      {errores.precio ? (
                        <p className="error-campo">{errores.precio}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-stock">
                        Stock *
                      </label>
                      <input
                        id="admin-stock"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formulario.stock}
                        onChange={(evento) =>
                          actualizar("stock", evento.target.value)
                        }
                      />
                      {errores.stock ? (
                        <p className="error-campo">{errores.stock}</p>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="admin-stock-minimo">
                        Stock mínimo *
                      </label>
                      <input
                        id="admin-stock-minimo"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formulario.stockMinimo}
                        onChange={(evento) =>
                          actualizar("stockMinimo", evento.target.value)
                        }
                      />
                      {errores.stockMinimo ? (
                        <p className="error-campo">{errores.stockMinimo}</p>
                      ) : null}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="admin-descripcion">
                        Descripción
                      </label>
                      <textarea
                        id="admin-descripcion"
                        className="form-control"
                        rows={3}
                        maxLength={500}
                        value={formulario.descripcion}
                        onChange={(evento) =>
                          actualizar("descripcion", evento.target.value)
                        }
                      />
                      {errores.descripcion ? (
                        <p className="error-campo">{errores.descripcion}</p>
                      ) : null}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="admin-imagen">
                        Imagen (URL)
                      </label>
                      <input
                        id="admin-imagen"
                        className="form-control"
                        placeholder="/assets/img/cat-varios.svg"
                        value={formulario.imagen}
                        onChange={(evento) =>
                          actualizar("imagen", evento.target.value)
                        }
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-ferreteria"
                        disabled={guardando}
                      >
                        {guardando ? "Guardando…" : "Guardar producto"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-12 col-xl-7">
              <div className="tabla-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 mb-0">Productos del catálogo</h2>
                  <Link
                    className="btn btn-outline-secondary btn-sm"
                    to="/productos"
                  >
                    Ver tienda
                  </Link>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock / Mín.</th>
                        <th>Estado</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => {
                        const bajo = stockBajo(producto);
                        const sinStock = Number(producto.stock || 0) <= 0;
                        return (
                          <tr key={producto.codigo}>
                            <td>{producto.codigo}</td>
                            <td>
                              <strong>{producto.nombre}</strong>
                              <div className="texto-muted small">
                                {producto.marca} · {producto.unidad}
                              </div>
                            </td>
                            <td>{producto.categoria}</td>
                            <td>{formatearCLP(producto.precio)}</td>
                            <td>
                              {producto.stock} / {producto.stockMinimo}
                            </td>
                            <td>
                              <span
                                className={`badge-stock ${sinStock ? "agotado" : bajo ? "bajo" : ""}`}
                              >
                                {sinStock
                                  ? "Sin stock"
                                  : bajo
                                    ? "Reponer"
                                    : "OK"}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm me-2"
                                aria-label={`Editar ${producto.nombre}`}
                                onClick={() => editar(producto)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                aria-label={`Eliminar ${producto.nombre}`}
                                onClick={() => borrar(producto.codigo)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {usuario?.rol === "Administrador" ? (
            <div className="tabla-card mt-4">
              <h2 className="h5 mb-3">Cuentas corriente de clientes</h2>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Rol</th>
                      <th>Cuenta corriente</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.nombre}</strong>
                          <div className="texto-muted small">{item.email}</div>
                        </td>
                        <td>{item.rol}</td>
                        <td>
                          {item.cuentaCorriente
                            ? "Aprobada"
                            : item.cuentaCorrienteSolicitada
                              ? "Solicitada"
                              : "No solicitada"}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => cambiarCuenta(item, !item.cuentaCorriente)}
                          >
                            {item.cuentaCorriente ? "Revocar" : "Aprobar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
