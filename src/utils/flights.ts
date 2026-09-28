import { findAirport } from '@/data/airports';
import type { Airport, Flight, RouteTimetable } from '@/types/flight';

import { addDays, daysBetween } from './dates';

export function flightsOnDate(
  timetable: RouteTimetable,
  date: string,
): Flight[] {
  return timetable.flights.map(({ arrivalDayOffset, liveStatus, ...entry }) => {
    const live = liveStatus[date];

    return {
      ...entry,
      id: `${entry.flightNumber}-${date}`,
      departure: {
        ...entry.departure,
        time: `${date}T${entry.departure.time}`,
      },
      arrival: {
        ...entry.arrival,
        time: `${addDays(date, arrivalDayOffset)}T${entry.arrival.time}`,
      },
      status: live?.status ?? 'scheduled',
      delayMinutes: live?.delayMinutes ?? 0,
    };
  });
}

// no time zone data, so the offset is estimated from longitude
export const approximateUtcOffset = (airport: Airport) =>
  Math.round(airport.lon / 15) * 60;

const minutesOfDay = (dateTime: string) =>
  Number(dateTime.slice(11, 13)) * 60 + Number(dateTime.slice(14, 16));

export function flightDurationMinutes({ departure, arrival }: Flight) {
  const from = findAirport(departure.airport);
  const to = findAirport(arrival.airport);
  const zoneShift =
    from && to ? approximateUtcOffset(to) - approximateUtcOffset(from) : 0;
  const dayShift = daysBetween(
    departure.time.slice(0, 10),
    arrival.time.slice(0, 10),
  );

  return (
    dayShift * 1440 +
    minutesOfDay(arrival.time) -
    minutesOfDay(departure.time) -
    zoneShift
  );
}

export const arrivalDayOffset = ({ departure, arrival }: Flight) =>
  daysBetween(departure.time.slice(0, 10), arrival.time.slice(0, 10));

export const flightDetailsParams = (flight: Flight) => ({
  flightId: flight.id,
  origin: flight.departure.airport,
  destination: flight.arrival.airport,
  date: flight.departure.time.slice(0, 10),
});
