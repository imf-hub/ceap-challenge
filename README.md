# CEAP Challenge IMF

Juego educativo del Instituto Mexicano de Flebología para practicar CEAP 2020.

**Jugar:** https://imf-hub.github.io/ceap-challenge/

La versión inicial reúne 62 fotografías reales y 82 retos en siete capítulos. Incluye comparación de imágenes, historias por capas, construcción de CEAP, rondas adaptativas, repaso de errores, reto diario y progreso local. No requiere cuentas ni envía resultados a un servidor.

## Ejecutar

Es una aplicación estática. Puede abrirse `index.html` directamente en un navegador; para probar la descarga sin conexión y las funciones del navegador que requieren HTTPS, usar un servidor local o GitHub Pages.

```text
python -m http.server 8767 --bind 127.0.0.1
```

No requiere instalación de bibliotecas. Verificación funcional:

```text
node tests/functional.test.cjs
```

## Fotografías y etiquetas

- **TRICVI–C, versión 2:** 57 fotografías, una por voluntario; Ruiz, Gomez-Gil y Renero, Mendeley Data, DOI `10.17632/rf5m97cmm3.2`, CC BY 4.0. Clase C contrastada entre tabla y carpeta de origen. Distribución: C0=21, C1=3, C2=12, C3=15, C4=4, C5=1, C6=1.
- **Lessiani et al. (2024):** figura de corona flebectásica, DOI `10.3390/medicina60040618`, CC BY 4.0.
- **Emmert et al. (2021):** tres figuras clínicas, DOI `10.3390/ijms22179199`, CC BY 4.0. La figura de úlcera venosa con corona muestra dos vistas del mismo caso, no dos pacientes.
- **Fallahzadeh et al. (2010):** fotografía de lipodermatoesclerosis extraída del PDF con recorte documentado; DOI `10.1100/tsw.2010.60`, CC BY; el registro NCBI enlaza CC BY 3.0.

Cada fotografía conserva autoría, licencia, URL, archivo original y modificaciones en `media-manifest.json`. La aplicación también presenta los créditos en las imágenes y en «Fuentes y licencias».

La selección de TRICVI excluye dos carpetas que carecen de registro en la tabla clínica y doce voluntarios por oscuridad, oclusión o escaso detalle. Las imágenes WebP no se ampliaron, recortaron ni retocaron y no transfieren metadatos EXIF. La fuente original suele tener resolución 640 × 480; no se ha añadido detalle artificial.

## Alcance clínico

La selección verifica procedencia, licencia y consistencia de etiquetas. **No representa una reclasificación clínica independiente ni validación del desempeño del juego.**

TRICVI etiqueta al voluntario, sin lateralidad; C4 no está subdividida. No hay síntomas, recurrencia, E/A/P ni dúplex individual. Su protocolo exige consentimiento y anonimización; no se publican formularios individuales firmados. No se exportan datos demográficos. Los fondos de adquisición varían entre grupos y pueden introducir pistas no clínicas. Solo hay una persona elegible C5 y una C6 en ese depósito.

En las publicaciones se distinguen hallazgos C4 adicionales de la clase básica de la extremidad. Las historias, entrevistas e informes añadidos por el juego son **escenarios didácticos simulados**, rotulados en cada caso y no atribuidos al paciente fotografiado. La recurrencia y los componentes no visuales no se deducen de una fotografía.

Marco normativo: Lurie et al. (2020), *The 2020 update of the CEAP classification system and reporting standards*, DOI `10.1016/j.jvsv.2019.12.075`.

Los puntos, porcentajes y capítulos explorados son datos de práctica; no acreditan competencia ni constituyen una certificación.

## Mantenimiento

- `photos.js` / `media-manifest.json`: procedencia de medios.
- `lessons.js` / `clinical-bank.js`: ejercicios y mapeo de etiquetas.
- `engine-base.js` / `experience.js`: juego, selección, puntuación y almacenamiento.
- `studio-experience.js`: interfaz de práctica y movimiento de las tarjetas.
- `styles.css` / `clinical.css` / `studio.css`: presentación adaptable.
- `sw.js`: archivos para funcionamiento sin conexión tras la primera carga correcta.

La rama `main`, carpeta raíz, es la fuente de publicación de GitHub Pages. Al actualizar archivos, cambiar la versión de caché de `sw.js` para que se distribuyan las nuevas copias.

## Diseño de la experiencia

La interfaz combina dos fuentes de Motion Sites consultadas mediante el acceso autorizado del usuario en Imperio Agéntico:

- **Fitness Dashboard:** estructura de aplicación con navegación lateral, base cian, superficies blancas, azul y acentos lima. Los indicadores muestran exclusivamente datos locales de práctica.
- **Bite-Sized Courses:** tres tarjetas persistentes con profundidad, salida animada, promoción de la siguiente y reciclado. Incluye controles explícitos, teclado y gesto horizontal; la reducción de movimiento utiliza cambio inmediato.

La adaptación conserva el contenido y el motor clínico existentes. En móvil, la navegación se coloca abajo; durante la ronda se utiliza una superficie de juego con fotografía completa y una guía accesible sin perder las respuestas. Las fotografías no reciben tintes, recortes ni filtros de la interfaz.

Los archivos activos de esta interfaz son `studio.css` y `studio-experience.js`. Las primeras adaptaciones `motion.css` y `motion-experience.js` se conservan en el historial del proyecto, pero no se cargan en la versión actual.

No se importan las métricas, perfiles o recursos decorativos de ejemplo del catálogo. Los prompts completos de la biblioteca licenciada no se redistribuyen en este repositorio. La adaptación no es una reproducción literal de los datos ni del marco fijo de teléfono de la referencia.

## Licencias

El código del proyecto se distribuye bajo MIT, con las exclusiones de `LICENSE`. Las fotografías y figuras **no** se relicencian bajo MIT: conservan las licencias y atribuciones de sus respectivas fuentes. Las referencias médicas se citan, sin reproducir sus artículos completos.
