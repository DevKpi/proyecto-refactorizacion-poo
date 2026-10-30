import { describe, expect, test } from "@jest/globals";
import { DescuentoNormal } from "../src/descuentos/DescuentoNormal.js";
import { DescuentoPremium } from "../src/descuentos/DescuentoPremium.js";
import { DescuentoVIP } from "../src/descuentos/DescuentoVIP.js";
import { DescuentoMayorista } from "../src/descuentos/DescuentoMayorista.js";

describe("Estrategias de Descuento (Polimorfismo / OCP / LSP)", () => {
  test("DescuentoNormal no altera el subtotal (0% descuento)", () => {
    const estrategia = new DescuentoNormal();
    expect(estrategia.aplicar(1000)).toBe(1000);
    expect(estrategia.aplicar(5000)).toBe(5000);
  });

  test("DescuentoPremium aplica un 10% de descuento sobre el subtotal", () => {
    const estrategia = new DescuentoPremium();
    expect(estrategia.aplicar(1000)).toBe(900);
    expect(estrategia.aplicar(4000)).toBe(3600);
  });

  test("DescuentoVIP aplica un 20% de descuento sobre el subtotal", () => {
    const estrategia = new DescuentoVIP();
    expect(estrategia.aplicar(1000)).toBe(800);
    expect(estrategia.aplicar(4000)).toBe(3200);
  });

  test("DescuentoMayorista aplica un 25% de descuento sobre el subtotal", () => {
    const estrategia = new DescuentoMayorista();
    expect(estrategia.aplicar(1000)).toBe(750);
    expect(estrategia.aplicar(4000)).toBe(3000);
  });

  test("todas las estrategias de descuento cumplen el mismo contrato polimórfico (LSP)", () => {
    const estrategias = [
      new DescuentoNormal(),
      new DescuentoPremium(),
      new DescuentoVIP(),
      new DescuentoMayorista(),
    ];

    const subtotal = 10000;
    for (const estrategia of estrategias) {
      const resultado = estrategia.aplicar(subtotal);
      expect(typeof resultado).toBe("number");
      expect(resultado).toBeGreaterThan(0);
      expect(resultado).toBeLessThanOrEqual(subtotal);
    }
  });
});
