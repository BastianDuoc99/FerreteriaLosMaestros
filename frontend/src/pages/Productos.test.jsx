import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { PRODUCTOS } from "../data/productos.js";
import Productos from "./Productos.jsx";

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

function simularProductos(productos) {
  vi.mocked(fetch).mockImplementation(async (url) => {
    if (String(url).includes("/productos")) return respuesta(productos);
    return respuesta([]);
  });
}

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
  it("renderiza una tarjeta por cada producto devuelto por la API", async () => {
    simularProductos(PRODUCTOS);
    renderizar();
    expect(await screen.findAllByTestId("producto-card")).toHaveLength(
      PRODUCTOS.length
    );
  });

  it("filtra por texto de búsqueda", async () => {
    const user = userEvent.setup();
    simularProductos(PRODUCTOS);
    renderizar();
    await screen.findAllByTestId("producto-card");

    await user.type(screen.getByLabelText(/buscar producto/i), "cemento");

    expect(screen.getAllByTestId("producto-card")).toHaveLength(2);
    expect(
      screen.getByText("Cemento Polpaico gris 25 kg")
    ).toBeInTheDocument();
  });

  it("filtra por categoría y muestra un estado vacío sin coincidencias", async () => {
    const user = userEvent.setup();
    simularProductos(PRODUCTOS);
    renderizar();
    await screen.findAllByTestId("producto-card");

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
    const sinStock = PRODUCTOS.map((producto, indice) =>
      indice === 0 ? { ...producto, stock: 0 } : producto
    );
    simularProductos(sinStock);
    renderizar();
    await screen.findAllByTestId("producto-card");

    await user.click(screen.getByLabelText(/solo con stock/i));

    expect(screen.getAllByTestId("producto-card")).toHaveLength(
      PRODUCTOS.length - 1
    );
    expect(
      screen.queryByText("Cemento Polpaico gris 25 kg")
    ).not.toBeInTheDocument();
  });
});
