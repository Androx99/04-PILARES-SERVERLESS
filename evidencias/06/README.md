# Bloque 06

## Resultado

- Qué añadí al proyecto: comprobé temporalmente cómo responde la aplicación cuando la ruta del catálogo no existe y restauré después la ruta correcta.
- Ruta o pantalla comprobada: pantalla `Programación` de Expo Web (`http://localhost:8082/`); peticiones a `http://localhost:3000/dev/ruta-inexistente` y `http://localhost:3000/dev/events`.
- Estado y respuesta observados: la ruta incorrecta respondió HTTP 404 y la aplicación mostró `HTTP 404: Not Found`. Al restaurar `/events`, la respuesta fue HTTP 200 y aparecieron las tarjetas `EVT-101` y `EVT-102`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: al pulsar `GET recargar`, el cliente solicita `/dev` más la ruta configurada en `getEvents`. La respuesta correcta contiene la lista de actuaciones, que la pantalla representa como tarjetas. Si el servidor responde con error HTTP, el cliente lo muestra en la pantalla en lugar de tratarlo como una lista válida.
- Cambio guiado y resultado: cambié temporalmente `/events` por `/ruta-inexistente` en `getEvents` y pulsé recargar. En Network se observó una respuesta HTTP 404 y apareció el mensaje de error. Restauré `/events`, volví a recargar y comprobé el GET 200 y las dos tarjetas.
- Error encontrado y cómo lo resolví: el 404 correspondía a una ruta no registrada, no a un servidor detenido; hubo una respuesta HTTP del backend. Restauré la ruta existente `/events` y verifiqué la respuesta 200.

## Evidencias

- Captura o transcripción breve, sin credenciales:

  ```text
  GET /dev/ruta-inexistente → HTTP 404 · alerta: "HTTP 404: Not Found"
  GET /dev/events → HTTP 200 · EVT-101 (Neon Waves) y EVT-102 (Midnight Session)
  ```

- Limitaciones del ejercicio: la ruta errónea se probó de forma temporal; el código queda restaurado en `/events`. La prueba requiere el backend y Expo Web activos localmente.
 