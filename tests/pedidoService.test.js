import { describe, expect, test } from "@jest/globals";
import { Producto } from "../src/models/Producto.js";
import { Pedido } from "../src/models/Pedido.js";
import { PedidoService } from "../src/services/PedidoService.js";
import { DescuentoVIP } from "../src/descuentos/DescuentoVIP.js";
import { EnvioExpress } from "../src/envios/EnvioExpress.js";

describe("PedidoService: caracterizacion antes de refactorizar", () => {
  test("cliente normal con envio normal paga subtotal mas 1000", () => {
    const pedido = new Pedido(
      { nombre: "Ana", email: "ana@example.com" },
      [new Producto(1, "Cuaderno", 3000), new Producto(2, "Lapicera", 1000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "normal", "normal");

    expect(total).toBe(5000);
  });

  test("cliente premium recibe 10% de descuento sobre los productos", () => {
    const pedido = new Pedido(
      { nombre: "Bruno", email: "bruno@example.com" },
      [new Producto(1, "Cuaderno", 3000), new Producto(2, "Lapicera", 1000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "premium", "normal");

    // 4000 * 0.9 = 3600; 3600 + 1000 = 4600
    expect(total).toBe(4600);
  });

  test("cliente VIP recibe 20% de descuento sobre los productos", () => {
    const pedido = new Pedido(
      { nombre: "Carla", email: "carla@example.com" },
      [new Producto(1, "Cuaderno", 3000), new Producto(2, "Lapicera", 1000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "vip", "normal");

    // 4000 * 0.8 = 3200; 3200 + 1000 = 4200
    expect(total).toBe(4200);
  });

  test("envio express agrega 2000", () => {
    const pedido = new Pedido(
      { nombre: "David", email: "david@example.com" },
      [new Producto(1, "Cuaderno", 3000), new Producto(2, "Lapicera", 1000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "normal", "express");

    // 4000 + 2000 = 6000
    expect(total).toBe(6000);
  });

  test("el descuento no se aplica al costo de envio", () => {
    const pedido = new Pedido(
      { nombre: "Elena", email: "elena@example.com" },
      [new Producto(1, "Cuaderno", 3000), new Producto(2, "Lapicera", 1000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "premium", "express");

    // Descuento sobre productos: 4000 * 0.9 = 3600
    // Envio express: 2000 (sin descuento)
    // Total esperado: 3600 + 2000 = 5600
    expect(total).toBe(5600);
  });

  test("combina distintos tipos de cliente y envio", () => {
    const pedido = new Pedido(
      { nombre: "Franco", email: "franco@example.com" },
      [new Producto(3, "Mochila", 12000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "vip", "express");

    // 12000 * 0.8 = 9600; 9600 + 2000 = 11600
    expect(total).toBe(11600);
  });

  test("conserva correctamente un total con decimales", () => {
    const pedido = new Pedido(
      { nombre: "Gisela", email: "gisela@example.com" },
      [new Producto(1, "Articulo decimal", 33.33)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "premium", "normal");

    // 33.33 * 0.9 = 29.997; 29.997 + 1000 = 1029.997
    expect(total).toBeCloseTo(1029.997, 2);
  });

  test("registra el pedido y el total en memoria", () => {
    const pedido = new Pedido(
      { nombre: "Hector", email: "hector@example.com" },
      [new Producto(1, "Cuaderno", 3000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "normal", "normal");

    expect(service.pedidos.length).toBe(1);
    expect(service.pedidos[0]).toEqual({ pedido, total });
  });

  test("conserva dos pedidos registrados con la misma instancia", () => {
    const service = new PedidoService();
    const pedido1 = new Pedido(
      { nombre: "Ines", email: "ines@example.com" },
      [new Producto(1, "Cuaderno", 3000)],
    );
    const pedido2 = new Pedido(
      { nombre: "Jorge", email: "jorge@example.com" },
      [new Producto(2, "Lapicera", 1000)],
    );

    const total1 = service.registrar(pedido1, "normal", "normal");
    const total2 = service.registrar(pedido2, "premium", "express");

    expect(service.pedidos.length).toBe(2);
    expect(service.pedidos[0]).toEqual({ pedido: pedido1, total: total1 });
    expect(service.pedidos[1]).toEqual({ pedido: pedido2, total: total2 });
  });

  test("calcula correctamente el total con un solo producto", () => {
    const pedido = new Pedido(
      { nombre: "Laura", email: "laura@example.com" },
      [new Producto(1, "Cuaderno", 3000)],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "normal", "normal");

    expect(total).toBe(4000);
  });

  test("calcula correctamente el total con el mismo producto repetido", () => {
    const cuaderno = new Producto(1, "Cuaderno", 3000);
    const pedido = new Pedido(
      { nombre: "Martin", email: "martin@example.com" },
      [cuaderno, cuaderno, cuaderno],
    );
    const service = new PedidoService();

    const total = service.registrar(pedido, "normal", "normal");

    // 3 * 3000 = 9000; 9000 + 1000 = 10000
    expect(total).toBe(10000);
  });

  test("permite pasar una estrategia de descuento polimorfica directamente", () => {
    const pedido = new Pedido(
      { nombre: "Natalia", email: "natalia@example.com" },
      [new Producto(1, "Mochila", 10000)],
    );
    const service = new PedidoService();

    // Inyectando directamente una instancia de DescuentoVIP
    const total = service.registrar(pedido, new DescuentoVIP(), "normal");

    // 10000 * 0.8 = 8000 + 1000 = 9000
    expect(total).toBe(9000);
  });

  test("permite pasar una estrategia de envio polimorfica directamente", () => {
    const pedido = new Pedido(
      { nombre: "Osvaldo", email: "osvaldo@example.com" },
      [new Producto(1, "Mochila", 10000)],
    );
    const service = new PedidoService();

    // Inyectando directamente una instancia de EnvioExpress
    const total = service.registrar(pedido, "normal", new EnvioExpress());

    // 10000 + 2000 = 12000
    expect(total).toBe(12000);
  });
});
