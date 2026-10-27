import type { APIGatewayProxyResult } from 'aws-lambda';

export type ZoneStatus = 'OPEN' | 'FULL' | 'CLOSED';

export interface VenueZone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<VenueZone, 'id'>;

export const initialZones: VenueZone[] = [
  { id: 'ZONE-01', name: 'Main Stage', capacity: 5000, status: 'OPEN' },
  { id: 'ZONE-02', name: 'Garden Stage', capacity: 2500, status: 'FULL' },
  { id: 'ZONE-03', name: 'Invernadero', capacity: 1800, status: 'OPEN' },
  { id: 'ZONE-04', name: 'Club Stage', capacity: 1200, status: 'CLOSED' }
];

export const json = (statusCode: number, value: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  },
  body: JSON.stringify(value)
});

export function readBody(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value !== 'string') return null;

  const text = value.trim();
  if (!text) return null;

  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Normalización de seguridad para shells que envían JSON no estricto
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
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function isZoneInput(value: Record<string, unknown> | null): value is ZoneInput {
  if (value === null) return false;
  const { name, status } = value;
  const capacity = typeof value.capacity === 'string' ? Number(value.capacity) : value.capacity;
  const validStatus = status === 'OPEN' || status === 'FULL' || status === 'CLOSED';
  const validName = typeof name === 'string' && name.trim().length > 0;
  const validCapacity = typeof capacity === 'number' && Number.isFinite(capacity) && capacity > 0;
  return validName && validCapacity && validStatus;
}
