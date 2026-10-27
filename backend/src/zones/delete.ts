import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta parámetro id en la ruta' });

  if (!initialZones.some(z => z.id === id)) {
    return json(404, { message: 'Espacio no encontrado' });
  }

  console.log('DELETE zone:', id);
  return json(200, {
    id,
    operation: 'DELETED'
  });
};

