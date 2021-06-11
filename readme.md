# Buscador de Spotify 

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_eb6313ef8c1bd11e3732034ebd4edafa.png)

## Introducción

[Spotify](https://www.spotify.com/us/) es un servicio de transmisión de música genial que le brinda acceso a un montón de música sin tener que comprar un CD.

Hoy, vamos a crear una aplicación Express para buscar artistas, álbumes y músicas en Spotify. Además, podremos reproducir una vista previa de algunas de estas canciones.


Puede parecer mucho, pero vamos a dividirlo en pasos.!

## Requerimientos

- Hacer `fork` de este repositorio
- Hacer `clone` de este repositorio

## Entrega

- Una vez que terminar, corre los siguientes comandos:

```
$ git add .
$ git commit -m "done"
$ git push origin master
```

- Crear un `pull request`.

## El ayudante clave: paquete npm `spotify-web-api-node`

Spotify es excelente para transmitir música desde la aplicación, pero también tienen un [Servicio web](https://en.wikipedia.org/wiki/Web_service) para que los desarrolladores podamos jugar.

Para el propósito de este ejercicio, usaremos el [paquete npm `spotify-web-api-node`](https://www.npmjs.com/package/spotify-web-api-node) (este es el enlace que te llevará a la documentación, así que hacé click). Como podemos encontrar en los documentos, este paquete nos brinda métodos simples para realizar solicitudes a Spotify y devolvernos artistas, álbumes, músicas y más.

**En este ejercicio, tenemos dos objetivos principales **:

- Vamos a aplicar nuestro conocimiento del método GET y cuándo y por qué usar `req.query` y `req.params`.
- Vamos a practicar cómo **leer la documentación** (de este paquete npm en particular) y cómo usar los ejemplos proporcionados por los documentos para terminar todas las iteraciones.

### Registrar la aplicación y obtener las credenciales

La API de **Spotify** necesitará un `clientId` y un` clientSecret` para darnos permiso para realizar solicitudes y recuperar algunos datos. Para obtener `clientId` y` clientSecret`, tenemos que registrar nuestra aplicación en el sitio web oficial de Spotify Developers. Sigamos estos pasos:

1. Vaya a [Spotify Developers](https://developer.spotify.com/my-applications/#!/).
2. Haga clic en el botón "Iniciar sesión". Si no tiene una cuenta, se le pedirá que cree una, es gratis :wink:.
3. Después de iniciar sesión, haga clic en el botón **Crear una aplicación**.

Las siguientes pantallas pueden estar desactualizadas, ya que Spotify está iterando constantemente en su interfaz, pero eso no debería impedirte completar estos pasos. ¡Lo tienes!

4. Complete los campos y envíe el formulario.

![](https://i.imgur.com/jgN0WzG.png)


5. Ya tenemos toda la info que necesitamos :muscle: 

![](https://i.imgur.com/nNJXedu.png)


## Iteración 1 | Setup de la Spotify API

En los siguientes pasos, crearemos todos los archivos que necesitamos. Hasta ahora, tenemos una configuración básica en `app.js`, pero eso no es suficiente. Como recordarás, para obtener algunos paquetes (incluido `express`) en nuestra aplicación, debemos tenerlos en el archivo` package.json`. Así que comencemos a enumerar los pasos:

1. Instalemos todas las dependencias que necesitamos para ejecutar con éxito esta aplicación:
    `npm install express hbs spotify-web-api-node dotenv`.
2. `nodemon` se instala como una dependencia de desarrollo (nuestra aplicación no depende de él, pero nos ayuda en el proceso de desarrollo), lo que significa que podemos usar nodemon para ejecutar la aplicación con: **`npm run dev`**.

3. Dentro del archivo `app.js`, requiere` spotify-web-api-node`.

```js
const SpotifyWebApi = require('spotify-web-api-node');
```

4. Dentro del archivo `app.js`, encontrarás el lugar donde debes pegar el siguiente código:

```javascript
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
```

5. Ves esta parte?

```js
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
```

Para evitar hacer públicas nuestras claves de API, no queremos agregarlas directamente al `app.js`. Usaremos un paquete llamado `dotenv` para eso.

Este paquete se importa al comienzo de `app.js`. Todo lo que queda por hacer es agregar sus claves en el archivo `.env`.

Así que adelante, crea un archivo `.env` y pega las siguientes líneas allí, reemplazando el texto con sus credenciales.

```
CLIENT_ID=tu clientId va acá
CLIENT_SECRET=tu clientSecret va acá
```

:zap: Se hace referencia al `.env` en el archivo` .gitignore` para que esté seguro que no se subirá a nuestro repositorio de `github`!

:fire: _El estilo debe ser lo último en lo que te concentres. ¡Funcionalidad primero!_ 🙏🏻

## Iteración 2 | Setup de Express

Ahora creemos una carpeta `views` y agreguemos el archivo` layout.hbs` en ella. En este momento deberíamos tener la siguiente estructura de carpetas y archivos:

```
lab-express-spotify
      ├── app.js
      ├── .env
      ├── package.json
      ├── package-lock.json
      ├── node_modules
      ├── public
      │    ├── images
      │    └── stylesheets
      │         └── style.css
      └── views
            └── layout.hbs
```

Como podemos ver, en el _app.js_ hemos requerido todos los paquetes que necesitamos por ahora:

```javascript
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
```

Estamos todo listo. ¡Abramos la documentación de [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-node) y comencemos!

## Iteración 3 | Buscar un **Artista**

**Puedes crear todas tus rutas en el archivo `app.js` **

### Paso 1 | Crear la Homepage

Cree una ruta que muestre la página de inicio. Necesitaremos una ruta `'/'`, que muestre una página de inicio. En esta página, debe tener un pequeño "formulario" de búsqueda que tiene un `input` que recibe el nombre de un artista y un botón que envía la solicitud.

Este formulario debe dirigir su consulta a `/artist-search` (`action="/artist-search", method="GET"`).
El resultado debería ser algo así, pero deje el estilo para el final.

![](https://i.imgur.com/YuTA0vQ.png=400x)

### Paso 2 | Mostrar resultados para la búsqueda de artistas

Bien, nuestro formulario de búsqueda se envió a la ruta `/artist-search`. Todavía no hemos creado esta ruta, ¡hagámoslo!

Esta ruta recibirá el término de búsqueda en el `query` y realizará una solicitud de búsqueda utilizando uno de los métodos del paquete `npm de Spotify`. Tienes la documentación abierta :wink: pero te ayudaremos con tu primer paso.

El método que usaremos del paquete npm es: `spotifyApi.searchArtists()`. En esta ruta, debería tener algo como esto:

```javascript
spotifyApi
  .searchArtists(/*'ACA VA LA CONSULTA DE LOS ARTISTAS'*/)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'ACA HACEMOS LO QUE QUEREMOS CON LO QUE RECIBIMOS DE LA RUTA'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
```

Para mostrar la información de los artistas encontrados, cree el archivo `artist-search-results.hbs` dentro de la carpeta `views` y muestre el nombre, la imagen y el botón (o enlace) para mostrar los álbumes de un artista en particular en una nueva vista (por ahora solo crea el botón/enlace y nos encargaremos del resto en el siguiente paso). Nuevamente, el estilo no es prioridad, así que pasemos al siguiente paso.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_9dc721e76158df1836ef07565b5385c2.png)

## Iteración 4 | Ver álbums

En la página `artist-search-results.hbs` creamos el botón/enlace` Ver álbumes`. Los usuarios deben ser llevados a otra página después de hacer clic en ella y podrán ver todos los álbumes de ese artista en particular. **Sugerencia:** **la URL debe incluir el `id` 🤓 del artista y debe cambiar dinámicamente.**


```html
<a href="/albums/elIDdelArtistaVaAcá">Ver Albums</a>
```

Así que creemos una nueva página - `albums.hbs` donde se mostrarán todos los resultados. Asegúrese de mostrar el _nombre_ y la _cubierta_ de cada álbum y agregue un botón/enlace para ver las músicas (próxima iteración).

:zap: Mira el método `.getArtistAlbums()` en la documentación [spotify-web-api-node](https://www.npmjs.com/package/spotify-web-api-node).

La ruta se tiene que ver así:

```javascript
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});
```

![](https://i.imgur.com/oaoqQMj.png)

Esto va bien hasta ahora, así que terminemos con nuestra última iteración.

## Iteración 5 | Ver músicas

Crea el enlace `Ver músicas` en la página de álbumes. Este enlace debería llevarle al usuario a una página con una lista de todas las músicas de un álbum en particular.

**Consejo**: El enlace a la página de pistas debe tener el _id_ de cada álbum.
**Notas**: :zap: Consulta el método `.getAlbumTracks()` en la documentación de `spotify-web-api-node`.

Un objeto de músicas viene con una `preview_url`, que es la fuente de una vista previa de 30 segundos de una canción en particular. Puede conectar esto en una etiqueta HTML [`audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), y reproducirá la vista previa.

![](https://i.imgur.com/XVKoeqg.png)

Happy Coding! 💙
