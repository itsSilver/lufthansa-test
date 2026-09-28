import {
  addDays,
  daysBetween,
  fromUtcDate,
  toDayString,
  toUtcMidnight,
} from '../dates';

describe('dates', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('counts days between two dates', () => {
    expect(daysBetween('2026-09-28', '2026-09-29')).toBe(1);
    expect(daysBetween('2026-09-28', '2026-09-28')).toBe(0);
  });

  it('formats a local date as YYYY-MM-DD', () => {
    expect(toDayString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('UTC date conversion', () => {
  it('round-trips a day through a UTC midnight date', () => {
    expect(fromUtcDate(toUtcMidnight('2026-09-28'))).toBe('2026-09-28');
  });

  it('keeps the same day for the end of that day', () => {
    expect(fromUtcDate(new Date('2026-09-30T23:59:59.999Z'))).toBe(
      '2026-09-30',
    );
  });
});
