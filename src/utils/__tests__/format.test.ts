import {
  formatDayLabel,
  formatDuration,
  formatRecentSearch,
  formatShortDate,
} from '../format';

describe('format', () => {
  it('formats a recent search like the spec example', () => {
    expect(
      formatRecentSearch({
        origin: 'TIA',
        destination: 'FCO',
        departureDate: '2026-10-12',
        returnDate: '2026-10-15',
      }),
    ).toBe('TIA → FCO · 12 Oct – 15 Oct');
  });

  it('formats a one-way search with a single date', () => {
    expect(
      formatRecentSearch({
        origin: 'FRA',
        destination: 'JFK',
        departureDate: '2026-12-01',
      }),
    ).toBe('FRA → JFK · 1 Dec');
  });

  it('formats short dates across the year', () => {
    expect(formatShortDate('2027-01-09')).toBe('9 Jan');
  });
});

describe('formatDayLabel and formatDuration', () => {
  it('adds the weekday', () => {
    expect(formatDayLabel('2026-10-12')).toBe('Mon, 12 Oct');
  });

  it('formats durations in hours and minutes', () => {
    expect(formatDuration(85)).toBe('1h 25m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(45)).toBe('45m');
  });
});
