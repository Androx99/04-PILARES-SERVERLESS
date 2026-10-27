export type EventStatus = 'CONFIRMED' | 'CANCELLED';
export interface FestivalEvent {
  id: string;
  artist: string;
  space: string;
  time: string;
  status: EventStatus;
}
export type EventInput = Omit<FestivalEvent, 'id'>;

// ==========================================
// VENUE CONTROL · Tipos de Espacios / Zonas
// ==========================================
export type ZoneStatus = 'OPEN' | 'FULL' | 'CLOSED';

export interface VenueZone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<VenueZone, 'id'>;
export type ZoneUpdateInput = Partial<ZoneInput>;
