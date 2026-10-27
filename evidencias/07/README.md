# Bloque 07

## Resultado

- Qué añadí al proyecto: incorporé las funciones de mutación HTTP (`createEvent`, `replaceEvent`, `updateEvent`, `deleteEvent`) en `src/api.ts` e integré en `App.tsx` los botones de acciones (`POST`, `PUT`, `PATCH`, `DELETE`) junto al visor de resultados para interactuar con los endpoints del backend.
- Ruta o pantalla comprobada: pantalla `Programación` en Expo Web y endpoint `PATCH http://localhost:3000/dev/events/EVT-101`.
- Estado y respuesta observados: al ejecutar la acción PATCH con el estado `CONFIRMED`, el backend respondió con HTTP 200 y el cuerpo `{ "id": "EVT-101", "changes": { "status": "CONFIRMED" }, "operation": "UPDATED" }`. Tras verificarlo, restauré el estado a `CANCELLED` y se comprobó la respuesta esperada con `changes.status: "CANCELLED"`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: al pulsar el botón en la interfaz, `run()` invoca a `updateEvent('EVT-101', ...)`, la cual realiza una llamada `fetch` mediante el método `PATCH` hacia `/events/EVT-101` enviando el encabezado `Content-Type: application/json` y el body serializado `{ status }`. La función Lambda (`update.handler`) extrae el parámetro `id` de la ruta, valida que el evento exista en el catálogo y que el body contenga únicamente un estado válido (`CONFIRMED` o `CANCELLED`). Devuelve una respuesta HTTP 200 con el objeto de confirmación, y el cliente actualiza el estado React `result` mostrando la respuesta formateada en la interfaz.
- Cambio guiado y resultado: modifiqué temporalmente en `App.tsx` la acción PATCH cambiando `'CANCELLED'` por `'CONFIRMED'`. Guardé, pulsé el botón y comprobé en la petición que el Request Payload fue `{"status":"CONFIRMED"}`, el código de respuesta fue HTTP 200 y `changes.status` reflejó `"CONFIRMED"`. Concluida la comprobación, restauré `'CANCELLED'` para preservar el hito del cuaderno.
- Error encontrado y cómo lo resolví: el endpoint PATCH del backend restringe estrictamente el cuerpo (`Object.keys(input).length !== 1` y solo admite los valores `CONFIRMED` o `CANCELLED`), respondiendo HTTP 400 si se envía cualquier otro campo o valor. Gracias al tipado estricto con `EventStatus` en TypeScript, se previenen errores de payload en el cliente antes de la compilación.

## Evidencias

- Captura o transcripción breve, sin credenciales:

  ```text
  Acción ejecutada: PATCH (cambio guiado a CONFIRMED)
  Request: PATCH http://localhost:3000/dev/events/EVT-101
  Request Payload: {"status":"CONFIRMED"}
  Status: 200 OK
  Response:
  {
    "id": "EVT-101",
    "changes": {
      "status": "CONFIRMED"
    },
    "operation": "UPDATED"
  }

  Estado base restaurado en App.tsx:
  ['PATCH cancelar EVT-101', () => updateEvent('EVT-101', 'CANCELLED')]
  ```

  `npm run typecheck` en `mobile/` y `npm run build` en `backend/` finalizan sin errores.

- Limitaciones del ejercicio: las escrituras son simuladas en memoria por el backend; no existe persistencia en base de datos (DynamoDB), por lo que el catálogo en memoria conserva sus valores base al reiniciar o al consultar de nuevo la lista con GET.
