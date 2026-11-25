import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contacto from "./Contacto.jsx";

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Formulario de Contacto", () => {
  it("muestra los campos obligatorios cuando se envía vacío", async () => {
    const user = userEvent.setup();
    render(<Contacto />);

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      await screen.findByText(/El nombre es requerido/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/El comentario es requerido/i)
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("envía el mensaje a la API y confirma la recepción", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(respuesta({ id: 1 }, 201));
    render(<Contacto />);

    await user.type(screen.getByLabelText(/^Nombre/i), "María");
    await user.type(screen.getByLabelText(/^Correo/i), "alumna@duoc.cl");
    await user.type(
      screen.getByLabelText(/^Comentario/i),
      "Quiero cotizar cemento y áridos."
    );
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      await screen.findByText(/Mensaje enviado correctamente/i)
    ).toBeInTheDocument();

    const cuerpo = JSON.parse(vi.mocked(fetch).mock.calls[0][1].body);
    expect(cuerpo).toEqual({
      nombre: "María",
      email: "alumna@duoc.cl",
      mensaje: "Quiero cotizar cemento y áridos.",
    });
  });
});
