import type {
  FestivalEvent,
  EventInput,
  EventStatus,
  VenueZone,
  ZoneInput,
  ZoneStatus,
  ZoneUpdateInput
} from './types';

// URL base para el backend. Puedes alternar fácilmente entre local y nube:
// Local: 'http://localhost:3000/dev'
// Cloud: 'https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev'
export const API_URL = 'https://sedbq81j81.execute-api.us-east-1.amazonaws.com/dev';

async function request(path: string, method = 'GET', body?: unknown): Promise<unknown> {
  const response = await fetch(API_URL + path, {
    method,
    headers: {
      'Accept': 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });

  const value: unknown = await response.json();
  if (!response.ok) {
    const message = typeof value === 'object' && value !== null && 'message' in value
      ? String(value.message) : response.statusText;
    throw new Error('HTTP ' + response.status + ': ' + message);
  }
  return value;
}

// ------------------------------------------
// Funciones Festival Control (Retrocompatibilidad)
// ------------------------------------------
function isFestivalEvent(value: unknown): value is FestivalEvent {
  return typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'artist' in value && typeof value.artist === 'string' &&
    'space' in value && typeof value.space === 'string' &&
    'time' in value && typeof value.time === 'string' &&
    'status' in value && (value.status === 'CONFIRMED' || value.status === 'CANCELLED');
}

export async function getEvents(): Promise<FestivalEvent[]> {
  const value = await request('/events');
  if (!Array.isArray(value) || !value.every(isFestivalEvent)) {
    throw new Error('La API no devolvió una lista de actuaciones válida');
  }
  return value;
}

export const createEvent = (input: EventInput) => request('/events', 'POST', input);
export const replaceEvent = (id: string, input: EventInput) => request('/events/' + encodeURIComponent(id), 'PUT', input);
export const updateEvent = (id: string, status: EventStatus) => request('/events/' + encodeURIComponent(id), 'PATCH', { status });
export const deleteEvent = (id: string) => request('/events/' + encodeURIComponent(id), 'DELETE');

// ------------------------------------------
// Funciones VENUE CONTROL (Entrenamiento No Asistido)
// ------------------------------------------
function isVenueZone(value: unknown): value is VenueZone {
  return typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'name' in value && typeof value.name === 'string' &&
    'capacity' in value && typeof value.capacity === 'number' &&
    'status' in value && (value.status === 'OPEN' || value.status === 'FULL' || value.status === 'CLOSED');
}

export async function getZones(): Promise<VenueZone[]> {
  const value = await request('/zones');
  if (!Array.isArray(value) || !value.every(isVenueZone)) {
    throw new Error('La API no devolvió un listado de zonas válido');
  }
  return value;
}

export async function getZone(id: string): Promise<VenueZone> {
  const value = await request('/zones/' + encodeURIComponent(id));
  if (!isVenueZone(value)) {
    throw new Error('La zona obtenida no cumple el contrato');
  }
  return value;
}

export const createZone = (input: ZoneInput) =>
  request('/zones', 'POST', input);

export const replaceZone = (id: string, input: ZoneInput) =>
  request('/zones/' + encodeURIComponent(id), 'PUT', input);

export const updateZoneStatus = (id: string, status: ZoneStatus) =>
  request('/zones/' + encodeURIComponent(id), 'PATCH', { status });

export const updateZone = (id: string, changes: ZoneUpdateInput) =>
  request('/zones/' + encodeURIComponent(id), 'PATCH', changes);

export const deleteZone = (id: string) =>
  request('/zones/' + encodeURIComponent(id), 'DELETE');
