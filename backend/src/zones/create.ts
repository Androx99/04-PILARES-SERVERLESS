import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { readBody, isZoneInput, json, initialZones } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const input = readBody(event.body);
  if (!isZoneInput(input)) {
    return json(400, {
      message: 'Body inválido: requiere name (string no vacío), capacity (número > 0) y status (OPEN | FULL | CLOSED)'
    });
  }

  const generatedId = `ZONE-${String(initialZones.length + 1).padStart(2, '0')}`;
  console.log('POST zone:', generatedId, input.name);

  return json(201, {
    id: generatedId,
    name: input.name,
    capacity: Number(input.capacity),
    status: input.status
  });
};
