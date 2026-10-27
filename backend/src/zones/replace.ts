import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, readBody, isZoneInput, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta parámetro id en la ruta' });

  if (!initialZones.some(z => z.id === id)) {
    return json(404, { message: 'Espacio no encontrado' });
  }

  const input = readBody(event.body);
  if (!isZoneInput(input)) {
    return json(400, {
      message: 'PUT requiere reemplazo completo: name (string), capacity (número > 0) y status (OPEN | FULL | CLOSED)'
    });
  }

  console.log('PUT zone:', id, input.name);
  return json(200, {
    id,
    name: input.name,
    capacity: Number(input.capacity),
    status: input.status,
    operation: 'REPLACED'
  });
};
