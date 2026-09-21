# Yellow Day · Para Danna

Web estática terminada para el 21 de septiembre de 2026. HTML, CSS y JavaScript, sin backend, frameworks, compilación, analítica, cookies ni dependencias externas en tiempo de ejecución.

## Abrir y probar

Abre `index.html` en un navegador moderno. Funciona directamente desde el disco; no necesitas instalar nada. Conserva las carpetas `css`, `js` y `assets` junto al archivo.

La experiencia presenta **una escena a la vez**. Abre la primera flor y pulsa el mismo botón para continuar. Los tracks se desbloquean uno a uno. Completar el jardín con cinco flores habilita el paso al ramo final; abrirlo habilita el mensaje. El control «Volver» permite revisar escenas anteriores conservando sus estados. Recargar inicia una experiencia nueva.

El reproductor reproduce los seis MP3 locales incluidos en `assets/audio/`. Incluye play/pausa, anterior/siguiente, duración real y una barra para avanzar por la canción. Al terminar pasa a la siguiente. Solo se carga la canción seleccionada; el audio se pausa al salir de la escena musical o al ocultar la pestaña. No es necesario reproducirlo para continuar. Sin JavaScript, el contenido se presenta como lectura continua y se avisa de que las interacciones requieren activarlo.

## Publicar en GitHub Pages

1. Crea un repositorio y sube **el contenido de esta carpeta** a su raíz. `index.html` debe quedar en la raíz del repositorio, no dentro de otra carpeta `yellow-day`.
2. En el repositorio, abre **Settings → Pages**.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. Selecciona la rama que contenga los archivos (normalmente `main`) y la carpeta **/(root)**. Pulsa **Save**.
5. Espera a que GitHub complete la publicación. Pages mostrará el enlace que puedes enviar.

Las rutas de CSS, JavaScript y fotografía son relativas para funcionar también en páginas de proyecto (`usuario.github.io/repositorio/`). `.nojekyll` evita procesamientos innecesarios.

Referencia: [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Archivos

```text
index.html
css/styles.css
js/script.js
assets/images/one-direction.webp
assets/images/sporting-cristal.webp
assets/audio/ (seis canciones MP3)
assets/CREDITS.md
.nojekyll
README.md
```

## Imágenes y accesibilidad

- Una sola fotografía de One Direction, descargada y optimizada a WebP (720 × 378; aproximadamente 45 KB), con dimensiones, carga diferida y crédito visible. No hay hotlinking.
- Los créditos y la licencia de la fotografía están en `assets/CREDITS.md`.
- Las flores son ilustraciones SVG originales que permiten animar tallos, hojas y pétalos por separado; no se usan retratos generados.
- Sporting Cristal aparece con el **escudo obtenido de la web oficial del club**, guardado localmente en WebP sin alterar sus colores ni su forma. Se mantiene como un detalle pequeño dentro de su tarjeta.
- No contiene fotos de Danna, Samuel ni personas de su entorno.
- Incluye foco visible, controles por teclado, enlace para ir al contenido de la escena actual, estados anunciados a lectores de pantalla y compatibilidad con `prefers-reduced-motion`. Al avanzar o volver, el foco pasa al título de la nueva escena; las escenas ocultas no entran en la navegación por teclado.

## Verificación

Comprobada la reproducción de los seis MP3 en Chrome, la pausa, el avance por la canción, el cambio de pistas y el paso automático a la siguiente. El recorrido progresivo conserva los cambios de diseño anteriores. No se ha probado esta versión en un iPhone físico ni en Safari.

El paquete está listo para publicar; no se ha creado un repositorio ni realizado una publicación externa.
