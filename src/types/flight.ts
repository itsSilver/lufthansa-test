export type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export type FlightStatus =
  | 'scheduled'
  | 'delayed'
  | 'active'
  | 'landed'
  | 'cancelled'
  | 'diverted'
  | 'incident';

export type FlightEndpoint = {
  airport: string;
  time: string;
  terminal: string | null;
  gate: string | null;
};

export type Flight = {
  id: string;
  flightNumber: string;
  airline: string;
  departure: FlightEndpoint;
  arrival: FlightEndpoint & { baggage: string | null };
  status: FlightStatus;
  delayMinutes: number;
  aircraft: string | null;
  codeshares: string[];
};

export type SearchCriteria = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
};

export type TimetableEntry = Omit<Flight, 'id' | 'status' | 'delayMinutes'> & {
  arrivalDayOffset: number;
  liveStatus: Record<string, { status: FlightStatus; delayMinutes: number }>;
};

export type RouteTimetable = {
  source: 'aviationstack' | 'sample';
  notice: string | null;
  flights: TimetableEntry[];
};
