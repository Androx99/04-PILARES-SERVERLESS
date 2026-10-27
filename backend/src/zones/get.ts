import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  console.log('GET zone:', id);
  if (!id) return json(400, { message: 'Falta parámetro id en la ruta' });
  const found = initialZones.find(z => z.id === id);
  return found ? json(200, found) : json(404, { message: 'Espacio no encontrado' });
};

