# Tu camino a Qiskit Advocate

Presentación educativa en español, con 17 diapositivas, basada en el material del Qiskit advocate program.

[**Ver la presentación en GitHub Pages**](https://brun3y.github.io/qiskit-advocate-program/)

Abre **index.html** con un navegador. Es un archivo autónomo: imágenes, códigos QR, fuentes, estilos y lógica están integrados. Puedes copiar o enviar únicamente ese archivo. Los enlaces a servicios oficiales necesitan conexión a internet.

## Contenido

- Requisitos y credenciales de ingreso, con tres imágenes oficiales de insignias de IBM / Credly.
- Preparación de la solicitud y código QR del formulario oficial.
- Tiers Blue, Purple, Magenta y Onyx; requisitos, beneficios y mantenimiento.
- Las 16 actividades de la tabla de puntos, agrupadas por valor.
- Cómo reclamar puntos y consultar el tablero.
- Simulador para planear los 15 puntos de Tier 1.
- Diagrama original proporcionado, fuentes y notas de actualización.

## Controles

| Acción | Control |
| --- | --- |
| Anterior / siguiente | Flechas izquierda y derecha, Page Up / Page Down o botones inferiores |
| Primera / última | Home / End |
| Índice | Botón Índice o tecla O |
| Pantalla completa | Botón Presentar o tecla F |
| Cerrar un diálogo | Escape |

En un móvil, desplaza verticalmente el contenido de cada diapositiva; la navegación permanece abajo.

## Editar

Edita `presentation.html`, `styles.css` o `presentation.js` y ejecuta:

```sh
python3 build.py
```

El compilador usa exclusivamente la biblioteca estándar de Python y regenera `index.html` incorporando los archivos de `assets/`. No hay dependencias de JavaScript ni servicios externos para visualizar la presentación.

Para una vista previa mediante HTTP, opcionalmente:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8765`.

## Fuentes y alcance

Consulta [SOURCES.md](SOURCES.md). Los datos de ingreso se verificaron en el formulario oficial el 8 de noviembre de 2026. Las reglas de puntos y tiers proceden de una copia local de la biblioteca del programa.

Imágenes y marcas: IBM / Qiskit / Credly. Tipografía: IBM Plex Sans, distribuida con su licencia en `assets/OFL.txt`. Esta adaptación educativa no sustituye la documentación oficial.

## Publicación

Cada cambio en `main` compila la presentación y la publica automáticamente en GitHub Pages. El sitio publicado contiene el HTML autónomo generado.
