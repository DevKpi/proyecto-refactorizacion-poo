---
name: solid-refactor-workflow
description: >-
  Guía paso a paso para ejecutar el flujo de refactorización orientada a objetos (SOLID),
  diseño de pruebas con Jest y gestión de commits atómicos en el proyecto de refactorización.
  Usar siempre que se implementen refactorizaciones, se agreguen pruebas unitarias o se
  realicen cambios de código que requieran commits incrementales.
---

# Workflow de Refactorización SOLID y Commits Incrementales

Este workflow establece el procedimiento metódico para refactorizar el sistema de pedidos siguiendo los principios SOLID, manteniendo una alta cobertura de pruebas y asegurando un historial de Git limpio y granular.

---

## 1. Regla de Oro: Commits Atómicos e Incrementales

**Nunca generar un commit masivo con múltiples refactorizaciones juntas.**
Cada cambio conceptual debe quedar registrado en su propio commit individual, garantizando que el proyecto compile y que los tests pasen (`npm test`) en cada paso.

### Formato de Commits (Conventional Commits)
- `test: agregar pruebas de ...`
- `refactor: desacoplar / extraer ...`
- `feat: implementar nuevo requisito ...`
- `docs: actualizar justificación técnica en README`
- `chore: configuración o mantenimiento`

---

## 2. Ciclo de Trabajo por Tarea (TDD / Refactoring Loop)

Para cada refactorización o cambio:

### Paso 1: Caracterización y Pruebas Previas
- Antes de modificar una clase existente, revisar o redactar pruebas que validen su comportamiento actual.
- Ejecutar `npm test`.
- Si se agregaron nuevas pruebas preliminares, commitear:
  ```bash
  git add tests/...
  git commit -m "test: agregar pruebas previas para <modulo>"
  ```

### Paso 2: Refactorización Atómica (SOLID)
- Aplicar una única refactorización concreta (por ejemplo, extraer cálculo de descuentos a clases polimórficas).
- Mantener la compatibilidad o actualizar la llamada en el servicio.
- Ejecutar `npm test` para asegurar que nada se rompió.
- Commitear inmediatamente:
  ```bash
  git add src/... tests/...
  git commit -m "refactor: extraer estrategias de <responsabilidad>"
  ```

### Paso 3: Incorporación de Nuevos Requisitos
- Al agregar nuevos comportamientos (ej. Descuento Mayorista o Retiro en Local):
  1. Escribir primero el test unitario para la nueva clase/estrategia.
  2. Implementar la nueva clase.
  3. Ejecutar `npm test`.
  4. Commitear:
     ```bash
     git add src/... tests/...
     git commit -m "feat: agregar soporte para <nuevo_requisito>"
     ```

### Paso 4: Inyección de Dependencias (DIP)
- Sustituir dependencias hardcodeadas en `PedidoService` (como persistencia en `localStorage` o envíos de notificaciones) permitiendo que sean inyectadas en el constructor.
- Adaptar las pruebas usando mocks o instancias de prueba para validar que la inyección funcione correctamente.
- Commitear:
  ```bash
  git add src/... tests/...
  git commit -m "refactor: inyectar <dependencia> en PedidoService"
  ```

---

## 3. Justificación de Principios SOLID

Al realizar cambios, tener presente la justificación técnica para el README y la defensa oral:
- **SRP (Single Responsibility):** Cada clase tiene una sola razón para cambiar (cálculo, persistencia, notificación, coordinación).
- **OCP (Open/Closed):** Nuevos tipos de descuento o envío se agregan creando nuevas clases sin modificar el código existente.
- **LSP (Liskov Substitution):** Cualquier estrategia de descuento o envío es intercambiable sin romper la ejecución de `PedidoService`.
- **ISP (Interface Segregation):** Las interfaces o contratos expuestos son pequeños y específicos para lo que cada cliente necesita.
- **DIP (Dependency Inversion):** `PedidoService` depende de abstracciones/contratos de repositorio o notificador, no de implementaciones concretas como `localStorage` o `console.log`.
