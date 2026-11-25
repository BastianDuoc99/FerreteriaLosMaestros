import { Link } from "react-router-dom";

const entradas = [
  {
    slug: "como-elegir-cemento",
    etiqueta: "Guía",
    titulo: "Cómo elegir el cemento adecuado para tu obra",
    resumen:
      "Diferencias entre cemento gris, blanco y morteros, y cuándo conviene usar cada uno.",
    imagen: "/assets/img/cat-materiales.svg",
  },
  {
    slug: "stock-en-linea-para-contratistas",
    etiqueta: "Innovación",
    titulo: "Stock en línea para contratistas",
    resumen:
      "Cómo consultar disponibilidad y reservar productos antes de viajar a la ferretería.",
    imagen: "/assets/img/blog-stock.svg",
  },
  {
    slug: "cuenta-corriente-digital",
    etiqueta: "Servicio",
    titulo: "Cuenta corriente digital para maestros de obra",
    resumen:
      "Ventajas de registrar las compras a crédito y revisar el saldo pendiente a fin de mes.",
    imagen: "/assets/img/blog-historia.svg",
  },
];

export default function Blogs() {
  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Consejos y novedades</span>
          <h1>Blog</h1>
          <p className="mb-0">
            Guías de productos, ideas para tu obra y novedades de la ferretería.
          </p>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="row g-4">
            {entradas.map((entrada) => (
              <div className="col-12 col-lg-4" key={entrada.slug}>
                <article className="blog-card h-100">
                  <img
                    className="blog-imagen"
                    src={entrada.imagen}
                    alt={entrada.titulo}
                  />
                  <div className="p-4">
                    <span className="badge-categoria">{entrada.etiqueta}</span>
                    <h2 className="h4 mt-3">{entrada.titulo}</h2>
                    <p>{entrada.resumen}</p>
                    <Link
                      className="btn btn-ferreteria btn-sm"
                      to={`/blogs/${entrada.slug}`}
                    >
                      Leer más
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
