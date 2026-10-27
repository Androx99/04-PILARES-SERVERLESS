# Bloque 09

## Resultado

- Qué añadí al proyecto: conecté la aplicación cliente frontend (React Native / Expo) con el backend serverless publicado en AWS Cloud sustituyendo la constante `API_URL` por el endpoint real de API Gateway. Se preservó íntegramente la interfaz (`App.tsx`) y las funciones auxiliares de `api.ts` sin introducir SDKs pesados de AWS ni credenciales privadas en el cliente.
- Ruta o pantalla comprobada: pantalla `Programación` en Expo Web interactuando con los endpoints cloud en AWS:
  - `GET https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev/events`
  - `PATCH https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev/events/EVT-101`
- Estado y respuesta observados:
  - `GET /events`: respondió `HTTP 200 OK` cargando las tarjetas de actuaciones (`EVT-101` y `EVT-102`) en la interfaz.
  - `PATCH /events/EVT-101`: respondió `HTTP 200 OK` con el payload `{"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}` mostrado en el panel de resultados de la aplicación.

## Comprensión

- Recorrido del dato, explicado con mis palabras: la aplicación cliente invoca la función estándar `fetch()` apuntando a la URL pública de Amazon API Gateway. La pasarela de API gestiona la conexión HTTPS, aplica la configuración de CORS y transfiere el evento a la función Lambda correspondiente (`listEvents` para lectura o `updateEvent` para actualización parcial). La función Lambda se ejecuta en el runtime Node.js gestionado por AWS, procesa la entrada, genera los logs en Amazon CloudWatch y retorna la respuesta JSON. El cliente recibe el payload y actualiza el estado de React sin percatarse de si el backend está en local o en la nube.
- Cambio guiado y resultado:
  - **Comparación de entornos**:
    - **URL base local (Bloque 07)**: `http://localhost:3000/dev`
    - **URL base cloud real (Bloque 09)**: `https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev`
  - **Transición entre entornos**: para volver al entorno local, basta con editar la línea 4 de `mobile/src/api.ts`:
    ```ts
    export const API_URL = 'http://localhost:3000/dev';
    ```
    y arrancar el proceso en la carpeta `backend` ejecutando `npm run start` (que transpila con `tsc` e inicia `serverless-offline`). La configuración final se mantiene apuntando al entorno cloud.
- Error encontrado y cómo lo resolví: al consultar los registros de `updateEvent` antes de realizar la primera mutación, la CLI devolvió `No existing streams for the function` porque Amazon CloudWatch crea el log stream bajo demanda en la primera ejecución de la función Lambda. Al ejecutar la acción `PATCH` desde la aplicación, la Lambda fue invocada y se creó el stream, mostrando de inmediato `INFO PATCH evento: EVT-101`.

## Evidencias

- Captura o transcripción breve, sin credenciales:

  ```http
  Petición GET cloud:
  Request: GET https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev/events
  Status: 200 OK
  Response: [{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},{"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]

  Petición PATCH cloud:
  Request: PATCH https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev/events/EVT-101
  Request Payload: {"status":"CANCELLED"}
  Status: 200 OK
  Response: {"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}
  ```

  Registros obtenidos en CloudWatch:

  ```text
  # serverless logs -f listEvents
  2026-10-27 12:44:56.593 - INFO LIST eventos: GET
  Duration: 5.52 ms Billed Duration: 143 ms Memory Size: 1024 MB Max Memory Used: 71 MB

  # serverless logs -f updateEvent
  2026-10-27 12:51:21.647 - INFO PATCH evento: EVT-101
  Duration: 4.60 ms Billed Duration: 5 ms Memory Size: 1024 MB Max Memory Used: 71 MB
  ```

- Limitaciones del ejercicio: el backend desplegado en la nube sigue manejando el catálogo en memoria dentro de las funciones Lambda; no existe integración con una base de datos persistente (como Amazon DynamoDB), de modo que las mutaciones no persisten entre ciclos de vida de los contenedores Lambda.
