import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { SearchCriteria } from '@/types/flight';

import { logout } from './auth';

export const MAX_RECENT_SEARCHES = 10;

export type RecentSearch = SearchCriteria & {
  id: string;
  searchedAt: number;
};

type RecentSearchesState = {
  items: RecentSearch[];
};

const initialState: RecentSearchesState = {
  items: [],
};

export const recentSearchId = ({
  origin,
  destination,
  departureDate,
  returnDate,
}: SearchCriteria) =>
  [origin, destination, departureDate, returnDate ?? ''].join('|');

const recentSearchesSlice = createSlice({
  name: 'recentSearches',
  initialState,
  reducers: {
    addRecentSearch: {
      reducer(state, action: PayloadAction<RecentSearch>) {
        state.items = [
          action.payload,
          ...state.items.filter((item) => item.id !== action.payload.id),
        ].slice(0, MAX_RECENT_SEARCHES);
      },
      prepare(criteria: SearchCriteria) {
        return {
          payload: {
            ...criteria,
            id: recentSearchId(criteria),
            searchedAt: Date.now(),
          },
        };
      },
    },
    removeRecentSearch(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearRecentSearches(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { addRecentSearch, removeRecentSearch, clearRecentSearches } =
  recentSearchesSlice.actions;

export const selectRecentSearches = (state: RootState) =>
  state.recentSearches.items;

export default recentSearchesSlice.reducer;
