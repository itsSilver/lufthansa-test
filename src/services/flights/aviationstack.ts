import { env } from '@/config/env';
import type {
  FlightStatus,
  RouteTimetable,
  TimetableEntry,
} from '@/types/flight';
import { daysBetween } from '@/utils/dates';

type RawEndpoint = {
  iata: string;
  terminal: string | null;
  gate: string | null;
  baggage?: string | null;
  scheduled: string;
  delay: number | null;
};

type RawFlight = {
  flight_date: string;
  flight_status: string;
  airline: { name: string };
  flight: { iata: string | null; codeshared: { flight_iata: string } | null };
  departure: RawEndpoint;
  arrival: RawEndpoint;
  aircraft: { iata: string | null; registration: string | null } | null;
};

type RawResponse = {
  data?: RawFlight[];
  error?: { code: string; message: string };
};

export class AviationstackError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

const KNOWN_STATUSES: string[] = [
  'scheduled',
  'active',
  'landed',
  'cancelled',
  'diverted',
  'incident',
];
const DELAYED_AFTER_MINUTES = 15;

// times are local despite the +00:00 suffix
const localTime = (timestamp: string) => timestamp.slice(11, 16);
const localDay = (timestamp: string) => timestamp.slice(0, 10);

function toLiveStatus(raw: RawFlight) {
  const delayMinutes = raw.departure.delay ?? 0;
  const status = KNOWN_STATUSES.includes(raw.flight_status)
    ? (raw.flight_status as FlightStatus)
    : 'scheduled';

  return {
    status:
      status === 'scheduled' && delayMinutes >= DELAYED_AFTER_MINUTES
        ? ('delayed' as const)
        : status,
    delayMinutes,
  };
}

function toTimetable(data: RawFlight[]): TimetableEntry[] {
  const codeshares = new Map<string, Set<string>>();
  for (const raw of data) {
    const operating = raw.flight.codeshared?.flight_iata.toUpperCase();
    if (!operating || !raw.flight.iata) continue;
    codeshares.set(
      operating,
      (codeshares.get(operating) ?? new Set()).add(raw.flight.iata),
    );
  }

  const entries = new Map<string, TimetableEntry>();
  const operatingFlights = data
    .filter((raw) => raw.flight.iata && !raw.flight.codeshared)
    .sort((a, b) => a.flight_date.localeCompare(b.flight_date));

  for (const raw of operatingFlights) {
    const flightNumber = raw.flight.iata as string;
    const previous = entries.get(flightNumber);

    entries.set(flightNumber, {
      flightNumber,
      airline: raw.airline.name,
      departure: {
        airport: raw.departure.iata,
        time: localTime(raw.departure.scheduled),
        terminal:
          raw.departure.terminal ?? previous?.departure.terminal ?? null,
        gate: raw.departure.gate ?? previous?.departure.gate ?? null,
      },
      arrival: {
        airport: raw.arrival.iata,
        time: localTime(raw.arrival.scheduled),
        terminal: raw.arrival.terminal ?? previous?.arrival.terminal ?? null,
        gate: raw.arrival.gate ?? previous?.arrival.gate ?? null,
        baggage: raw.arrival.baggage ?? previous?.arrival.baggage ?? null,
      },
      arrivalDayOffset: daysBetween(
        localDay(raw.departure.scheduled),
        localDay(raw.arrival.scheduled),
      ),
      aircraft:
        raw.aircraft?.iata ??
        raw.aircraft?.registration ??
        previous?.aircraft ??
        null,
      codeshares: [...(codeshares.get(flightNumber) ?? [])],
      liveStatus: {
        ...previous?.liveStatus,
        [raw.flight_date]: toLiveStatus(raw),
      },
    });
  }

  return [...entries.values()].sort((a, b) =>
    a.departure.time.localeCompare(b.departure.time),
  );
}

export async function fetchAviationstackTimetable(
  origin: string,
  destination: string,
): Promise<RouteTimetable> {
  const params = new URLSearchParams({
    access_key: env.aviationstackApiKey,
    dep_iata: origin,
    arr_iata: destination,
  });
  const response = await fetch(
    `${env.aviationstackBaseUrl}/flights?${params.toString()}`,
  );
  const body = (await response.json()) as RawResponse;

  if (body.error) {
    throw new AviationstackError(body.error.code, body.error.message);
  }
  if (!response.ok) {
    throw new AviationstackError(
      'http_error',
      `Request failed with status ${response.status}`,
    );
  }

  return {
    source: 'aviationstack',
    notice: null,
    flights: toTimetable(body.data ?? []),
  };
}
