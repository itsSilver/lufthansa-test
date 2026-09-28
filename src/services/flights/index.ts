import { env } from '@/config/env';
import type { RouteTimetable } from '@/types/flight';

import {
  AviationstackError,
  fetchAviationstackTimetable,
} from './aviationstack';
import { sampleTimetable } from './sample';

const FALLBACK_NOTICES: Record<string, string> = {
  usage_limit_reached:
    'The monthly Aviationstack quota is used up, showing sample flights.',
  invalid_access_key:
    'The Aviationstack API key is invalid, showing sample flights.',
  inactive_user:
    'The Aviationstack account is inactive, showing sample flights.',
};

export type Route = {
  origin: string;
  destination: string;
};

export async function getRouteTimetable({
  origin,
  destination,
}: Route): Promise<RouteTimetable> {
  if (!env.aviationstackApiKey) {
    return sampleTimetable(
      origin,
      destination,
      'No Aviationstack API key set, showing sample flights.',
    );
  }

  try {
    return await fetchAviationstackTimetable(origin, destination);
  } catch (error) {
    const notice =
      error instanceof AviationstackError ? FALLBACK_NOTICES[error.code] : null;
    if (notice) return sampleTimetable(origin, destination, notice);
    throw error;
  }
}
