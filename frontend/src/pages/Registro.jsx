import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import { REGIONES } from "../data/regiones.js";
import { validarRegistro } from "../utils/validaciones.js";

const REGION_INICIAL =
  REGIONES.find((region) => region.nombre === "Región de Coquimbo") ||
  REGIONES[0];

const FORMULARIO_INICIAL = {
  run: "",
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  fechaNacimiento: "",
  direccion: "",
  region: REGION_INICIAL.nombre,
  comuna: REGION_INICIAL.comunas[0],
  tipoCliente: "Contratista",
  cuentaCorriente: true,
  codigoPromocional: "",
};

export default function Registro() {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const comunas =
    REGIONES.find((region) => region.nombre === formulario.region)?.comunas ||
    [];

  function actualizar(campo, valor) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  }

  function cambiarRegion(valor) {
    const region = REGIONES.find((item) => item.nombre === valor);
    setFormulario((previo) => ({
      ...previo,
      region: valor,
      comuna: region?.comunas[0] || "",
    }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const erroresEncontrados = validarRegistro(formulario);
    setErrores(erroresEncontrados);
    setMensaje("");
    setErrorGeneral("");

    if (Object.keys(erroresEncontrados).length > 0) return;

    setEnviando(true);
    try {
      await api.registrar({
        run: formulario.run.trim(),
        nombre: formulario.nombre.trim(),
        apellidos: formulario.apellidos.trim(),
        email: formulario.email.trim().toLowerCase(),
        password: formulario.password,
        fechaNacimiento: formulario.fechaNacimiento,
        direccion: formulario.direccion.trim(),
        region: formulario.region,
        comuna: formulario.comuna,
        tipoCliente: formulario.tipoCliente,
        cuentaCorriente:
          formulario.tipoCliente === "Contratista" &&
          Boolean(formulario.cuentaCorriente),
        codigoPromocional: formulario.codigoPromocional.trim(),
      });

      setMensaje("Registro exitoso. ¡Bienvenido a Ferretería Los Maestros!");
      setFormulario(FORMULARIO_INICIAL);
    } catch (error) {
      setErrorGeneral(error.message || "No fue posible crear la cuenta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <section className="page-title-ferreteria">
        <div className="container">
          <span className="eyebrow">Crear cuenta</span>
          <h1>Registro de usuario</h1>
        </div>
      </section>

      <section className="section-ferreteria pt-0">
        <div className="container">
          <div className="form-card">
            {mensaje ? (
              <div className="alert alert-success" role="status">
                {mensaje}{" "}
                <Link to="/login" className="alert-link">
                  Iniciar sesión
                </Link>
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
                  <label className="form-label" htmlFor="registro-run">
                    RUN *
                  </label>
                  <input
                    id="registro-run"
                    className="form-control"
                    placeholder="12345678-5"
                    value={formulario.run}
                    onChange={(evento) =>
                      actualizar("run", evento.target.value)
                    }
                  />
                  {errores.run ? (
                    <p className="error-campo">{errores.run}</p>
                  ) : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-nombre">
                    Nombre *
                  </label>
                  <input
                    id="registro-nombre"
                    className="form-control"
                    maxLength={50}
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
                  <label className="form-label" htmlFor="registro-apellidos">
                    Apellidos *
                  </label>
                  <input
                    id="registro-apellidos"
                    className="form-control"
                    maxLength={100}
                    value={formulario.apellidos}
                    onChange={(evento) =>
                      actualizar("apellidos", evento.target.value)
                    }
                  />
                  {errores.apellidos ? (
                    <p className="error-campo">{errores.apellidos}</p>
                  ) : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-email">
                    Correo *
                  </label>
                  <input
                    id="registro-email"
                    type="email"
                    className="form-control"
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

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-password">
                    Contraseña *
                  </label>
                  <input
                    id="registro-password"
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

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-fecha">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="registro-fecha"
                    type="date"
                    className="form-control"
                    value={formulario.fechaNacimiento}
                    onChange={(evento) =>
                      actualizar("fechaNacimiento", evento.target.value)
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="registro-direccion">
                    Dirección *
                  </label>
                  <input
                    id="registro-direccion"
                    className="form-control"
                    maxLength={300}
                    value={formulario.direccion}
                    onChange={(evento) =>
                      actualizar("direccion", evento.target.value)
                    }
                  />
                  {errores.direccion ? (
                    <p className="error-campo">{errores.direccion}</p>
                  ) : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-region">
                    Región
                  </label>
                  <select
                    id="registro-region"
                    className="form-select"
                    value={formulario.region}
                    onChange={(evento) => cambiarRegion(evento.target.value)}
                  >
                    {REGIONES.map((region) => (
                      <option key={region.nombre} value={region.nombre}>
                        {region.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-comuna">
                    Comuna
                  </label>
                  <select
                    id="registro-comuna"
                    className="form-select"
                    value={formulario.comuna}
                    onChange={(evento) =>
                      actualizar("comuna", evento.target.value)
                    }
                  >
                    {comunas.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="registro-tipo">
                    Tipo de cliente
                  </label>
                  <select
                    id="registro-tipo"
                    className="form-select"
                    value={formulario.tipoCliente}
                    onChange={(evento) =>
                      actualizar("tipoCliente", evento.target.value)
                    }
                  >
                    <option value="Contratista">Contratista / Maestro de obra</option>
                    <option value="Particular">Cliente particular</option>
                  </select>
                </div>

                {formulario.tipoCliente === "Contratista" ? (
                  <div className="col-12 col-md-6 d-flex align-items-end">
                    <div className="form-check mb-2">
                      <input
                        id="registro-cuenta"
                        className="form-check-input"
                        type="checkbox"
                        checked={formulario.cuentaCorriente}
                        onChange={(evento) =>
                          actualizar("cuentaCorriente", evento.target.checked)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="registro-cuenta"
                      >
                        Solicitar cuenta corriente
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className="col-12">
                  <label className="form-label" htmlFor="registro-promocional">
                    Código promocional (opcional)
                  </label>
                  <input
                    id="registro-promocional"
                    className="form-control"
                    placeholder="MAESTRO10"
                    value={formulario.codigoPromocional}
                    onChange={(evento) =>
                      actualizar("codigoPromocional", evento.target.value)
                    }
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-ferreteria"
                    disabled={enviando}
                  >
                    {enviando ? "Creando cuenta…" : "Crear cuenta"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
