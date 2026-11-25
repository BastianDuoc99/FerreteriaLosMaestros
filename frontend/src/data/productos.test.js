import { describe, expect, it } from "vitest";
import {
  CATEGORIAS,
  formatearCLP,
  getProductosConStockBajo,
  PRODUCTOS,
  stockBajo,
} from "./productos.js";

describe("Catálogo de productos", () => {
  it("contiene las 85 referencias del catálogo y 11 categorías normalizadas", () => {
    expect(PRODUCTOS).toHaveLength(85);
    expect(CATEGORIAS).toHaveLength(11);
  });

  it("formatea los precios en pesos chilenos", () => {
    expect(formatearCLP(5990)).toBe("$5.990 CLP");
    expect(formatearCLP(0)).toBe("$0 CLP");
  });

  it("detecta stock bajo o agotado según el mínimo configurado", () => {
    expect(stockBajo({ stock: 5, stockMinimo: 20 })).toBe(true);
    expect(stockBajo({ stock: 20, stockMinimo: 20 })).toBe(true);
    expect(stockBajo({ stock: 21, stockMinimo: 20 })).toBe(false);
    expect(stockBajo({ stock: 0, stockMinimo: 20 })).toBe(true);
  });

  it("obtiene los productos con stock bajo desde el catálogo base", () => {
    const bajos = getProductosConStockBajo();
    expect(bajos).toEqual(PRODUCTOS.filter(stockBajo));
  });
});
