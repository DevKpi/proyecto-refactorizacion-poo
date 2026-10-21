# Reglas del Proyecto: Refactorización, SOLID y Testing

Este archivo define las reglas obligatorias para cualquier asistente de IA (Gemini / Antigravity) que trabaje en este repositorio.

---

## 1. Filosofía de Trabajo y SOLID

1. **SOLID no es una lista de verificación ciega:**
   - No dividir clases que ya poseen una responsabilidad clara solo por "demostrar" un principio.
   - Detectar problemas reales de diseño y justificar cada decisión.
   - Los principios trabajan juntos: por ejemplo, separar un `PedidoRepository` otorga **SRP**, inyectarlo en `PedidoService` implementa **DIP**, y permitir nuevas implementaciones sin tocar el servicio habilita **OCP**.
2. **Requisitos de diseño mínimos obligatorios:**
   - **Separación de responsabilidades justificable (SRP):** Desacoplar persistencia (LocalStorage), notificaciones y cálculos complejos del servicio principal.
   - **Extensibilidad mediante polimorfismo (OCP / LSP):** Utilizar patrones como Strategy o polimorfismo para estrategias de descuentos y costos de envío.
   - **Inyección de dependencias (DIP):** Inyectar repositorios, notificadores o estrategias en `PedidoService` desde el exterior (en lugar de instanciarlos internamente).
   - **Incorporación de los 2 nuevos requisitos:**
     1. Descuento para **Cliente Mayorista**.
     2. Opción de **Retiro en Local** para envíos.
   - **Uso estricto de módulos ECMAScript:** `import` / `export`.

---

## 2. Política Estricta de Commits

> ⚠️ **REGLA CRÍTICA:** Está estrictamente prohibido acumular cambios o hacer un único commit de tipo "proyecto terminado". Cada modificación funcional, refactorización o suite de tests debe tener su propio commit individual e incremental.

### Formato de Commits (Conventional Commits)
Usa siempre mensajes claros y en español, respetando los prefijos estándar:
- `test: ...` → Para agregar o modificar pruebas unitarias (ej: `test: agregar pruebas unitarias de cálculo de descuentos`).
- `refactor: ...` → Para reestructurar código existente sin cambiar su comportamiento externo (ej: `refactor: extraer estrategias de cálculo de descuentos`).
- `feat: ...` → Para implementar nuevas características o requisitos (ej: `feat: agregar estrategia de descuento mayorista`).
- `docs: ...` → Para cambios en el README o documentación justificativa (ej: `docs: documentar justificación de patrones SOLID aplicados`).
- `chore: ...` → Para configuración de dependencias, scripts o herramientas.

### Flujo de Trabajo para Cada Cambio
1. **Analizar** el problema antes de modificar código.
2. **Asegurar pruebas:** Verificar que existan tests que cubran el comportamiento antes de tocar el código. Si no existen, crearlos primero (`test: ...`).
3. **Ejecutar tests:** Comprobar que todos los tests pasen (`npm test`).
4. **Implementar/Refactorizar:** Realizar el cambio de manera atómica y enfocada.
5. **Verificar tests nuevamente:** Asegurarse de que sigan pasando al 100%.
6. **Hacer commit inmediato:** Realizar el commit correspondiente a esa unidad de trabajo antes de pasar al siguiente paso.

---

## 3. Estructura de Proyecto Esperada (Orientativa)

```text
src/
├── models/
│   ├── Pedido.js
│   └── Producto.js
├── descuentos/
│   ├── DescuentoNormal.js
│   ├── DescuentoPremium.js
│   ├── DescuentoVIP.js
│   └── DescuentoMayorista.js
├── envios/
│   ├── EnvioNormal.js
│   ├── EnvioExpress.js
│   └── RetiroLocal.js
├── repositories/
│   └── LocalStoragePedidoRepository.js
├── notifications/
│   └── EmailNotificador.js
├── services/
│   └── PedidoService.js
└── main.js

tests/
├── descuentos.test.js
├── envios.test.js
├── modelos.test.js
└── pedidoService.test.js
```

---

## 4. Documentación y Justificación (README y Defensa Oral)

Cada refactorización debe estar lista para responder:
- ¿Qué problema concreto tenía la clase original?
- ¿Por qué se eligió esa solución y qué principios SOLID intervienen?
- ¿Qué tests garantizaron que no se rompiera el comportamiento existente?
