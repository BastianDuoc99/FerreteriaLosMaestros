import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SesionProvider } from "../context/SesionContext.jsx";
import { TOKEN_KEY } from "../services/api.js";
import Login from "./Login.jsx";

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

function simularLogin(datos, estado = 200) {
  vi.mocked(fetch).mockImplementation(async (url) => {
    if (String(url).includes("/auth/login")) return respuesta(datos, estado);
    return respuesta([]);
  });
}

function renderizar() {
  render(
    <MemoryRouter>
      <SesionProvider>
        <Login />
      </SesionProvider>
    </MemoryRouter>
  );
}

describe("Inicio de sesión", () => {
  it("muestra errores con correo no permitido y contraseña corta", async () => {
    const user = userEvent.setup();
    renderizar();

    await user.type(screen.getByLabelText(/^Correo/i), "maria@correo.cl");
    await user.type(screen.getByLabelText(/^Contraseña/i), "123");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText(/Solo se permiten correos/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Debe tener entre 4 y 10 caracteres/i)
    ).toBeInTheDocument();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("guarda el token devuelto por la API cuando las credenciales son válidas", async () => {
    const user = userEvent.setup();
    simularLogin({
      id: 1,
      token: "jwt-demo",
      email: "maria@duoc.cl",
      nombre: "María",
      rol: "Contratista",
      cuentaCorriente: false,
    });
    renderizar();

    await user.type(screen.getByLabelText(/^Correo/i), "maria@duoc.cl");
    await user.type(screen.getByLabelText(/^Contraseña/i), "1234");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText(/Bienvenido de nuevo, María/i)
    ).toBeInTheDocument();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("jwt-demo");
  });

  it("muestra el error de la API cuando las credenciales no coinciden", async () => {
    const user = userEvent.setup();
    simularLogin({ message: "Correo o contraseña incorrectos." }, 401);
    renderizar();

    await user.type(screen.getByLabelText(/^Correo/i), "maria@duoc.cl");
    await user.type(screen.getByLabelText(/^Contraseña/i), "9999");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText(/Correo o contraseña incorrectos/i)
    ).toBeInTheDocument();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
