import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { Flight } from '@/types/flight';

import { logout } from './auth';

const favoritesAdapter = createEntityAdapter<Flight>({
  sortComparer: (a, b) => a.departure.time.localeCompare(b.departure.time),
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: favoritesAdapter.getInitialState(),
  reducers: {
    toggleFavorite(state, action: PayloadAction<Flight>) {
      if (state.entities[action.payload.id]) {
        favoritesAdapter.removeOne(state, action.payload.id);
      } else {
        favoritesAdapter.addOne(state, action.payload);
      }
    },
    removeFavorite: favoritesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => favoritesAdapter.getInitialState());
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;

export const { selectAll: selectFavorites, selectById: selectFavoriteById } =
  favoritesAdapter.getSelectors((state: RootState) => state.favorites);

export const selectIsFavorite = (state: RootState, id: string) =>
  state.favorites.entities[id] != null;

export default favoritesSlice.reducer;
