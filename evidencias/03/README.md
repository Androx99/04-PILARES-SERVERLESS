# Bloque 03

## Resultado
- Qué añadí al proyecto: Comprobé las validaciones de dominio del endpoint de creación de eventos. Acepta los estados `CONFIRMED` y `CANCELLED` y valida la hora en formato de 24 horas (`HH:mm`).
- Ruta o pantalla comprobada: `POST http://localhost:3000/dev/events`
- Estado y respuesta observados: El body válido con `status: "CANCELLED"` respondió `201 Created`. Los valores `status: "PAUSED"` y `time: "29:80"`, probados en peticiones separadas, respondieron `400 Bad Request`. Al restaurar el body válido, respondió `201 Created`.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Serverless Offline recibe el POST en `/dev/events` y ejecuta `createEvent.handler`. El handler analiza el JSON y valida sus campos: `artist`, `space`, `time` y `status`. Si los valores son válidos, responde `201` con los datos del evento; si no, responde `400` con un mensaje.
- Cambio guiado y resultado: Envié primero un body válido con `CANCELLED`, después probé `PAUSED` y `29:80` en peticiones separadas. Las dos entradas inválidas fueron rechazadas; al restaurar `22:30` y `CANCELLED`, la petición volvió a responder `201`.
- Error encontrado y cómo lo resolví: No hubo un error de ejecución que requiriera cambios en el código. Los dos `400` eran el resultado esperado de enviar un estado y una hora no permitidos.

## Evidencias
- Captura o transcripción breve, sin credenciales:

  ```text
  POST /dev/events {"artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CANCELLED"}
  HTTP 201 {"id":"EVT-NEW","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CANCELLED"}

  POST /dev/events {"artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"PAUSED"}
  HTTP 400 {"message":"status debe ser CONFIRMED o CANCELLED"}

  POST /dev/events {"artist":"Neon Waves","space":"Main Stage","time":"29:80","status":"CANCELLED"}
  HTTP 400 {"message":"artist, space y time (HH:mm) son obligatorios"}

  POST /dev/events {"artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CANCELLED"}
  HTTP 201 {"id":"EVT-NEW","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CANCELLED"}
  ```

- Limitaciones del ejercicio: La creación es de prueba y devuelve el identificador fijo `EVT-NEW`; no guarda el evento en una base de datos ni comprueba la disponibilidad del horario o del espacio.