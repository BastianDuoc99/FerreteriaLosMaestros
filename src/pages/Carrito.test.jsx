import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  CARRITO_KEY,
  CarritoProvider,
  useCarrito,
} from "../context/CarritoContext.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { getPedidos } from "../data/pedidos.js";
import { getProductos } from "../data/productos.js";
import Carrito from "./Carrito.jsx";

const itemBase = {
  codigo: "MC001",
  nombre: "Cemento Polpaico gris 25 kg",
  precio: 5990,
  qty: 2,
  categoria: "Materiales de Construcción",
  marca: "Polpaico",
  unidad: "Saco",
  stock: 80,
  imagen: "/assets/img/cat-materiales.svg",
};

function EspiaAviso() {
  const { aviso } = useCarrito();
  return <p data-testid="aviso">{aviso}</p>;
}

function renderizar(conAviso = false) {
  render(
    <MemoryRouter>
      <CarritoProvider>
        <SesionProvider>
          <Carrito />
          {conAviso ? <EspiaAviso /> : null}
        </SesionProvider>
      </CarritoProvider>
    </MemoryRouter>
  );
}

describe("Página del Carrito", () => {
  it("muestra el estado vacío cuando no hay productos", () => {
    renderizar();
    expect(
      screen.getByRole("heading", { name: /tu carrito está vacío/i })
    ).toBeInTheDocument();
  });

  it("renderiza los productos guardados y calcula el total", () => {
    localStorage.setItem(CARRITO_KEY, JSON.stringify([itemBase]));
    renderizar();

    expect(screen.getByText(itemBase.nombre)).toBeInTheDocument();
    expect(screen.getByLabelText(`Cantidad de ${itemBase.nombre}`)).toHaveValue(
      "2"
    );
    expect(screen.getAllByText("$11.980 CLP").length).toBeGreaterThan(0);
  });

  it("aumenta la cantidad de un producto", async () => {
    const user = userEvent.setup();
    localStorage.setItem(CARRITO_KEY, JSON.stringify([{ ...itemBase, qty: 1 }]));
    renderizar();

    await user.click(
      screen.getByRole("button", {
        name: `Aumentar cantidad de ${itemBase.nombre}`,
      })
    );

    expect(screen.getByLabelText(`Cantidad de ${itemBase.nombre}`)).toHaveValue(
      "2"
    );
  });

  it("no permite superar el stock disponible y avisa al usuario", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CARRITO_KEY,
      JSON.stringify([{ ...itemBase, qty: itemBase.stock }])
    );
    renderizar(true);

    await user.click(
      screen.getByRole("button", {
        name: `Aumentar cantidad de ${itemBase.nombre}`,
      })
    );

    expect(screen.getByTestId("aviso")).toHaveTextContent(
      /Solo hay 80 Saco disponibles/i
    );
    expect(screen.getByLabelText(`Cantidad de ${itemBase.nombre}`)).toHaveValue(
      "80"
    );
  });

  it("registra el pedido, descuenta stock y vacía el carrito", async () => {
    const user = userEvent.setup();
    localStorage.setItem(CARRITO_KEY, JSON.stringify([itemBase]));
    renderizar();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(await screen.findByText(/Pedido PED-/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /pedido registrado/i })
    ).toBeInTheDocument();

    const pedidos = getPedidos();
    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].total).toBe(11980);
    expect(pedidos[0].items[0].qty).toBe(2);

    const producto = getProductos().find(
      (item) => item.codigo === itemBase.codigo
    );
    expect(producto.stock).toBe(78);
  });

  it("elimina un producto del carrito", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CARRITO_KEY,
      JSON.stringify([{ ...itemBase, qty: 1 }])
    );
    renderizar();

    await user.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(
      screen.getByRole("heading", { name: /tu carrito está vacío/i })
    ).toBeInTheDocument();
  });
});
