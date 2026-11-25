import { Link, useParams } from "react-router-dom";

const articulos = {
  "como-elegir-cemento": {
    etiqueta: "Guía",
    titulo: "Cómo elegir el cemento adecuado para tu obra",
    imagen: "/assets/img/cat-materiales.svg",
    parrafos: [
      "El cemento gris es la opción más utilizada en estructuras, radieres y albañilería general por su resistencia y versatilidad. Para terminaciones más finas o trabajos decorativos, el cemento blanco permite obtener mezclas de mayor luminosidad.",
      "Los morteros, en cambio, están formulados para aplicaciones específicas: pegar cerámicas, nivelar pisos o reparar superficies. Antes de comprar, revisa la unidad de venta y el rendimiento indicado por el fabricante.",
      "En Ferretería Los Maestros puedes consultar el stock en línea de cementos, morteros y áridos. Si tienes dudas sobre la cantidad necesaria para tu obra, escríbenos y te ayudamos a cotizar.",
    ],
  },
  "stock-en-linea-para-contratistas": {
    etiqueta: "Innovación",
    titulo: "Stock en línea para contratistas",
    imagen: "/assets/img/blog-stock.svg",
    parrafos: [
      "Antes, los contratistas llamaban por teléfono para saber si había stock de un producto. En días de alta demanda el teléfono se ocupaba por largos períodos y muchas consultas se perdían.",
      "Con el catálogo en línea puedes revisar la disponibilidad por producto, conocer el precio de venta y agregar los materiales al carrito antes de venir a la tienda. Así reduces viajes innecesarios y organizas mejor tu faena.",
      "El inventario se actualiza al registrar cada venta y el sistema avisa cuando un producto baja de su stock mínimo. Si necesitas una cantidad mayor, contáctanos para coordinar reposición.",
    ],
  },
  "cuenta-corriente-digital": {
    etiqueta: "Servicio",
    titulo: "Cuenta corriente digital para maestros de obra",
    imagen: "/assets/img/blog-historia.svg",
    parrafos: [
      "Muchos contratistas compran varias veces al mes y necesitan pagar a fin de mes. La cuenta corriente permite registrar esas compras de forma ordenada, sin depender de un cuaderno separado.",
      "Al confirmar un pedido con pago a cuenta corriente, queda registrado como pago pendiente a fin de mes. El cliente puede revisar su historial y el dueño cuenta con información clara para emitir el cobro.",
      "Para solicitar cuenta corriente, regístrate como contratista y completa tus datos. Un vendedor revisará tu solicitud y te informará las condiciones.",
    ],
  },
};

export default function BlogDetalle() {
  const { slug } = useParams();
  const articulo = articulos[slug];

  if (!articulo) {
    return (
      <section className="section-ferreteria">
        <div className="container">
          <div className="estado-vacio">
            <h1 className="h3">Artículo no encontrado</h1>
            <Link className="btn btn-ferreteria" to="/blogs">
              Volver al blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">{articulo.etiqueta}</span>
          <h1>{articulo.titulo}</h1>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <article className="blog-card">
            <img
              className="blog-imagen blog-imagen-grande"
              src={articulo.imagen}
              alt={articulo.titulo}
            />
            <div className="p-4 p-lg-5">
              {articulo.parrafos.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
              <Link className="btn btn-ferreteria-secundario" to="/blogs">
                Volver al blog
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
