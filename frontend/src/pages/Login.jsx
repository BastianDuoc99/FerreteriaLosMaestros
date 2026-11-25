import { useState } from "react";
import { Link } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { validarLogin } from "../utils/validaciones.js";

const FORMULARIO_INICIAL = { email: "", password: "" };

export default function Login() {
  const { iniciarSesion } = useSesion();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  function actualizar(campo, valor) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const erroresEncontrados = validarLogin(formulario);
    setErrores(erroresEncontrados);
    setMensaje("");

    if (Object.keys(erroresEncontrados).length > 0) return;

    setEnviando(true);
    try {
      const sesion = await iniciarSesion({
        email: formulario.email.trim().toLowerCase(),
        password: formulario.password,
      });
      setMensaje(`Bienvenido de nuevo, ${sesion.nombre}!`);
      setFormulario(FORMULARIO_INICIAL);
    } catch (error) {
      setErrores({ general: error.message || "No fue posible iniciar sesión." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Acceso</span>
          <h1>Iniciar sesión</h1>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="form-card form-card-angosto">
            {mensaje ? (
              <div className="alert alert-success" role="status">
                {mensaje}{" "}
                <Link to="/" className="alert-link">
                  Ir al inicio
                </Link>
              </div>
            ) : null}

            {errores.general ? (
              <div className="alert alert-danger" role="alert">
                {errores.general}
              </div>
            ) : null}

            <form onSubmit={enviar} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="login-email">
                  Correo
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  placeholder="correo@dominio.com"
                  maxLength={100}
                  value={formulario.email}
                  onChange={(evento) =>
                    actualizar("email", evento.target.value)
                  }
                />
                {errores.email ? (
                  <p className="error-campo">{errores.email}</p>
                ) : null}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="login-password">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  maxLength={10}
                  value={formulario.password}
                  onChange={(evento) =>
                    actualizar("password", evento.target.value)
                  }
                />
                {errores.password ? (
                  <p className="error-campo">{errores.password}</p>
                ) : null}
              </div>

              <button
                type="submit"
                className="btn btn-ferreteria w-100"
                disabled={enviando}
              >
                {enviando ? "Ingresando…" : "Ingresar"}
              </button>
            </form>

            <p className="texto-muted small mt-3 mb-0">
              Cuentas demo: <strong>admin@duoc.cl</strong>,{" "}
              <strong>vendedor@duoc.cl</strong> y{" "}
              <strong>cliente@duoc.cl</strong> / <strong>1234</strong>.
            </p>

            <hr />
            <p className="mb-0">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="enlace-ferreteria">
                Registrarme
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
