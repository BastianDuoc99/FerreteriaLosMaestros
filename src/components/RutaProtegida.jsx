import { Navigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

const ROLES_CON_ACCESO = ["Administrador", "Vendedor"];

export default function RutaProtegida({ children }) {
  const { usuario } = useSesion();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!ROLES_CON_ACCESO.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
