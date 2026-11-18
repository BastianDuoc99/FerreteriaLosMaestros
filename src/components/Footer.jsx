import { Link } from "react-router-dom";

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer-ferreteria mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="footer-logo-wrap">
              <img
                src="/assets/img/logo.svg"
                alt="Ferretería Los Maestros"
                className="footer-logo"
              />
            </div>
            <p className="mt-3 mb-0">
              Materiales de construcción, herramientas, gasfitería, electricidad
              y ferretería general. 22 años abasteciendo a maestros de obra y
              familias de La Serena.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h3 className="h6 text-uppercase">Enlaces</h3>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/productos">Catálogo</Link>
              </li>
              <li>
                <Link to="/blogs">Blog</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
              <li>
                <Link to="/mis-pedidos">Mis pedidos</Link>
              </li>
              <li>
                <Link to="/nosotros">Nosotros</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-4">
            <h3 className="h6 text-uppercase">Tienda</h3>
            <ul className="list-unstyled footer-links">
              <li>Av. Los Maestros 1234, La Serena</li>
              <li>Lun a Vie 8:00 - 19:00 · Sáb 9:00 - 14:00</li>
              <li>+56 9 1234 5678</li>
              <li>ventas@losmaestros.cl</li>
            </ul>
            <div className="social-links mt-3">
              <span aria-label="Instagram">Instagram</span>
              <span aria-label="Facebook">Facebook</span>
              <span aria-label="WhatsApp">WhatsApp</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {anio} Ferretería Los Maestros · Proyecto frontend académico
          DSY1104
        </div>
      </div>
    </footer>
  );
}
