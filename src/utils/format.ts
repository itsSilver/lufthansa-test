import type { SearchCriteria } from '@/types/flight';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatShortDate(day: string) {
  const [, month, date] = day.split('-').map(Number);
  return `${date} ${MONTHS[month - 1]}`;
}

export function formatClock(dateTime: string) {
  return dateTime.slice(11, 16);
}

export function formatRoute({ origin, destination }: SearchCriteria) {
  return `${origin} → ${destination}`;
}

export function formatSearchDates({
  departureDate,
  returnDate,
}: SearchCriteria) {
  const departure = formatShortDate(departureDate);
  return returnDate
    ? `${departure} – ${formatShortDate(returnDate)}`
    : departure;
}

export function formatRecentSearch(criteria: SearchCriteria) {
  return `${formatRoute(criteria)} · ${formatSearchDates(criteria)}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatDayLabel(day: string) {
  const [year, month, date] = day.split('-').map(Number);
  const weekday =
    WEEKDAYS[new Date(Date.UTC(year, month - 1, date)).getUTCDay()];
  return `${weekday}, ${formatShortDate(day)}`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}
