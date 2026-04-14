## Context

`apps/home` actua como la puerta de entrada al repositorio, pero su CSS actual usa valores aislados y una identidad visual generica. A la vez, `tooling/create-miniapp/src/cli.js` genera `src/styles/index.css` con reglas hardcodeadas que propagan esa misma base generica a cada miniapp nueva. El cambio es transversal porque la fuente de verdad de estilo debe servir tanto al `home` actual como al andamiaje futuro, manteniendo la opcion de acentos por app.

## Goals / Non-Goals

**Goals:**
- Traducir los `design_tokens` de PUEDATA a una base de tokens semanticos consumible por CSS del repo.
- Aplicar esa base a `apps/home` en tipografia, color, spacing y radius.
- Hacer que el scaffold genere miniapps nuevas con la misma base, dejando el color tematico de cada app como particularidad opcional.
- Mantener el cambio acotado y compatible con la estructura actual de miniapps.

**Non-Goals:**
- Crear un sistema de theming runtime o cambio dinamico de temas.
- Migrar en este cambio las miniapps existentes fuera de `apps/home`.
- Introducir una libreria nueva de design tokens o CSS-in-JS.

## Decisions

### Decision: usar tokens semanticos CSS, no el YAML crudo, como interfaz de consumo
Los `design_tokens` entregados funcionan como fuente de diseño, pero el repo hoy consume CSS plano. La implementacion debe traducirlos a custom properties con nombres semanticos estables, por ejemplo `--color-text-primary`, `--space-4`, `--radius-md`, `--font-primary`.

La capa de tokens debe mantenerse deliberadamente pequena y dividirse en tres niveles:
- foundation: valores crudos alineados con PUEDATA, como `--font-primary`, `--color-brand-blue-900`, `--color-neutral-100`, `--space-4`, `--radius-md`
- semantic: nombres de uso para la UI, como `--color-bg-page`, `--color-bg-surface`, `--color-text-primary`, `--color-border-subtle`, `--color-accent-primary`
- component aliases: solo para primitives del scaffold cuando simplifiquen estilos repetidos, como `--card-radius`, `--card-padding`, `--button-height-md`, `--input-radius`

La implementacion de `home` y del scaffold debe consumir preferentemente la capa semantica en lugar de referenciar directamente la paleta cruda.

Alternativas consideradas:
- Consumir el YAML directamente en build: agrega tooling innecesario para el alcance actual.
- Copiar hex/radios manualmente en cada archivo: rompe consistencia y no resuelve el scaffold.

### Decision: separar identidad base de acentos por miniapp
La base compartida debe cubrir tipografia, neutros, superficies, spacing, radius y estados comunes. El color distintivo de una miniapp puede seguir viniendo de su configuracion o de variables locales, siempre encima de esa base comun.

Alternativas consideradas:
- Forzar una unica paleta identica para todas las apps: simplifica, pero elimina particularidades que el usuario quiere conservar.
- Mantener todo por app sin base comun: perpetua la fragmentacion visual actual.

### Decision: fijar defaults PUEDATA para `themeColor` y `backgroundColor`
El scaffold y la app `home` deben dejar de usar defaults genericos para estos campos y pasar a valores alineados con PUEDATA. Para este cambio, `themeColor` debe tomar como default el azul principal de marca `#004F87` y `backgroundColor` debe tomar como default `#FFFFFF` como fondo base del manifest y de arranque.

Rationale:
- `themeColor` participa en meta tags y `manifest.theme_color`, por lo que debe representar la marca base cuando una miniapp aun no define un acento propio.
- `backgroundColor` impacta `manifest.background_color` y debe mantenerse neutro y estable para no forzar un tono editorial en todas las apps nuevas.
- La base visual de PUEDATA puede usar `background.soft` dentro del CSS, pero eso no obliga a que el color por defecto del manifest deje de ser blanco.

