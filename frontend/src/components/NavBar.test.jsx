import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { guardarToken, TOKEN_KEY } from "../services/api.js";
import NavBar from "./NavBar.jsx";

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

function simularPerfil(perfil) {
  vi.mocked(fetch).mockImplementation(async (url) => {
    if (String(url).includes("/auth/me")) return respuesta(perfil);
    return respuesta([]);
  });
}

function renderizar() {
  render(
    <MemoryRouter>
      <CarritoProvider>
        <SesionProvider>
          <NavBar />
        </SesionProvider>
      </CarritoProvider>
    </MemoryRouter>
  );
}

describe("NavBar", () => {
  it("muestra el logo, enlaces principales y contador sin sesión", () => {
    renderizar();

    expect(
      screen.getByRole("img", { name: /ferretería los maestros/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inicio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catálogo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nosotros" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contacto" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ingresar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /carrito/i })).toHaveTextContent(
      "0"
    );
  });

  it("muestra Admin y Salir cuando la API devuelve rol Administrador", async () => {
    guardarToken("jwt-demo");
    simularPerfil({
      id: 1,
      email: "admin@duoc.cl",
      nombre: "María",
      rol: "Administrador",
      cuentaCorriente: true,
    });

    renderizar();

    expect(await screen.findByText(/Hola, María/i)).toBeInTheDocument();
    expect(screen.getByText("Administrador")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Ingresar" })
    ).not.toBeInTheDocument();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("jwt-demo");
  });

  it("no muestra Admin a un cliente particular", async () => {
    guardarToken("jwt-cliente");
    simularPerfil({
      id: 2,
      email: "cliente@gmail.com",
      nombre: "Pedro",
      rol: "Particular",
      cuentaCorriente: false,
    });

    renderizar();

    expect(await screen.findByText(/Hola, Pedro/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
  });
});
