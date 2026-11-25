import { describe, expect, it, vi } from "vitest";
import {
  api,
  ApiError,
  getToken,
  guardarToken,
  limpiarToken,
  TOKEN_KEY,
} from "./api.js";

function respuesta(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Cliente API", () => {
  it("guarda y limpia el token de sesión", () => {
    guardarToken("token-demo");
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("token-demo");
    expect(getToken()).toBe("token-demo");

    limpiarToken();
    expect(getToken()).toBeNull();
  });

  it("envía el token Bearer en las rutas autenticadas", async () => {
    guardarToken("token-demo");
    vi.mocked(fetch).mockResolvedValue(respuesta({ id: 1, email: "a@duoc.cl" }));

    await api.perfil();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/me"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-demo" }),
      })
    );
  });

  it("convierte las respuestas de error en ApiError", async () => {
    vi.mocked(fetch).mockResolvedValue(
      respuesta({ message: "Correo o contraseña incorrectos." }, 401)
    );

    await expect(
      api.login({ email: "a@duoc.cl", password: "xxxx" })
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      message: "Correo o contraseña incorrectos.",
    });
  });

  it("envía el pedido con código y cantidad sin confiar en precios del cliente", async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta({ id: "PED-1" }, 201));

    await api.crearPedido({
      items: [{ codigo: "MC001", qty: 2 }],
      entrega: "retiro",
      pago: "contado",
      direccion: "",
    });

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1].body);
    expect(body.items).toEqual([{ codigo: "MC001", qty: 2 }]);
    expect(body).not.toHaveProperty("total");
  });
});
