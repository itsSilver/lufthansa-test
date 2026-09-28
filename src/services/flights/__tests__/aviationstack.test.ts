import {
  AviationstackError,
  fetchAviationstackTimetable,
} from '../aviationstack';

jest.mock('@/config/env', () => ({
  env: {
    aviationstackApiKey: 'test-key',
    aviationstackBaseUrl: 'http://api.test/v1',
  },
}));

const endpoint = (iata: string, scheduled: string, extra = {}) => ({
  iata,
  terminal: null,
  gate: null,
  baggage: null,
  scheduled,
  delay: null,
  ...extra,
});

const record = (
  iata: string,
  day: string,
  overrides: Record<string, unknown> = {},
) => ({
  flight_date: day,
  flight_status: 'landed',
  airline: { name: 'ITA Airways' },
  flight: { iata, codeshared: null },
  departure: endpoint('TIA', `${day}T11:30:00+00:00`),
  arrival: endpoint('FCO', `${day}T12:55:00+00:00`, { terminal: '3' }),
  aircraft: null,
  ...overrides,
});

function mockResponse(body: unknown) {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe('fetchAviationstackTimetable', () => {
  it('merges codeshares and repeated days into one operating flight', async () => {
    mockResponse({
      data: [
        record('AZ585', '2026-09-27'),
        record('AZ585', '2026-09-28', { flight_status: 'active' }),
        record('LH5159', '2026-09-28', {
          airline: { name: 'Lufthansa' },
          flight: { iata: 'LH5159', codeshared: { flight_iata: 'az585' } },
        }),
      ],
    });

    const timetable = await fetchAviationstackTimetable('TIA', 'FCO');

    expect(timetable.flights).toHaveLength(1);
    const [flight] = timetable.flights;
    expect(flight.flightNumber).toBe('AZ585');
    expect(flight.codeshares).toEqual(['LH5159']);
    expect(flight.departure.time).toBe('11:30');
    expect(flight.arrival.terminal).toBe('3');
    expect(Object.keys(flight.liveStatus)).toEqual([
      '2026-09-27',
      '2026-09-28',
    ]);
    expect(flight.liveStatus['2026-09-28'].status).toBe('active');
  });

  it('marks scheduled flights with a long delay as delayed', async () => {
    mockResponse({
      data: [
        record('W45015', '2026-09-28', {
          flight_status: 'scheduled',
          departure: endpoint('TIA', '2026-09-28T14:40:00+00:00', {
            delay: 25,
          }),
        }),
      ],
    });

    const [flight] = (await fetchAviationstackTimetable('TIA', 'FCO')).flights;

    expect(flight.liveStatus['2026-09-28']).toEqual({
      status: 'delayed',
      delayMinutes: 25,
    });
  });

  it('turns API errors into AviationstackError with the error code', async () => {
    mockResponse({
      error: { code: 'usage_limit_reached', message: 'Limit reached' },
    });

    await expect(fetchAviationstackTimetable('TIA', 'FCO')).rejects.toEqual(
      new AviationstackError('usage_limit_reached', 'Limit reached'),
    );
  });
});
