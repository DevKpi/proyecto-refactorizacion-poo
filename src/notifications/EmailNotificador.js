export class EmailNotificador {
  notificar(pedido) {
    console.log(`Email enviado a ${pedido.cliente.email}`);
  }
}
