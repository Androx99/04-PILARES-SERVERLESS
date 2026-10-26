# Bloque 04

## Resultado

- Qué añadí al proyecto: completé la API CRUD de eventos con los handlers de listado, consulta, creación, reemplazo, actualización y borrado:
  - `GET /dev/events`
  - `GET /dev/events/{id}`
  - `POST /dev/events`
  - `PUT /dev/events/{id}`
  - `PATCH /dev/events/{id}`
  - `DELETE /dev/events/{id}`
- Ruta de comprobación: `http://127.0.0.1:4100/dev/events`
- Estado y respuesta observados: la API responde `200` para listar y consultar, `201` para crear, `200` para actualizar y borrar, y valida errores con `400`/`404` cuando faltan datos o no existen recursos.

## Qué he comprendido

### Recorrido del dato

La petición entra por la API HTTP que expone Serverless Offline. El framework interpreta la ruta y llama al handler correcto:

- `listEvents` procesa `GET /dev/events`
- `getEvent` procesa `GET /dev/events/{id}` usando `event.pathParameters.id`
- `createEvent` procesa el JSON del body y valida los campos del evento
- `replaceEvent` y `updateEvent` aplican cambios sobre el recurso identificado
- `deleteEvent` devuelve confirmación de borrado

El dato se lee desde `event.body` y se valida con `readBody()` + `isEventInput()` en `src/events/model.ts`.

### Cambio guiado y resultado

Se añadió la lógica de validación y el manejo de errores con mensajes claros. En concreto, la API valida:

- `artist`: texto obligatorio
- `space`: texto obligatorio
- `time`: formato `HH:mm` válido en 24 horas
- `status`: solo `CONFIRMED` o `CANCELLED`

Si la petición no cumple esas reglas, responde con `400 Bad Request`.

### Error encontrado y cómo lo resolví

Durante la comprobación local con Serverless Offline, los body JSON válidos llegaban al Lambda con un formato anormal, parecido a:

```text
{artist:Neon Waves,space:Main Stage,time:22:30,status:CANCELLED}
```

Eso hacía que `JSON.parse()` fallara y devolviera un `400` aunque el payload fuera correcto. Para resolverlo, añadí una validación más robusta en `readBody()`:

- intenta primero `JSON.parse()`
- si falla, normaliza un objeto literal estilo JavaScript a un JSON válido antes de parsear
- sigue aceptando `event.body` ya convertido a objeto por otros runtimes

Con esta corrección, los endpoints de creación y actualización pasaron a funcionar correctamente también vía HTTP en local.

---

## Qué he modificado

### Fichero principal del modelo

He reforzado `backend/src/events/model.ts` para que el parser del body sea tolerante y soporte tanto JSON estándar como entradas con formato simplificado que produce Serverless Offline en entorno local.

```ts
export function readBody(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value !== 'string') return null;

  const text = value.trim();
  if (!text) return null;

  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;
  } catch {
    const normalized = text
      .replace(/([{,]\s*)([A-Za-z0-9_-]+)(\s*:)/g, '$1"$2"$3')
      .replace(/:\s*([^,}]+)/g, (_, rawValue: string) => {
        const valueText = rawValue.trim();
        if (valueText === 'true' || valueText === 'false' || valueText === 'null' || /^-?\d+(\.\d+)?$/.test(valueText)) {
          return `:${valueText}`;
        }
        return `:"${valueText.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
      });

    try {
      const parsed: unknown = JSON.parse(normalized);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : null;
    } catch {
      return null;
    }
  }
}
```

---

## Cómo lo he comprobado

### Arranque local

```bash
cd backend
npm run build
npx serverless offline --httpPort 4100 --lambdaPort 4102 --host 127.0.0.1
```

### GET list

```bash
curl.exe -sS -i http://127.0.0.1:4100/dev/events
```

Respuesta:

```http
HTTP/1.1 200 OK

[{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},{"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]
```

### GET by id

```bash
curl.exe -sS -i http://127.0.0.1:4100/dev/events/EVT-101
```

Respuesta:

```http
HTTP/1.1 200 OK

{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
```

### POST create

```bash
curl.exe -sS -i -X POST http://127.0.0.1:4100/dev/events -H "Content-Type: application/json" --data '{"artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CANCELLED"}'
```

Respuesta:

```http
HTTP/1.1 201 Created

{"id":"EVT-NEW","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CANCELLED"}
```

### PUT replace

```bash
curl.exe -sS -i -X PUT http://127.0.0.1:4100/dev/events/EVT-101 -H "Content-Type: application/json" --data '{"artist":"Updated Artist","space":"Main Stage","time":"23:00","status":"CONFIRMED"}'
```

Respuesta:

```http
HTTP/1.1 200 OK

{"id":"EVT-101","artist":"Updated Artist","space":"Main Stage","time":"23:00","status":"CONFIRMED","operation":"REPLACED"}
```

### PATCH update

```bash
curl.exe -sS -i -X PATCH http://127.0.0.1:4100/dev/events/EVT-101 -H "Content-Type: application/json" --data '{"status":"CANCELLED"}'
```

Respuesta:

```http
HTTP/1.1 200 OK

{"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}
```

### DELETE remove

```bash
curl.exe -sS -i -X DELETE http://127.0.0.1:4100/dev/events/EVT-101
```

Respuesta:

```http
HTTP/1.1 200 OK

{"id":"EVT-101","operation":"DELETED"}
```

### Validación de error

```bash
curl.exe -sS -i -X POST http://127.0.0.1:4100/dev/events -H "Content-Type: application/json" --data '{"artist":"","space":"Main Stage","time":"99:99","status":"PAUSED"}'
```

Respuesta:

```http
HTTP/1.1 400 Bad Request

{"message":"JSON con artist, space, time HH:mm y status válido requerido"}
```

## Evidencia

> ✅ `npm run build` ejecutado sin errores
> ✅ `serverless-offline` arrancado en `http://127.0.0.1:4100`
> ✅ `GET /dev/events` devuelve la colección de eventos
> ✅ `GET /dev/events/{id}` devuelve el evento correcto
> ✅ `POST /dev/events` responde `201 Created`
> ✅ `PUT /dev/events/{id}` responde `200 OK`
> ✅ `PATCH /dev/events/{id}` responde `200 OK`
> ✅ `DELETE /dev/events/{id}` responde `200 OK`

## Limitaciones del ejercicio

- Los eventos viven en memoria en `catalog` y no se persisten en base de datos.
- La API es de demostración y no incluye autenticación ni validación de colisiones de horarios.
- La ruta usa el stage por defecto `dev`, por lo que el prefijo `/dev` es obligatorio en Serverless Offline.
