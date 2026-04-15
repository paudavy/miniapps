## Context

El repositorio ya soporta intención PWA mediante `app.config.json` y el scaffold condicional de assets/dependencias. Sin embargo, la capa UI de instalación no está estandarizada en la plantilla generada y aparece implementada de forma específica en una miniapp existente. El cambio requiere tocar generación de archivos de plantilla, flujo de inicialización de app y pruebas del generador.

## Goals / Non-Goals

**Goals:**
- Estandarizar en el scaffold una experiencia de instalación PWA reutilizable.
- Ubicar el punto de render en AppShell para consistencia entre miniapps.
- Mantener salida limpia para apps con `pwa: false`.
- Dejar cobertura de pruebas para ambos caminos (PWA y no-PWA).

**Non-Goals:**
- Rediseñar visual completo de AppShell.
- Introducir nuevas dependencias para el botón de instalación.
- Modificar miniapps existentes como requisito para aceptar el cambio.

## Decisions

1. Generar componentes/estado de instalación solo para PWA.
- Rationale: respeta el contrato actual de huella mínima en apps no-PWA.
- Alternativa considerada: generar siempre y ocultar en runtime. Se descarta por añadir código muerto en no-PWA.

2. Renderizar el botón en AppShell y no en barras específicas de feature.
- Rationale: AppShell es el contenedor común de plantilla y evita duplicación por feature.
- Alternativa considerada: render en TopBar de cada app. Se descarta por no ser universal.

3. Mantener el acoplamiento a eventos web estándar (`beforeinstallprompt`, `appinstalled`).
- Rationale: mantiene compatibilidad con implementación existente y evita dependencias.
- Alternativa considerada: abstracción con librería externa. Se descarta por complejidad innecesaria.

4. Validar por pruebas del scaffold generando dos apps (PWA y no-PWA).
- Rationale: el comportamiento es de generación de archivos; la verificación más robusta es por contenido generado.
- Alternativa considerada: sólo validación manual. Se descarta por riesgo de regresión.

5. Mantener un CTA fijo en inglés (`Install App`) en la plantilla base.
- Rationale: la plantilla del scaffold debe mantenerse genérica y alineada con la implementación de referencia ya existente en planning-board.
- Alternativa considerada: hacer el texto configurable por scaffold o traducirlo por defecto. Se descarta en este cambio para evitar ampliar el contrato de entrada del CLI.

## Risks / Trade-offs

- [Riesgo] Variaciones de soporte del evento de instalación entre navegadores pueden ocultar el botón incluso en PWA. → Mitigación: diseño fail-safe, botón no se muestra si no hay prompt.
- [Riesgo] Incremento de complejidad en la plantilla base del scaffold. → Mitigación: separar utilidades de instalación en módulo dedicado y pequeño.
- [Trade-off] AppShell asume una acción de producto (instalar), no sólo layout. → Mitigación: habilitarlo únicamente en la variante PWA para mantener coherencia semántica.

## Migration Plan

- No requiere migración de datos.
- Rollout: aplicar cambio en scaffold y pruebas; nuevas miniapps ya salen con el comportamiento.
- Rollback: revertir cambios en scaffold y tests; no afecta contratos persistentes ni exige tocar apps existentes.

## Open Questions

- ¿Se quiere un estilo visual compartido global para el botón en todas las miniapps o estilo local por app?
