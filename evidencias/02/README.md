# Bloque 02

## Resultado

- **Qué añadí al proyecto:** Modifiqué `backend/serverless.yml` para registrar la función `getEvent` en la ruta `GET /events/{id}` y creé `backend/src/getEvent.ts` para procesar la consulta y responder con los datos del evento.
- **Ruta comprobada:** `GET http://localhost:3000/dev/events/EVT-205`
- **Estado y respuesta observados:** La petición respondió `200 OK` con un JSON que incluye el identificador recibido y los datos de un evento de ejemplo:

  ```json
  {
    "id": "EVT-205",
    "artist": "Neon Waves",
    "space": "Main Stage",
    "time": "22:30",
    "status": "CONFIRMED"
  }
  ```

## Comprensión

- **Recorrido del dato:** Serverless Offline recibe la petición y, según la ruta configurada en `serverless.yml`, invoca `getEvent.handler`. El parámetro `{id}` de la URL llega en `event.pathParameters.id`. El handler lo incluye en el objeto de respuesta, lo convierte a JSON y devuelve el estado HTTP `200`.
- **Cambio guiado y resultado:** Añadí una ruta con un segmento dinámico (`{id}`) y un handler TypeScript que lo lee. Al consultar `/dev/events/EVT-205`, la respuesta incluye `"id": "EVT-205"`.
- **Error encontrado y cómo lo resolví:** No se registró ningún error durante la comprobación de esta petición. El handler también contempla el caso en que no llegue un identificador y responde `400` con `{"message":"Falta id"}`.

## Evidencias

- **Transcripción de la comprobación:**

  ```text
  $ curl -i http://localhost:3000/dev/events/EVT-205
  HTTP/1.1 200 OK
  content-type: application/json; charset=utf-8
  content-length: 95

  {"id":"EVT-205","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
  ```

- **Limitaciones del ejercicio:** El handler devuelve datos de ejemplo definidos en el código; todavía no consulta una base de datos ni comprueba si el evento existe. Por eso, cualquier identificador no vacío recibe los mismos datos, salvo por el valor de `id`.