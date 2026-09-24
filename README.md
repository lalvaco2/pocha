# La Pocha — Marcador

Aplicación web instalable para llevar la puntuación de la Pocha (3 a 6 jugadores, baraja
española de 40 cartas). Funciona sin conexión y guarda los datos en el propio dispositivo.
Sin dependencias, sin paso de compilación, sin servidor: son archivos estáticos.

---

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo, por ejemplo `pocha`. Puede ser público o privado
   (con Pages en repositorio privado necesitas plan de pago).
2. Sube todo el contenido de esta carpeta **a la raíz del repositorio**, no dentro de
   una subcarpeta. El archivo `index.html` tiene que quedar en la raíz.
3. En el repositorio: **Settings → Pages**. En *Source* elige `Deploy from a branch`,
   rama `main` y carpeta `/ (root)`. Guarda.
4. En un minuto tendrás la app en `https://TU-USUARIO.github.io/pocha/`.

Por línea de órdenes:

```bash
cd pocha-app
git init -b main
git add .
git commit -m "Marcador de la Pocha"
git remote add origin git@github.com:TU-USUARIO/pocha.git
git push -u origin main
```

Todas las rutas son relativas, así que funciona igual en `usuario.github.io/pocha/`
que en un dominio propio o en una subcarpeta.

### Dominio propio (opcional)

Crea un archivo `CNAME` en la raíz con el dominio (`pocha.tudominio.com`), apunta un
registro CNAME en tu DNS a `TU-USUARIO.github.io` y actívalo en Settings → Pages.

---

## Instalarla en el móvil

- **iPhone / iPad**: abrir en Safari → *Compartir* → *Añadir a pantalla de inicio*.
- **Android**: Chrome ofrece *Instalar* solo; también desde el menú → *Añadir a
  pantalla de inicio*.

**Esto no es cosmético.** Safari borra todo el almacenamiento de un sitio web tras
siete días sin interacción, y eso incluiría el histórico entero. Las aplicaciones
añadidas a la pantalla de inicio llevan su propio contador de uso y quedan fuera de ese
barrido. Usada desde el navegador, la app pierde los datos; instalada, no. La app avisa
de esto en el iPhone mientras no esté instalada.

Aun instalada, el almacenamiento del navegador no es un archivo permanente: si el
dispositivo se queda sin espacio, o se borran datos de Safari, puede desaparecer. Por eso
hay **Guardar copia** y **Restaurar** en la pantalla de inicio, que exportan e importan
todo el histórico en un archivo JSON. Es también la forma de pasar el histórico de un
móvil a otro mientras no haya servidor.

---

## Actualizar la app

El *service worker* cachea los archivos para que arranque sin conexión. Si subes cambios
y no tocas nada más, los móviles que ya la tengan instalada **seguirán viendo la versión
vieja**.

> Cada vez que despliegues un cambio, sube el número de `VERSION` en `sw.js`
> (`pocha-v1` → `pocha-v2`, etc.).

Eso invalida la caché antigua y todos recogen la versión nueva al abrirla.

---

## Estructura

```
index.html              la app entera (interfaz, reglas, puntuación, pullas)
manifest.webmanifest    nombre, iconos y modo de pantalla completa
sw.js                   caché para funcionar sin conexión  ← subir VERSION al desplegar
fonts.css + fonts/      Bevan e Inter alojadas aquí, sin llamadas a Google
icons/                  iconos de la app (192, 512, maskable, apple-touch)
.nojekyll               evita que GitHub Pages procese los archivos con Jekyll
```

---

## Reglas implementadas

- **Rondas**: de 1 carta hasta el máximo repartible (40 ÷ jugadores → 13, 10, 8 o 6),
  la mano grande se juega tantas veces como jugadores haya, y luego se baja hasta 1.
  Hay modo corto que termina en la primera mano grande.
- **Apuestas**: en orden real de anuncio, empezando por el de la derecha del repartidor.
  El repartidor cierra y no puede cantar el número que cuadraría la suma con las bazas
  en juego, de modo que siempre falla alguien.
- **Puntuación**: acertar da 10 puntos más 3 por cada baza apostada; fallar resta 3.
  Ambas cifras y el modo de penalización (fija o por baza de diferencia) son
  configurables al crear la partida.
- **Control de errores**: no se puede cerrar una mano si las bazas ganadas no suman
  exactamente el número de cartas repartidas.
- **Registro por mano**: cartas, palo que pinta, quién reparte, quién sale, apuestas,
  bazas y puntos. De ahí salen las estadísticas por palo y por posición en la mesa.

---

## Si algún día va a las tiendas

El camino natural desde aquí es empaquetarla con [Capacitor](https://capacitorjs.com),
que envuelve estos mismos archivos en un proyecto de Xcode y otro de Android Studio.
Dos avisos antes de meterse:

- Apple rechaza bajo la directriz 4.2 lo que considera una web reempaquetada. Esta app
  parte bien (va empaquetada y funciona sin conexión), pero conviene reforzarla con
  funciones nativas de verdad antes de enviarla.
- Requiere cuenta de desarrollador de Apple (99 USD al año, renovación obligatoria) y de
  Google Play (25 USD una vez, con verificación de identidad).

---

## Licencias

Código propio. Las tipografías Bevan e Inter se distribuyen bajo SIL Open Font License
1.1 y se incluyen en `fonts/` para no depender de servidores externos.
