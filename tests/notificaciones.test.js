import { describe, expect, test, jest } from "@jest/globals";
import { EmailNotificador } from "../src/notifications/EmailNotificador.js";

describe("EmailNotificador (SRP / Notificaciones)", () => {
  test("notifica al cliente mediante mensaje por consola", () => {
    const notificador = new EmailNotificador();
    const spyConsole = jest.spyOn(console, "log").mockImplementation(() => {});

    const pedido = {
      cliente: { nombre: "Ana", email: "ana@example.com" },
    };

    notificador.notificar(pedido);

    expect(spyConsole).toHaveBeenCalledWith("Email enviado a ana@example.com");

    spyConsole.mockRestore();
  });
});
