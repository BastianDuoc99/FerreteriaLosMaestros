import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { SESION_KEY } from "../utils/sesion.js";
import NavBar from "./NavBar.jsx";

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
  it("muestra el logo, los enlaces principales y el contador del carrito", () => {
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

  it("muestra el nombre del usuario, su rol, Admin y Salir cuando es administrador", () => {
    localStorage.setItem(
      SESION_KEY,
      JSON.stringify({
        email: "admin@duoc.cl",
        nombre: "María",
        rol: "Administrador",
      })
    );

    renderizar();

    expect(screen.getByText(/Hola, María/i)).toBeInTheDocument();
    expect(screen.getByText("Administrador")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Ingresar" })
    ).not.toBeInTheDocument();
  });

  it("no muestra Admin a un cliente particular", () => {
    localStorage.setItem(
      SESION_KEY,
      JSON.stringify({
        email: "cliente@gmail.com",
        nombre: "Pedro",
        rol: "Particular",
      })
    );

    renderizar();

    expect(screen.getByText(/Hola, Pedro/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
  });
});
