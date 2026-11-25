import { Navigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

export default function RutaProtegida({ children, roles }) {
  const { usuario, cargando } = useSesion();

  if (cargando) return null;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
