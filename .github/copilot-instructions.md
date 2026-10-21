# Instrucciones del Proyecto para GitHub Copilot

Este proyecto es un trabajo práctico académico sobre **Refactorización, Principios SOLID y Testing** en JavaScript (Node.js con módulos ES y Jest).

---

## 1. Regla Principal: Commits Atómicos e Incrementales

> ⚠️ **NO generar soluciones completas en un solo bloque ni sugerir un único commit.**
> Cada cambio funcional, refactorización o test debe realizarse y commitearse de manera individual e incremental.

Al sugerir o realizar cambios, respeta y recuerda siempre la convención de commits (Conventional Commits):
- `test: agregar pruebas unitarias de <funcionalidad>`
- `refactor: extraer <responsabilidad> a clase polimórfica`
- `feat: agregar nueva estrategia de <descuento/envío>`
- `docs: actualizar documentación o justificación en README`
- `chore: actualización de dependencias o scripts`

---

## 2. Metodología de Trabajo y Testing

1. **Antes de modificar código:**
   - Asegurar que existan tests unitarios con Jest que cubran el comportamiento actual.
   - Si no existen o son insuficientes, escribir los tests primero (`test: ...`).
   - Ejecutar y verificar que los tests pasen (`npm test`).
2. **Durante la refactorización:**
   - Hacer cambios pequeños, atómicos y progresivos.
   - Mantener los tests ejecutándose en verde (`npm test`).
   - Tras cada refactorización exitosa, indicar el commit correspondiente (`refactor: ...`).
3. **Nuevos requisitos a incorporar:**
   - Descuento para **Cliente Mayorista**.
   - Opción de **Retiro en Local** para el cálculo de envío.
   - Desarrollar cada uno con su respectivo test unitario y commit (`feat: ...`).

---

## 3. Criterios de Diseño SOLID

- **SOLID no es un checklist mecánico:** No inventar clases innecesarias si una clase ya tiene una responsabilidad clara. Justificar los cambios con problemas reales.
- **SRP (Single Responsibility):** Desacoplar persistencia (LocalStorage), notificaciones por correo/mensaje y algoritmos de cálculo fuera de `PedidoService`.
- **OCP / LSP (Open/Closed & Liskov Substitution):** Implementar estrategias polimórficas (patrón Strategy) para descuentos y envíos, permitiendo agregar nuevos tipos sin modificar las clases consumidoras.
- **DIP (Dependency Inversion):** Inyectar repositorios, notificadores y estrategias en `PedidoService` a través de su constructor en vez de instanciarlos internamente.

---

## 4. Guía de Estilo de Código

- Utilizar **ES Modules** estrictamente (`import` / `export`), sin `require` de CommonJS.
- Mantener nombres claros en español acordes al dominio (`Pedido`, `Producto`, `DescuentoMayorista`, `EnvioExpress`, etc.).
- Cada clase o estrategia en su propio archivo dentro de `src/`.
- No alterar comentarios o código no relacionado con la tarea en curso.
