# Bloque 08

## Resultado

- Qué añadí al proyecto: configuré y desplegué el backend Serverless en AWS Cloud utilizando Serverless Framework, asociando el rol IAM del laboratorio (`LabRole`), la región (`us-east-1`) y el identificador de alumno en el nombre del servicio (`festival-control-api-910802441349`). Se publicaron las funciones Lambda y los endpoints en API Gateway, verificando su consumo público y la captura de logs en CloudWatch.
- Ruta o pantalla comprobada: endpoint real desplegado en AWS API Gateway (`https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev`):
  - `GET /events`
  - `GET /events/EVT-101`
  - `GET /events/NO-EXISTE`
- Estado y respuesta observados:
  - `GET /events` respondió `HTTP 200 OK` con el catálogo completo de dos eventos.
  - `GET /events/EVT-101` respondió `HTTP 200 OK` con los datos del evento Neon Waves.
  - `GET /events/NO-EXISTE` respondió `HTTP 404 Not Found` con `{"message":"Evento no encontrado"}`.

## Comprensión

- Recorrido del dato, explicado con mis palabras: la petición HTTP efectuada por el cliente llega al endpoint público de AWS API Gateway. API Gateway enruta la llamada según el método y path a la función Lambda correspondiente (`getEvent`), extrayendo el segmento dinámico de la URL en `event.pathParameters.id`. La función Lambda se ejecuta en el runtime Node.js 22.x de AWS, emite la traza por consola (`console.log('GET evento:', id)`), busca la coincidencia en el catálogo y devuelve un objeto de respuesta con `statusCode` y `body`. Toda salida por stdout/stderr es capturada de forma automática por AWS y almacenada en el grupo de registros de Amazon CloudWatch Logs.
- Cambio guiado y resultado: solicité primero el identificador existente `/events/EVT-101` comprobando la respuesta HTTP 200 con su payload correspondiente. Seguidamente solicité el identificador inexistente `/events/NO-EXISTE`, comprobando la respuesta HTTP 404 y el mensaje de error controlado. Al consultar los logs de CloudWatch con `npx serverless logs -f getEvent`, se localizaron las trazas de ejecución de ambos identificadores: `INFO GET evento: EVT-101` e `INFO GET evento: NO-EXISTE`.
- Error encontrado y cómo lo resolví: al ejecutar `npx serverless logs` en la terminal sin tener definidas las variables de entorno, Serverless Framework arrojó el error `Cannot resolve '${env:STUDENT_CODE}' variable at 'service'`. Se solucionó asegurando que las variables `AWS_PROFILE`, `AWS_REGION` y `STUDENT_CODE` estuviesen exportadas en la sesión activa de la terminal antes de invocar los comandos de Serverless.

## Evidencias

- Captura o transcripción breve, sin credenciales:

  ```http
  GET https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev/events/EVT-101
  HTTP/1.1 200 OK
  Content-Type: application/json
  {"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}

  GET https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev/events/NO-EXISTE
  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {"message":"Evento no encontrado"}
  ```

  Registros obtenidos desde Amazon CloudWatch (`npx serverless logs -f getEvent`):

  ```text
  START - f2f04c59-e7d8-4a71-999f-5515d1ffd35d - Version: $LATEST
  2026-10-27 12:07:29.131 - INFO GET evento: EVT-101
  END - f2f04c59-e7d8-4a71-999f-5515d1ffd35d
  REPORT Duration: 5.65 ms Billed Duration: 137 ms Memory Size: 1024 MB Max Memory Used: 71 MB

  START - 2093efb5-1f45-47bc-93d1-3243a9cc526e - Version: $LATEST
  2026-10-27 12:07:49.802 - INFO GET evento: NO-EXISTE
  END - 2093efb5-1f45-47bc-93d1-3243a9cc526e
  REPORT Duration: 1.78 ms Billed Duration: 2 ms Memory Size: 1024 MB Max Memory Used: 71 MB
  ```

- Limitaciones del ejercicio: el catálogo de eventos se encuentra cargado estáticamente en memoria en el código de la función Lambda; no existe una base de datos gestionada persistente (como DynamoDB), por lo que las funciones operan sobre datos volátiles entre instancias frías.
