import type { RouteTimetable } from '@/types/flight';

import { flightDurationMinutes, flightsOnDate } from '../flights';

const timetable: RouteTimetable = {
  source: 'aviationstack',
  notice: null,
  flights: [
    {
      flightNumber: 'AZ585',
      airline: 'ITA Airways',
      departure: { airport: 'TIA', time: '11:30', terminal: null, gate: null },
      arrival: {
        airport: 'FCO',
        time: '12:55',
        terminal: '3',
        gate: null,
        baggage: null,
      },
      arrivalDayOffset: 0,
      aircraft: null,
      codeshares: ['LH5159'],
      liveStatus: { '2026-09-28': { status: 'active', delayMinutes: 9 } },
    },
    {
      flightNumber: 'LH400',
      airline: 'Lufthansa',
      departure: { airport: 'FRA', time: '22:10', terminal: '1', gate: 'Z25' },
      arrival: {
        airport: 'JFK',
        time: '01:05',
        terminal: '1',
        gate: null,
        baggage: null,
      },
      arrivalDayOffset: 1,
      aircraft: 'B748',
      codeshares: [],
      liveStatus: {},
    },
  ],
};

describe('flightsOnDate', () => {
  it('uses the live status on days the API reported', () => {
    const [flight] = flightsOnDate(timetable, '2026-09-28');

    expect(flight.status).toBe('active');
    expect(flight.delayMinutes).toBe(9);
    expect(flight.departure.time).toBe('2026-09-28T11:30');
  });

  it('shows other days as scheduled on the requested date', () => {
    const [flight] = flightsOnDate(timetable, '2026-10-12');

    expect(flight.id).toBe('AZ585-2026-10-12');
    expect(flight.status).toBe('scheduled');
    expect(flight.delayMinutes).toBe(0);
    expect(flight.arrival.time).toBe('2026-10-12T12:55');
  });

  it('moves overnight arrivals to the next day', () => {
    const overnight = flightsOnDate(timetable, '2026-10-31')[1];

    expect(overnight.departure.time).toBe('2026-10-31T22:10');
    expect(overnight.arrival.time).toBe('2026-11-01T01:05');
  });
});

describe('flightDurationMinutes', () => {
  it('uses the local clock difference within one time zone', () => {
    const [flight] = flightsOnDate(timetable, '2026-10-12');
    expect(flightDurationMinutes(flight)).toBe(85);
  });

  it('corrects for time zones and overnight arrivals', () => {
    const overnight = flightsOnDate(timetable, '2026-10-12')[1];
    expect(flightDurationMinutes(overnight)).toBe(535);
  });
});
