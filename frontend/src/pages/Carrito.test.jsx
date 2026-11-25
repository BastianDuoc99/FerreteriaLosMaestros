import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  CARRITO_KEY,
  CarritoProvider,
  useCarrito,
} from "../context/CarritoContext.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { guardarToken } from "../services/api.js";
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

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

function simularApi() {
  vi.mocked(fetch).mockImplementation(async (url, opciones) => {
    const ruta = String(url);
    if (ruta.includes("/auth/me")) {
      return respuesta({
        id: 3,
        email: "cliente@duoc.cl",
        nombre: "Cliente",
        rol: "Contratista",
        cuentaCorriente: true,
      });
    }
    if (ruta.includes("/pedidos") && opciones?.method === "POST") {
      return respuesta(
        {
          id: "PED-123",
          fecha: new Date().toISOString(),
          estado: "Registrado",
          items: [],
          total: "11980",
        },
        201
      );
    }
    return respuesta([]);
  });
}

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

  it("registra el pedido en la API y vacía el carrito", async () => {
    const user = userEvent.setup();
    guardarToken("jwt-demo");
    simularApi();
    localStorage.setItem(CARRITO_KEY, JSON.stringify([itemBase]));
    renderizar();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(
      await screen.findByText(/Pedido PED-123 registrado/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /pedido registrado/i })
    ).toBeInTheDocument();

    const llamada = vi.mocked(fetch).mock.calls.find(
      ([url, opciones]) =>
        String(url).includes("/pedidos") && opciones?.method === "POST"
    );
    const cuerpo = JSON.parse(llamada[1].body);
    expect(cuerpo.items).toEqual([{ codigo: "MC001", qty: 2 }]);
    expect(cuerpo).not.toHaveProperty("total");
    expect(localStorage.getItem(CARRITO_KEY)).toBe("[]");
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
