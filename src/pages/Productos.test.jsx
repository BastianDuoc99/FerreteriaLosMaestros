import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { PRODUCTOS, PRODUCTOS_KEY } from "../data/productos.js";
import Productos from "./Productos.jsx";

function renderizar() {
  render(
    <MemoryRouter>
      <CarritoProvider>
        <Productos />
      </CarritoProvider>
    </MemoryRouter>
  );
}

describe("Página de Productos", () => {
  it("renderiza una tarjeta por cada producto del catálogo", () => {
    renderizar();
    expect(screen.getAllByTestId("producto-card")).toHaveLength(
      PRODUCTOS.length
    );
  });

  it("filtra por texto de búsqueda", async () => {
    const user = userEvent.setup();
    renderizar();

    await user.type(screen.getByLabelText(/buscar producto/i), "cemento");

    const tarjetas = screen.getAllByTestId("producto-card");
    expect(tarjetas).toHaveLength(2);
    expect(
      screen.getByText("Cemento Polpaico gris 25 kg")
    ).toBeInTheDocument();
  });

  it("filtra por categoría y muestra un estado vacío cuando no hay coincidencias", async () => {
    const user = userEvent.setup();
    renderizar();

    await user.selectOptions(
      screen.getByLabelText(/categoría/i),
      "Pinturas y Recubrimientos"
    );
    expect(screen.getAllByTestId("producto-card")).toHaveLength(9);

    await user.type(
      screen.getByLabelText(/buscar producto/i),
      "producto-inexistente"
    );
    expect(
      screen.getByText(/No se encontraron productos/i)
    ).toBeInTheDocument();
  });

  it("oculta los productos sin stock al activar el filtro de disponibilidad", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      PRODUCTOS_KEY,
      JSON.stringify([{ ...PRODUCTOS[0], stock: 0 }])
    );
    renderizar();

    expect(screen.getAllByTestId("producto-card")).toHaveLength(
      PRODUCTOS.length
    );

    await user.click(screen.getByLabelText(/solo con stock/i));

    expect(screen.getAllByTestId("producto-card")).toHaveLength(
      PRODUCTOS.length - 1
    );
    expect(
      screen.queryByText("Cemento Polpaico gris 25 kg")
    ).not.toBeInTheDocument();
  });
});
