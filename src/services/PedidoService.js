import { DescuentoNormal } from "../descuentos/DescuentoNormal.js";
import { DescuentoPremium } from "../descuentos/DescuentoPremium.js";
import { DescuentoVIP } from "../descuentos/DescuentoVIP.js";
import { DescuentoMayorista } from "../descuentos/DescuentoMayorista.js";
import { EnvioNormal } from "../envios/EnvioNormal.js";
import { EnvioExpress } from "../envios/EnvioExpress.js";
import { RetiroLocal } from "../envios/RetiroLocal.js";
import { LocalStoragePedidoRepository } from "../repositories/LocalStoragePedidoRepository.js";
import { EmailNotificador } from "../notifications/EmailNotificador.js";

const ESTRATEGIAS_DESCUENTO = {
  normal: new DescuentoNormal(),
  premium: new DescuentoPremium(),
  vip: new DescuentoVIP(),
  mayorista: new DescuentoMayorista(),
};

const ESTRATEGIAS_ENVIO = {
  normal: new EnvioNormal(),
  express: new EnvioExpress(),
  "retiro-local": new RetiroLocal(),
};

export class PedidoService {
  constructor({
    repository = new LocalStoragePedidoRepository(),
    notificador = new EmailNotificador(),
  } = {}) {
    this.repository = repository;
    this.notificador = notificador;
  }

  get pedidos() {
    return this.repository.obtenerTodos ? this.repository.obtenerTodos() : this.repository.pedidos;
  }

  _resolverDescuento(descuento) {
    if (descuento && typeof descuento.aplicar === "function") {
      return descuento;
    }
    return ESTRATEGIAS_DESCUENTO[descuento] || new DescuentoNormal();
  }

  _resolverEnvio(envio) {
    if (envio && typeof envio.calcular === "function") {
      return envio;
    }
    return ESTRATEGIAS_ENVIO[envio] || { calcular: () => 0 };
  }

  registrar(pedido, tipoCliente, tipoEnvio) {
    let subtotal = 0;

    for (const producto of pedido.productos) {
      subtotal += producto.precio;
    }

    const estrategiaDescuento = this._resolverDescuento(tipoCliente);
    let total = estrategiaDescuento.aplicar(subtotal);

    const estrategiaEnvio = this._resolverEnvio(tipoEnvio);
    total += estrategiaEnvio.calcular(pedido);

    this.repository.guardar({ pedido, total });

    if (this.notificador && typeof this.notificador.notificar === "function") {
      this.notificador.notificar(pedido);
    }

    return total;
  }
}