Alternativas consideradas:
- Usar `#0A5B95` como default de `themeColor`: valido, pero menos canonical que el azul principal.
- Usar `#F7F7F5` como default de `backgroundColor`: acerca el manifest al fondo suave de interfaz, pero hace mas opinionado el arranque de miniapps que aun no definieron su superficie principal.

### Decision: separar el fondo visual de `home` del fondo del manifest
La UI de `apps/home` debe usar `background.soft` (`#F7F7F5`) como fondo visual de pagina para expresar la identidad PUEDATA en runtime, mientras `backgroundColor` del manifest y del arranque PWA debe permanecer en `#FFFFFF`.

Rationale:
- El fondo visual de pagina y el fondo del manifest resuelven problemas distintos.
- `#F7F7F5` aporta una superficie de producto mas editorial para `home` sin volver opinionado el arranque del resto de miniapps.
- `#FFFFFF` como `backgroundColor` mantiene neutralidad en splash, install prompt y arranque PWA.

Alternativas consideradas:
- Igualar CSS y manifest a `#FFFFFF`: consistente, pero desaprovecha el token `background.soft` en el entrypoint principal.
- Igualar CSS y manifest a `#F7F7F5`: visualmente coherente, pero demasiado especifico como baseline de metadata para todas las miniapps nuevas.

### Decision: `apps/home` sera la implementacion de referencia
`home` es el mejor lugar para validar la traduccion de PUEDATA porque ya expone tarjetas, grilla, tipografia y contenedor sin la complejidad operativa de otras apps. Una vez asentada la base, el scaffold debe reflejar esa misma direccion.

Alternativas consideradas:
- Empezar por todas las apps: aumenta alcance y riesgo.
- Empezar solo por el scaffold: deja el entrypoint del producto sin evidencia visible del sistema.

### Decision: el scaffold debe emitir una hoja de estilos base y predecible
El template de `create-miniapp` debe dejar de hardcodear estilos ad hoc y pasar a una plantilla de estilo base alineada con PUEDATA. Esa plantilla puede incluir variables raiz y componentes primitivos (`.app-shell`, `.card`, `button`, `input`, `textarea`) consistentes con el sistema.

Alternativas consideradas:
- Generar estilos minimos y pedir personalizacion manual posterior: no garantiza la identidad base en apps nuevas.

## Risks / Trade-offs

- [La traduccion literal de tokens puede verse demasiado corporativa en una miniapp concreta] -> Mantener una capa base comun y reservar acentos/local overrides para cada app.
- [Una nomenclatura de tokens demasiado amplia puede sobredisenar el scaffold] -> Limitar la primera iteracion a tokens usados por `home` y las primitives generadas.
- [Fonts nuevas pueden requerir carga externa o fallback cuidadoso] -> Definir fallbacks aceptables y evitar que el cambio dependa de una sola fuente remota.
- [El scaffold puede quedar acoplado a una plantilla demasiado rigida] -> Limitar la base a primitives y variables, no a layouts de producto.
- [Cambios visuales en `home` pueden requerir pequenos ajustes de marcado] -> Priorizar que la propuesta permita esos ajustes solo si son necesarios para expresar los tokens.

## Migration Plan

1. Definir la capa de tokens semanticos PUEDATA para el alcance del repo.
2. Aplicar esa capa en `apps/home` como referencia visual inicial, usando `background.soft` para la pagina y `background.default` para superficies.
3. Actualizar la plantilla CSS generada por `tooling/create-miniapp` para heredar la misma base.
4. Actualizar los defaults de `themeColor` y `backgroundColor` en el scaffold y en `home` para reflejar la base PUEDATA.
5. Verificar que las miniapps nuevas sigan pudiendo usar su propio color/acento encima de la identidad base.

Rollback: revertir los cambios en `apps/home` y en la plantilla del scaffold restablece el comportamiento previo sin migraciones de datos.

## Open Questions

- Si la tipografia PUEDATA debe cargarse desde Google Fonts, assets locales o solo con fallbacks del sistema.
- Si conviene extraer una hoja compartida reutilizable mas adelante o mantener la duplicacion controlada entre `home` y scaffold en esta primera fase.
