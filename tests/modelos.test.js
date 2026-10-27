import { describe, expect, test } from "@jest/globals";
import { Producto } from "../src/models/Producto.js";
import { Pedido } from "../src/models/Pedido.js";

describe("Modelos: completar sin agregar responsabilidades innecesarias", () => {
  test("Producto conserva su id, nombre y precio", () => {
    const producto = new Producto(1, "Cuaderno", 3000);

    expect(producto.id).toBe(1);
    expect(producto.nombre).toBe("Cuaderno");
    expect(producto.precio).toBe(3000);
  });

  test("Pedido conserva su cliente y sus productos", () => {
    const cliente = { nombre: "Ana", email: "ana@example.com" };
    const productos = [
      new Producto(1, "Cuaderno", 3000),
      new Producto(2, "Lapicera", 1000),
    ];

    const pedido = new Pedido(cliente, productos);

    expect(pedido.cliente).toEqual(cliente);
    expect(pedido.productos).toBe(productos);
    expect(pedido.productos.length).toBe(2);
  });

  test("Pedido comienza con productos vacios cuando se omiten", () => {
    const cliente = { nombre: "Carlos", email: "carlos@example.com" };
    const pedido = new Pedido(cliente);

    expect(pedido.productos).toEqual([]);
    expect(pedido.productos.length).toBe(0);
  });

  test("dos pedidos creados sin productos no comparten el mismo arreglo", () => {
    const pedido1 = new Pedido({ nombre: "Cliente 1" });
    const pedido2 = new Pedido({ nombre: "Cliente 2" });

    expect(pedido1.productos).not.toBe(pedido2.productos);

    pedido1.productos.push(new Producto(1, "Goma", 500));
    expect(pedido1.productos.length).toBe(1);
    expect(pedido2.productos.length).toBe(0);
  });
});
