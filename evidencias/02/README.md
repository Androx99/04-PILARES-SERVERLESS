# Bloque 02
 
## Resultado
- Qué añadí al proyecto:
He modificado serverless.yml para añadir otra ruta para hacer consultas por id y creado getEvent.ts para poder realizar gets en /events/id y que devuelva un evento
- Ruta o pantalla comprobada:
curl -i http://localhost:3000/dev/events/EVT-205
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
vary: origin
access-control-expose-headers: WWW-Authenticate,Server-Authorization
cache-control: no-cache
content-length: 95
accept-ranges: bytes
Date: Mon, 26 Oct 2026 12:18:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"EVT-205","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
- Estado y respuesta observados:
Hal hacer consultas a la nueva ruta devuelve siempre el evento con la id que se le haya dado.
 
## Comprensión
- Recorrido del dato, explicado con mis palabras:
Serverless Offline recibe la petición GET, busca la ruta events/{id} configurada en serverless.yml y ejecuta getEvent.handler. El identificador de la URL se obtiene de event.pathParameters.id y se incluye en el JSON de respuesta.
- Cambio guiado y resultado:
Se añadió el segmento dinámico {id} a la ruta y el handler lee ese valor. Al consultar /dev/events/EVT-205, la respuesta incluye "id":"EVT-205".
- Error encontrado y cómo lo resolví:
No se registró ningún error durante la comprobación de la petición. El handler responde con estado 400 y el mensaje "Falta id" cuando no recibe un identificador.
 
## Evidencias
- Captura o transcripción breve, sin credenciales:
Petición: GET http://localhost:3000/dev/events/EVT-205
Respuesta: HTTP 200 OK
{"id":"EVT-205","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
- Limitaciones del ejercicio:
El handler devuelve datos de ejemplo definidos en el código. No consulta una base de datos ni comprueba si el evento existe; para cualquier identificador no vacío devuelve los mismos datos, cambiando el valor del campo id.
