import { describe, expect, test } from "@jest/globals";
import { EnvioNormal } from "../src/envios/EnvioNormal.js";
import { EnvioExpress } from "../src/envios/EnvioExpress.js";
import { RetiroLocal } from "../src/envios/RetiroLocal.js";

describe("Estrategias de Envío (Polimorfismo / OCP / LSP)", () => {
  test("EnvioNormal calcula un costo fijo de 1000", () => {
    const envio = new EnvioNormal();
    expect(envio.calcular()).toBe(1000);
  });

  test("EnvioExpress calcula un costo fijo de 2000", () => {
    const envio = new EnvioExpress();
    expect(envio.calcular()).toBe(2000);
  });

  test("RetiroLocal no agrega costo de envío", () => {
    const envio = new RetiroLocal();
    expect(envio.calcular()).toBe(0);
  });

  test("todas las estrategias de envío cumplen el mismo contrato polimórfico (LSP)", () => {
    const envios = [new EnvioNormal(), new EnvioExpress(), new RetiroLocal()];

    for (const envio of envios) {
      const costo = envio.calcular();
      expect(typeof costo).toBe("number");
      expect(costo).toBeGreaterThanOrEqual(0);
    }
  });
});
