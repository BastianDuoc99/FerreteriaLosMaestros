export default function Nosotros() {
  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Nuestra historia</span>
          <h1>Nosotros</h1>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="banner-ferreteria mb-4">
            <h2>22 años abasteciendo a los maestros de La Serena</h2>
            <p className="mb-0">
              Ferretería Los Maestros es un negocio familiar ubicado en La
              Serena, Región de Coquimbo. Es atendido por el dueño, su hijo y dos
              empleados de planta. Vendemos materiales de construcción,
              herramientas eléctricas y manuales, gasfitería, electricidad y
              artículos de ferretería general.
            </p>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="feature-card h-100">
                <h3 className="h5">Misión</h3>
                <p className="mb-0">
                  Entregar a familias y contratistas los materiales y
                  herramientas que necesitan, con atención cercana, precios
                  claros y disponibilidad de stock confiable.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card h-100">
                <h3 className="h5">Visión</h3>
                <p className="mb-0">
                  Ser la ferretería de referencia en La Serena y Coquimbo,
                  combinando la experiencia de 22 años con herramientas digitales
                  de venta, inventario y cuenta corriente.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card h-100">
                <h3 className="h5">Nuestros clientes</h3>
                <p className="mb-0">
                  Atendemos a clientes particulares que compran para su hogar y a
                  contratistas o maestros de obra que compran en volumen y
                  necesitan cuenta corriente.
                </p>
              </div>
            </div>
          </div>

          <div className="row align-items-center g-4 mt-4">
            <div className="col-12 col-lg-6">
              <img
                className="img-fluid detalle-imagen"
                src="/assets/img/blog-historia.svg"
                alt="Historia de Ferretería Los Maestros"
              />
            </div>
            <div className="col-12 col-lg-6">
              <span className="eyebrow">Tradición viva</span>
              <h2>Del cuaderno y el Excel al stock en línea</h2>
              <p>
                Durante años el inventario se actualizó manualmente en un archivo
                Excel y las ventas se anotaron en una libreta. Hoy avanzamos hacia
                una experiencia digital que permite consultar stock, reservar
                productos y revisar el historial de compras por cliente.
              </p>
              <ul className="lista-check">
                <li>Más de 800 referencias de productos.</li>
                <li>Retiro en tienda y despacho con cobertura local.</li>
                <li>Cuenta corriente digital para contratistas.</li>
                <li>Alertas cuando un producto baja del stock mínimo.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
