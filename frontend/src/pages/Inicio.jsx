import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { api } from "../services/api.js";

export default function Inicio() {
  const { agregar } = useCarrito();
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    let activo = true;

    api.listarProductos()
      .then((datos) => {
        if (activo) setDestacados((Array.isArray(datos) ? datos : []).slice(0, 8));
      })
      .catch(() => {
        if (activo) setDestacados([]);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <>
      <section className="hero-ferreteria">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <span className="eyebrow">22 años en La Serena · Región de Coquimbo</span>
              <h1 className="hero-titulo">
                Todo para tu obra, en un solo lugar
              </h1>
              <p className="hero-texto">
                Ferretería Los Maestros reúne materiales de construcción,
                herramientas, gasfitería, electricidad y ferretería general para
                clientes particulares y contratistas. Consulta el stock en línea
                antes de venir a la tienda.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link className="btn btn-ferreteria" to="/productos">
                  Ver catálogo
                </Link>
                <Link className="btn btn-ferreteria-secundario" to="/nosotros">
                  Conócenos
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <img
                className="img-fluid hero-imagen"
                src="/assets/img/hero-ferreteria.svg"
                alt="Herramientas y materiales de Ferretería Los Maestros"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-ferreteria">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span className="eyebrow">Productos destacados</span>
              <h2 className="mb-0">Lo que más buscan los maestros</h2>
            </div>
            <Link className="btn btn-ferreteria-secundario" to="/productos">
              Ver catálogo completo
            </Link>
          </div>

          <div className="row g-3">
            {destacados.map((producto) => (
              <div className="col-12 col-sm-6 col-lg-3" key={producto.codigo}>
                <ProductCard producto={producto} onAgregar={agregar} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="feature-card h-100">
                <span className="feature-icon">⛁</span>
                <h3 className="h5">Stock en tiempo real</h3>
                <p className="mb-0">
                  Consulta la disponibilidad antes de salir: el inventario se
                  actualiza al registrar cada venta.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card h-100">
                <span className="feature-icon">♜</span>
                <h3 className="h5">Cuenta corriente</h3>
                <p className="mb-0">
                  Los contratistas registrados pueden comprar a crédito y ver su
                  saldo pendiente a fin de mes.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card h-100">
                <span className="feature-icon">⌂</span>
                <h3 className="h5">Retiro y despacho</h3>
                <p className="mb-0">
                  Retira en tienda o solicita despacho en La Serena y Coquimbo
                  según la zona de cobertura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="banner-ferreteria text-center text-lg-start d-lg-flex align-items-center justify-content-between gap-4">
            <div>
              <h2 className="mb-2">¿Eres contratista o maestro de obra?</h2>
              <p className="mb-0">
                Regístrate, solicita cuenta corriente y revisa el historial de
                tus compras.
              </p>
            </div>
            <Link
              className="btn btn-ferreteria mt-3 mt-lg-0"
              to="/registro"
            >
              Crear cuenta de contratista
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
