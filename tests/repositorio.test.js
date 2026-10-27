import { describe, expect, test, beforeEach } from "@jest/globals";
import { LocalStoragePedidoRepository } from "../src/repositories/LocalStoragePedidoRepository.js";

describe("LocalStoragePedidoRepository (SRP / Persistencia)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("guarda un pedido en memoria y en localStorage", () => {
    const repo = new LocalStoragePedidoRepository();
    const registro = {
      pedido: { cliente: { nombre: "Ana" } },
      total: 5000,
    };

    repo.guardar(registro);

    expect(repo.obtenerTodos().length).toBe(1);
    expect(repo.obtenerTodos()[0]).toEqual(registro);
    expect(localStorage.getItem("pedidos")).toBe(JSON.stringify([registro]));
  });

  test("permite acumular múltiples pedidos", () => {
    const repo = new LocalStoragePedidoRepository();
    repo.guardar({ total: 1000 });
    repo.guardar({ total: 2000 });

    expect(repo.obtenerTodos().length).toBe(2);
    expect(JSON.parse(localStorage.getItem("pedidos")).length).toBe(2);
  });
});
