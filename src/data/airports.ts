import type { Airport } from '@/types/flight';

import data from './airports.json';

export const airports = data as Airport[];

const airportsByCode = new Map(
  airports.map((airport) => [airport.code, airport]),
);

export function findAirport(code: string) {
  return airportsByCode.get(code.toUpperCase());
}

const POPULAR_CODES = [
  'TIA',
  'FCO',
  'FRA',
  'MUC',
  'LHR',
  'CDG',
  'AMS',
  'IST',
  'VIE',
  'JFK',
];

const searchIndex = airports.map((airport) => ({
  airport,
  code: airport.code.toLowerCase(),
  city: airport.city.toLowerCase(),
  text: `${airport.city} ${airport.name} ${airport.country}`.toLowerCase(),
}));

export function searchAirports(query: string, limit = 30): Airport[] {
  const term = query.trim().toLowerCase();

  if (!term) {
    return POPULAR_CODES.map(findAirport).filter(
      (airport): airport is Airport => airport != null,
    );
  }

  const exact: Airport[] = [];
  const prefix: Airport[] = [];
  const partial: Airport[] = [];

  for (const entry of searchIndex) {
    if (entry.code === term) exact.push(entry.airport);
    else if (entry.code.startsWith(term) || entry.city.startsWith(term))
      prefix.push(entry.airport);
    else if (entry.text.includes(term)) partial.push(entry.airport);
  }

  return [...exact, ...prefix, ...partial].slice(0, limit);
}
