# Hook `useLocalStorage` y persistencia local

Estado: implementada

Resumen: Hook reutilizable para persistencia en `localStorage` y plantilla de uso en miniapps generadas.

Evidencia:
- [tooling/create-miniapp/src/cli.js](tooling/create-miniapp/src/cli.js) (escribe `src/hooks/useLocalStorage.ts` durante la generación)

Descripción: El CLI escribe una implementación tipada del hook en el esqueleto de la miniapp, definiendo la convención de persistencia local por defecto.
