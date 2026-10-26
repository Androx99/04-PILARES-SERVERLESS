# Festival Control · Bloque 01

## Qué he construido

He construido una función Lambda escrita en **TypeScript** llamada `hello` que responde a peticiones HTTP GET.

- **Ruta local probada:** `http://localhost:3000/hello`
- **Handler registrado en `serverless.yml`:** `dist/hello.handler`
- La función devuelve un JSON con `statusCode: 200` y el cuerpo:
  ```json
  {
    "message": "Festival Control · equipo preparado",
    "service": "hello"
  }
  ```
- El servidor local se levanta con `npm run start` (que ejecuta `tsc` seguido de `serverless offline`).

---

## Qué he comprendido

### Tipos del handler

El handler está tipado con dos tipos de `@types/aws-lambda`:

| Tipo | Rol |
|---|---|
| `APIGatewayProxyEvent` | Parámetro de entrada: representa el evento HTTP completo (ruta, headers, body, queryParams…) |
| `APIGatewayProxyResult` | Tipo de retorno: objeto con `statusCode` y `body` en formato string |

La firma completa es:

```ts
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult>
```

### Compilación TypeScript → JavaScript

TypeScript **no se ejecuta directamente**. El compilador `tsc` lee `src/hello.ts` y genera `dist/hello.js` (+ `dist/hello.js.map` para source maps). Por eso el handler apunta a `dist/hello.handler` y no a `src/hello.handler`.

Configuración relevante en `tsconfig.json`:
- `rootDir: "src"` → carpeta de fuentes `.ts`
- `outDir: "dist"` → carpeta de salida `.js`
- `target: "ES2022"`, `module: "NodeNext"` → compatible con Node 22.x

### Dónde aparece EVENT RECIBIDO

La línea:
```ts
console.log('EVENT RECIBIDO:', event);
```
escribe en **stdout** del proceso de `serverless-offline`. Aparece en la **terminal** donde se ejecutó `npm run start`, justo al recibir la petición GET `/hello`. En un entorno AWS real aparecería en los logs de **CloudWatch Logs**.

---

## Qué he modificado

### Cambios realizados en el JSON de respuesta

El `body` devuelto por la función se construye con `JSON.stringify`. Se puede modificar cualquier campo del objeto interno (por ejemplo, cambiar el texto de `message` o añadir nuevos campos como `timestamp`) sin romper el contrato HTTP.

**Ejemplo:** cambiar `"Festival Control · equipo preparado"` a otro texto solo requiere editar el objeto en `src/hello.ts` y recompilar (`npm run build`).

### Por qué no cambia la URL

La URL (`/hello`) la define exclusivamente `serverless.yml` bajo `functions.hello.events.http.path`, **no** el código TypeScript. La lógica interna del handler (el JSON que devuelve) es completamente independiente del enrutamiento: se puede modificar el cuerpo de la respuesta todas las veces que se quiera sin que la URL cambie, porque son dos responsabilidades separadas:

- **Serverless Framework** → gestiona el routing y el evento HTTP
- **Handler TypeScript** → gestiona qué datos devolver

---

## Cómo lo he comprobado

### Thunder Client / Postman

Petición `GET http://localhost:3000/hello` → respuesta `200 OK`:
```json
{
  "message": "Festival Control · equipo preparado",
  "service": "hello"
}
```

### curl

```bash
curl -s http://localhost:3000/hello
# {"message":"Festival Control · equipo preparado","service":"hello"}
```

### Log en terminal (serverless-offline)

Al recibir la petición aparece en consola:
```
EVENT RECIBIDO: {
  version: '1.0',
  resource: '/hello',
  path: '/hello',
  httpMethod: 'GET',
  ...
}
```

### Evidencia

> ✅ `npm run typecheck` ejecutado sin errores → TypeScript compila correctamente  
> ✅ `dist/hello.js` generado tras `npm run build` con el handler sin tipos (JS puro)  
> ✅ Servidor offline levantado en `http://localhost:3000`  
> ✅ Respuesta `200` con JSON verificada en Thunder Client y `curl`

