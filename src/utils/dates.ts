const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(day: string) {
  const [year, month, date] = day.split('-').map(Number);
  return Date.UTC(year, month - 1, date);
}

export function toDayString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(day: string, amount: number) {
  return new Date(parseDay(day) + amount * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return Math.round((parseDay(to) - parseDay(from)) / DAY_MS);
}

export function toUtcMidnight(day: string) {
  return new Date(parseDay(day));
}

export function fromUtcDate(value: Date | string | number) {
  return new Date(value).toISOString().slice(0, 10);
}
