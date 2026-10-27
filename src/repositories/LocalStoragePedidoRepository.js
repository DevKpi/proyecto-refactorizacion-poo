export class LocalStoragePedidoRepository {
  constructor(storageKey = "pedidos") {
    this.storageKey = storageKey;
    this.pedidos = [];
  }

  guardar(registro) {
    this.pedidos.push(registro);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.pedidos));
    }
  }

  obtenerTodos() {
    return [...this.pedidos];
  }
}
