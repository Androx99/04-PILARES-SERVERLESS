import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('LIST zones:', event.httpMethod);
  return json(200, initialZones);
};

