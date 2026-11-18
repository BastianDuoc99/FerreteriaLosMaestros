import { describe, expect, it } from "vitest";
import {
  getPedidos,
  getPedidosUsuario,
  guardarPedido,
  PEDIDOS_KEY,
} from "./pedidos.js";

const pedidoBase = {
  usuario: "maria@duoc.cl",
  nombre: "María",
  items: [{ codigo: "MC001", nombre: "Cemento", precio: 5990, qty: 2 }],
  total: 11980,
  entrega: "retiro",
  pago: "contado",
};

describe("Pedidos", () => {
  it("guarda un pedido con identificador, fecha y estado inicial", () => {
    const pedido = guardarPedido(pedidoBase);

    expect(pedido.id).toMatch(/^PED-/);
    expect(pedido.fecha).toBeTruthy();
    expect(pedido.estado).toBe("Registrado");
    expect(getPedidos()).toHaveLength(1);
    expect(localStorage.getItem(PEDIDOS_KEY)).toContain(pedido.id);
  });

  it("filtra los pedidos por correo de usuario sin distinguir mayúsculas", () => {
    guardarPedido(pedidoBase);
    guardarPedido({ ...pedidoBase, usuario: "pedro@gmail.com" });

    expect(getPedidosUsuario("MARIA@duoc.cl")).toHaveLength(1);
    expect(getPedidosUsuario("pedro@gmail.com")).toHaveLength(1);
    expect(getPedidosUsuario("otro@gmail.com")).toHaveLength(0);
  });
});
