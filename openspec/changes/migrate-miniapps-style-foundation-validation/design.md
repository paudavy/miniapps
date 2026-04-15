## Context

El repositorio tiene una base de identidad compartida (`styles/base.css`) y un scaffold que ya crea `src/styles/index.css` con import a base y tokens semánticos locales. Sin embargo, el estado de apps es heterogéneo: `home` está alineada, `focus-timer` y `notes` siguen con estilos locales hardcodeados, y `planning-board` mezcla una capa de tokens `--board-*` con componentes que consumen `--color-*`/`--spacing-*` sin un contrato explícito en source.

Esta disparidad impide mantener una identidad coherente y vuelve frágil la evolución del andamiaje.

## Goals / Non-Goals

**Goals:**
- Consolidar un contrato único: base compartida + capa local por miniapp.
- Definir una estrategia de migración por app con riesgo controlado.
- Incorporar validaciones automáticas de estilo y reporte de cumplimiento por app.
- Alinear scaffold y validaciones para que las apps nuevas nazcan conformes.

**Non-Goals:**
- Redefinir la marca o tokens de identidad de `base.css`.
- Forzar una migración “big bang” de `planning-board`.
- Cambiar stack tecnológico de estilos.

## Decisions

### D1. Mantener `base.css` como única fuente de identidad compartida
- Rationale: ya existe, está adoptada por scaffold/home y cubre tipografía, color base, spacing, radios y primitivas.
- Alternative considered: mover identidad a tokens por app; descartado por duplicación y deriva visual.

### D2. Estrategia por app
- `home`: mantener patrón actual; solo endurecer verificaciones.
- `focus-timer` y `notes`: migración directa a patrón scaffold (import base + capa semántica local + overrides mínimos).
- `planning-board`: estrategia híbrida en dos fases.
  - Fase A (estabilización): capa de alias local explícita entre `--board-*` y vocabulario de componentes vigente.
  - Fase B (deuda): migrar componentes progresivamente a vocabulario final y retirar alias.
- Rationale: minimiza riesgo visual y permite entregas incrementales.

Evaluación explícita de ajuste de componentes por app:

| App | ¿Ajuste de componentes requerido? | Motivo |
|---|---|---|
| `home` | No | Ya consume base + capa semántica local y su estructura de clases es compatible con el scaffold actual. |
| `focus-timer` | No (por defecto) | La brecha principal está en stylesheet entrypoint; sólo ajustar componentes si persisten reglas inline o patrones que bloqueen tokens semánticos. |
| `notes` | No (por defecto) | Igual que `focus-timer`: migración centrada en capa de estilos; componentes se tocan sólo si impiden el contrato semántico. |
| `planning-board` | Sí | Sus componentes CSS consumen un vocabulario de tokens distinto del definido en su capa fuente; requiere migración por lotes para converger. |

### D3. Validación repo-wide de contrato de estilos
Agregar checks en validación para:
- presencia de import de `styles/base.css` en `apps/*/src/styles/index.css`;
- existencia de capa semántica local mínima generada por scaffold;
- detección de custom properties usadas sin definición/fallback dentro del dominio de la app;
- reporte por app con severidad y sugerencias.

### D4. Ajuste de scaffold para hacer explícita la frontera base/local
El archivo generado de estilos debe incluir estructura comentada y bloques separados para:
- tokens heredados del sistema base;
- tokens semánticos de app;
- acento específico de app.

## Risks / Trade-offs

- [Riesgo] Falsos positivos en validación de custom properties por variables dinámicas o definidas en cascada.
  → Mitigación: permitir lista de excepciones documentada y soporte de fallbacks `var(--x, y)`.

- [Riesgo] Alias prolongados en `planning-board` generan deuda permanente.
  → Mitigación: tareas explícitas de retirada de alias con criterio de salida por componente.

- [Trade-off] Validaciones más estrictas pueden fallar CI inicialmente.
  → Mitigación: rollout en fases (warning -> error) con ventana de migración.

## Migration Plan

1. Introducir reglas de validación en modo advertencia y reporte por app.
2. Migrar `focus-timer` y `notes` al contrato scaffold.
3. Introducir alias explícitos en `planning-board` para estabilizar render.
4. Migrar componentes de `planning-board` por lotes (toolbar/topbar/paneles/popovers/etc.) y retirar alias.
5. Elevar validaciones a error en CI cuando todas las apps estén conformes.

Criterio de salida por app:
- Cada app debe quedar en estado "compliant" en el reporte de validación de estilos.
- El campo "component-adjustment-needed" debe ser `false` para `home`, `focus-timer` y `notes`, y evolucionar a `false` en `planning-board` al retirar la capa de alias.

Rollback:
- mantener feature flag de severidad de validación (warning-only);
- revertir alias o bloque de migración por componente sin tocar base identity.

## Open Questions

- ¿La validación de custom properties debe ejecutarse solo en `src` o también sobre output de build para detectar divergencias?
- ¿Se requiere baseline visual automática (capturas) para endurecer cambios en `planning-board`?
- ¿Qué umbral temporal se define para retirar alias tras estabilización?
