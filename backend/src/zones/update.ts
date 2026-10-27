import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, readBody, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta parámetro id en la ruta' });

  const current = initialZones.find(z => z.id === id);
  if (!current) {
    return json(404, { message: 'Espacio no encontrado' });
  }

  const input = readBody(event.body);
  if (!input || Object.keys(input).length === 0) {
    return json(400, { message: 'PATCH requiere al menos un campo a modificar' });
  }

  const validStatuses = ['OPEN', 'FULL', 'CLOSED'];
  if (input.status !== undefined && !validStatuses.includes(String(input.status))) {
    return json(400, { message: 'status debe ser OPEN, FULL o CLOSED' });
  }

  if (input.capacity !== undefined && (typeof input.capacity !== 'number' || input.capacity <= 0)) {
    return json(400, { message: 'capacity debe ser un número mayor a 0' });
  }

  if (input.name !== undefined && (typeof input.name !== 'string' || input.name.trim().length === 0)) {
    return json(400, { message: 'name no puede estar vacío' });
  }

  console.log('PATCH zone:', id, input);
  return json(200, {
    id,
    changes: input,
    operation: 'UPDATED'
  });
};

