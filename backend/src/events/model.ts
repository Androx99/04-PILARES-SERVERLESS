import type { APIGatewayProxyResult } from 'aws-lambda';
 
export type EventStatus = 'CONFIRMED' | 'CANCELLED';
export interface FestivalEvent {
  id: string;
  artist: string;
  space: string;
  time: string;
  status: EventStatus;
}
export type EventInput = Omit<FestivalEvent, 'id'>;
 
export const catalog: FestivalEvent[] = [
  { id: 'EVT-101', artist: 'Neon Waves', space: 'Main Stage', time: '22:30', status: 'CONFIRMED' },
  { id: 'EVT-102', artist: 'Midnight Session', space: 'Club Stage', time: '23:45', status: 'CONFIRMED' }
];
 
export const json = (statusCode: number, value: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
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
 
export function isEventInput(value: Record<string, unknown> | null): value is EventInput {
  return value !== null &&
    typeof value.artist === 'string' && value.artist.trim().length > 0 &&
    typeof value.space === 'string' && value.space.trim().length > 0 &&
    typeof value.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value.time) &&
    (value.status === 'CONFIRMED' || value.status === 'CANCELLED');
}
 