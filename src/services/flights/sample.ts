import { env } from '@/config/env';
import { findAirport } from '@/data/airports';
import type { Airport, RouteTimetable, TimetableEntry } from '@/types/flight';
import { approximateUtcOffset } from '@/utils/flights';

const BUDGET_AIRLINES = [
  { code: 'W4', name: 'Wizz Air' },
  { code: 'FR', name: 'Ryanair' },
];
const AIRLINES = [
  { code: 'LH', name: 'Lufthansa' },
  { code: 'AZ', name: 'ITA Airways' },
  { code: 'OS', name: 'Austrian Airlines' },
  { code: 'LX', name: 'Swiss' },
  { code: 'AF', name: 'Air France' },
  { code: 'KL', name: 'KLM' },
  { code: 'TK', name: 'Turkish Airlines' },
];
const SHORT_HAUL_AIRCRAFT = ['A320', 'A321', 'B738', 'E195'];
const LONG_HAUL_AIRCRAFT = ['A359', 'B789', 'A333', 'B77W'];
const LONG_HAUL_KM = 3500;
const FIRST_DEPARTURE_MINUTES = 6 * 60;
const DEPARTURE_WINDOW_MINUTES = 15 * 60;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function hash(text: string) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distanceKm(from: Airport, to: Airport) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const toClock = (minutes: number) => {
  const inDay = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(inDay / 60)).padStart(2, '0')}:${String(inDay % 60).padStart(2, '0')}`;
};

export async function sampleTimetable(
  origin: string,
  destination: string,
  notice: string,
): Promise<RouteTimetable> {
  await wait(env.mockApiDelayMs);

  const from = findAirport(origin);
  const to = findAirport(destination);
  const random = seededRandom(hash(`${origin}-${destination}`));
  const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)];

  const km = from && to ? distanceKm(from, to) : 1500;
  const isLongHaul = km > LONG_HAUL_KM;
  const durationMinutes = Math.round(((km / 820) * 60 + 30) / 5) * 5;
  const timeZoneShift =
    from && to ? approximateUtcOffset(to) - approximateUtcOffset(from) : 0;
  const count = 3 + Math.floor(random() * 4);

  const flights: TimetableEntry[] = Array.from({ length: count }, (_, i) => {
    const airline = pick(
      isLongHaul ? AIRLINES : [...AIRLINES, ...BUDGET_AIRLINES],
    );
    const departsAt =
      FIRST_DEPARTURE_MINUTES +
      Math.round(((i + random()) * DEPARTURE_WINDOW_MINUTES) / count / 5) * 5;
    const arrivesAt = departsAt + durationMinutes + timeZoneShift;

    return {
      flightNumber: `${airline.code}${100 + Math.floor(random() * 8900)}`,
      airline: airline.name,
      departure: {
        airport: origin,
        time: toClock(departsAt),
        terminal: String(1 + Math.floor(random() * 3)),
        gate: `${pick(['A', 'B', 'C', 'D'])}${1 + Math.floor(random() * 40)}`,
      },
      arrival: {
        airport: destination,
        time: toClock(arrivesAt),
        terminal: String(1 + Math.floor(random() * 3)),
        gate: null,
        baggage: String(1 + Math.floor(random() * 12)),
      },
      arrivalDayOffset: Math.floor(arrivesAt / 1440),
      aircraft: pick(isLongHaul ? LONG_HAUL_AIRCRAFT : SHORT_HAUL_AIRCRAFT),
      codeshares: [],
      liveStatus: {},
    };
  });

  return {
    source: 'sample',
    notice,
    flights: flights.sort((a, b) =>
      a.departure.time.localeCompare(b.departure.time),
    ),
  };
}
