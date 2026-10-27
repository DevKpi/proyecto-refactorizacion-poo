# Documentación del Proceso de Refactorización y Principios SOLID

Este documento registra cronológicamente cada decisión técnica, refactorización, principio SOLID aplicado y las pruebas que garantizan la integridad del sistema **Tienda Aula**.

---

## 1. Diagnóstico Inicial del Sistema (Etapa 1)

Al inspeccionar el código original, se detectaron los siguientes problemas de diseño centrados en la clase `PedidoService`:

| Problema Detectado | Evidencia en el Código Original | Principio SOLID Afectado | Justificación |
| :--- | :--- | :--- | :--- |
| **Múltiples responsabilidades en una sola clase (God Method)** | El método `registrar` calcula subtotal, aplica descuentos condicionales, calcula envíos condicionales, almacena en memoria, persiste en `localStorage` y envía notificaciones por `console.log`. | **SRP (Single Responsibility Principle)** | La clase tiene más de una razón para cambiar: si cambia el formato de persistencia, el canal de notificación o una regla de negocio, hay que editar `PedidoService`. |
| **Lógica condicional rígida para tipos de clientes y envíos** | `if (tipoCliente === 'premium') ...`, `if (tipoEnvio === 'normal') ...`. | **OCP (Open/Closed Principle)** | Para soportar nuevos tipos de descuento o envío (por ejemplo, Cliente Mayorista o Retiro en Local), es necesario abrir y modificar la lógica interna existente de la clase en vez de extenderla. |
| **Acoplamiento directo a dependencias concretas del entorno** | Llamadas directas a `localStorage.setItem(...)` y `console.log(...)` dentro de `registrar()`. | **DIP (Dependency Inversion Principle)** | El servicio depende de implementaciones concretas globales del navegador en lugar de abstracciones o interfaces inyectables, dificultando el testing unitario aislado y la flexibilidad. |

---

## 2. Caracterización con Pruebas Unitarias (Etapa 2)

Antes de alterar una sola línea de código de producción, se convirtió la totalidad de los `test.todo` en pruebas unitarias reales utilizando **Jest** para congelar y proteger el comportamiento del sistema.

### Pruebas Implementadas:
- **`tests/modelos.test.js`:**
  - `Producto conserva su id, nombre y precio`: Verifica asignación de propiedades básicas.
  - `Pedido conserva su cliente y sus productos`: Verifica asociación de cliente y lista de productos.
  - `Pedido comienza con productos vacios cuando se omiten`: Verifica el valor por defecto del arreglo de productos.
  - `dos pedidos creados sin productos no comparten el mismo arreglo`: Garantiza que cada instancia posea su propia referencia de arreglo en memoria.
- **`tests/pedidoService.test.js`:**
  - `cliente normal con envio normal paga subtotal mas 1000` (prueba base de ejemplo).
  - `cliente premium recibe 10% de descuento sobre los productos`.
  - `cliente VIP recibe 20% de descuento sobre los productos`.
  - `envio express agrega 2000`.
  - `el descuento no se aplica al costo de envio` (garantiza el orden de operaciones: subtotal -> descuento -> suma de envío).
  - `combina distintos tipos de cliente y envio` (combinación de VIP + Express).
  - `conserva correctamente un total con decimales` (usando `toBeCloseTo`).
  - `registra el pedido y el total en memoria` (verificación de `this.pedidos`).
  - `conserva dos pedidos registrados con la misma instancia` (acumulación en memoria).
  - `calcula correctamente el total con un solo producto` (caso borde).
  - `calcula correctamente el total con el mismo producto repetido` (caso borde).

**Resultado:** 15 pruebas pasando exitosamente (100% cobertura del comportamiento base).


---

## 3. Extracción de Estrategias de Descuento (Etapa 3 - Paso 1)

### Problema:
`PedidoService.registrar` calculaba los descuentos mediante un bloque `if` anidado sobre `tipoCliente`. Esta lógica violaba:
- **OCP:** Para agregar un nuevo descuento era necesario modificar la clase `PedidoService`.
- **SRP:** `PedidoService` era responsable de conocer las tasas y fórmulas matemáticas de cada categoría de cliente.

### Solución Aplicada:
1. Se extrajo la responsabilidad del cálculo de descuentos a clases independientes bajo el patrón **Strategy**:
   - `src/descuentos/DescuentoNormal.js`: Retorna el subtotal sin descuento (0%).
   - `src/descuentos/DescuentoPremium.js`: Aplica un 10% de descuento (`subtotal * 0.9`).
   - `src/descuentos/DescuentoVIP.js`: Aplica un 20% de descuento (`subtotal * 0.8`).
2. Se definió un contrato polimórfico común: método `aplicar(subtotal)` (**LSP**). Todas las estrategias son sustituibles entre sí sin generar efectos colaterales.
3. Se crearon pruebas unitarias dedicadas en `tests/descuentos.test.js`.
4. `PedidoService` delega la resolución del descuento en la estrategia correspondiente, aceptando tanto cadenas de texto tradicionales (compatibilidad regresiva) como instancias polimórficas directas.


---

## 4. Extracción de Estrategias de Envío (Etapa 3 - Paso 2)

### Problema:
`PedidoService.registrar` fijaba los costos de logística mediante condicionales `if (tipoEnvio === "normal") ...`. Esto presentaba:
- **Violación de OCP:** Para agregar una nueva modalidad de logística (por ejemplo, Retiro en Local) era obligatorio modificar el servicio.
- **Violación de SRP:** El servicio de pedidos se ocupaba de tarifas logísticas en lugar de limitarse a coordinar el flujo del pedido.

### Solución Aplicada:
1. Se extrajo el cálculo de costos de envío a clases dedicadas bajo el patrón **Strategy**:
   - `src/envios/EnvioNormal.js`: Costo de envío estándar de $1.000.
   - `src/envios/EnvioExpress.js`: Costo de envío rápido de $2.000.
2. Contrato polimórfico común: método `calcular(pedido)` (**LSP**). Ambas clases devuelven un valor numérico y son directamente intercambiables.
3. Se agregaron pruebas unitarias en `tests/envios.test.js` y se verificó en `tests/pedidoService.test.js` la posibilidad de inyectar la estrategia directamente.


---

## 5. Desacoplamiento de Persistencia: PedidoRepository (Etapa 3 - Paso 3)

### Problema:
`PedidoService` manipulaba directamente la API global del navegador `localStorage.setItem("pedidos", ...)` y gestionaba la estructura interna de almacenamiento. Esto producía:
- **Violación de SRP:** `PedidoService` cambiaba tanto por lógica de pedidos como por cambios en la tecnología o estrategia de persistencia.
- **Violación de DIP:** El servicio dependía directamente de la implementación concreta de `localStorage`, impidiendo su reemplazo fácil en tests o migraciones hacia APIs remotas.

### Solución Aplicada:
1. Se extrajo la persistencia a la clase `src/repositories/LocalStoragePedidoRepository.js`, con responsabilidades claras:
   - `guardar(registro)`: Persiste en memoria y sincroniza con `localStorage`.
   - `obtenerTodos()`: Devuelve los registros almacenados.
2. Se aplicó **Inyección de Dependencias (DIP):** `PedidoService` ahora recibe el repositorio en su constructor (`constructor({ repository = new LocalStoragePedidoRepository() } = {})`).
3. Se garantizó compatibilidad regresiva mediante un `getter` `pedidos` en `PedidoService` que delega en el repositorio.
4. Se agregaron pruebas dedicadas en `tests/repositorio.test.js` y se verificó en `tests/pedidoService.test.js` la inyección de un repositorio en memoria.
