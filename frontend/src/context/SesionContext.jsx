import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, guardarToken, limpiarToken } from "../services/api.js";

const SesionContext = createContext(null);

function perfilDesdeAuth(datos) {
  return {
    id: datos.id,
    email: datos.email,
    nombre: datos.nombre,
    rol: datos.rol,
    cuentaCorriente: datos.cuentaCorriente,
  };
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    if (!getToken()) {
      setCargando(false);
      return undefined;
    }

    api.perfil()
      .then((datos) => {
        if (activo) setUsuario(datos);
      })
      .catch(() => {
        limpiarToken();
        if (activo) setUsuario(null);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const iniciarSesion = useCallback(async (credenciales) => {
    const respuesta = await api.login(credenciales);
    guardarToken(respuesta.token);
    setUsuario(perfilDesdeAuth(respuesta));
    return respuesta;
  }, []);

  const cerrarSesion = useCallback(() => {
    limpiarToken();
    setUsuario(null);
  }, []);

  return (
    <SesionContext.Provider
      value={{ usuario, cargando, iniciarSesion, cerrarSesion }}
    >
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de SesionProvider");
  }
  return contexto;
}
