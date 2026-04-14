# Proceso CI/local para validar y construir páginas

Estado: implementada

Resumen: Scripts para validar la consistencia de miniapps, construir y previsualizar páginas (parte del pipeline de publicación y QA local).

Evidencia:
- [scripts/validate-miniapps.mjs](scripts/validate-miniapps.mjs)
- [scripts/build-pages.mjs](scripts/build-pages.mjs)
- [scripts/preview-pages.mjs](scripts/preview-pages.mjs)

Descripción: Los scripts permiten ejecutar validaciones automáticas y construir/preview las páginas estáticas. `tooling`/`cli` invocan estas tareas tras generar nuevas miniapps.
