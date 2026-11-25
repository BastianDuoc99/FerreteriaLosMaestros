import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Registro from "./Registro.jsx";

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

function renderizar() {
  render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );
}

async function completar(user, overrides = {}) {
  const datos = {
    run: "12345678-5",
    nombre: "María",
    apellidos: "González",
    email: "alumna@duoc.cl",
    password: "1234",
    direccion: "Av. Siempre Viva 123",
    ...overrides,
  };

  await user.type(screen.getByLabelText(/^RUN/i), datos.run);
  await user.type(screen.getByLabelText(/^Nombre/i), datos.nombre);
  await user.type(screen.getByLabelText(/^Apellidos/i), datos.apellidos);
  await user.type(screen.getByLabelText(/^Correo/i), datos.email);
  await user.type(screen.getByLabelText(/^Contraseña/i), datos.password);
  await user.type(screen.getByLabelText(/^Dirección/i), datos.direccion);
}

describe("Formulario de Registro", () => {
  it("muestra errores y no envía datos cuando son inválidos", async () => {
    const user = userEvent.setup();
    renderizar();

    await completar(user, {
      run: "12345678-9",
      email: "alumna@correo.cl",
    });
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText(/RUN inválido/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo inválido o no permitido/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("envía el registro a la API con los datos del formulario", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockImplementation(async (url) => {
      if (String(url).includes("/auth/registro")) {
        return respuesta(
          {
            id: 2,
            email: "alumna@duoc.cl",
            nombre: "María",
            rol: "Contratista",
          },
          201
        );
      }
      return respuesta([]);
    });
    renderizar();

    await completar(user);
    await user.type(
      screen.getByLabelText(/código promocional/i),
      "FELICES50"
    );
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText(/Registro exitoso/i)).toBeInTheDocument();

    const llamada = vi.mocked(fetch).mock.calls.find(([url]) =>
      String(url).includes("/auth/registro")
    );
    const cuerpo = JSON.parse(llamada[1].body);
    expect(cuerpo).toMatchObject({
      run: "12345678-5",
      email: "alumna@duoc.cl",
      password: "1234",
      codigoPromocional: "FELICES50",
      tipoCliente: "Contratista",
      cuentaCorriente: true,
      region: "Región de Coquimbo",
    });
    expect(cuerpo).not.toHaveProperty("rol");
  });
});
