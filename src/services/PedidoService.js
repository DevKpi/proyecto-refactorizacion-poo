import { DescuentoNormal } from "../descuentos/DescuentoNormal.js";
import { DescuentoPremium } from "../descuentos/DescuentoPremium.js";
import { DescuentoVIP } from "../descuentos/DescuentoVIP.js";

const ESTRATEGIAS_DESCUENTO = {
  normal: new DescuentoNormal(),
  premium: new DescuentoPremium(),
  vip: new DescuentoVIP(),
};

export class PedidoService {
  constructor() {
    this.pedidos = [];
  }

  _resolverDescuento(descuento) {
    if (descuento && typeof descuento.aplicar === "function") {
      return descuento;
    }
    return ESTRATEGIAS_DESCUENTO[descuento] || new DescuentoNormal();
  }

  registrar(pedido, tipoCliente, tipoEnvio) {
    let subtotal = 0;

    for (const producto of pedido.productos) {
      subtotal += producto.precio;
    }

    const estrategiaDescuento = this._resolverDescuento(tipoCliente);
    let total = estrategiaDescuento.aplicar(subtotal);

    let costoEnvio = 0;

    if (tipoEnvio === "normal") {
      costoEnvio = 1000;
    }

    if (tipoEnvio === "express") {
      costoEnvio = 2000;
    }

    total += costoEnvio;
    this.pedidos.push({ pedido, total });

    localStorage.setItem("pedidos", JSON.stringify(this.pedidos));
    console.log(`Email enviado a ${pedido.cliente.email}`);

    return total;
  }
}
