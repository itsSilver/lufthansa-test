import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { getRouteTimetable, type Route } from '@/services/flights';
import type { RouteTimetable } from '@/types/flight';

const CACHE_SECONDS = 30 * 60;

export const flightsApi = createApi({
  reducerPath: 'flightsApi',
  baseQuery: fakeBaseQuery<string>(),
  keepUnusedDataFor: CACHE_SECONDS,
  endpoints: (builder) => ({
    getRouteTimetable: builder.query<RouteTimetable, Route>({
      queryFn: async (route) => {
        try {
          return { data: await getRouteTimetable(route) };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : 'Could not load flights',
          };
        }
      },
    }),
  }),
});

export const { useGetRouteTimetableQuery } = flightsApi;
