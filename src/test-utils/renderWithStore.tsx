import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { flightsApi } from '@/store/api/flightsApi';
import auth from '@/store/slices/auth';
import favorites from '@/store/slices/favorites';
import onboarding from '@/store/slices/onboarding';
import recentSearches from '@/store/slices/recentSearches';
import settings from '@/store/slices/settings';

const rootReducer = combineReducers({
  settings,
  onboarding,
  recentSearches,
  favorites,
  auth,
  [flightsApi.reducerPath]: flightsApi.reducer,
});

type TestState = ReturnType<typeof rootReducer>;

export function createTestStore(preloadedState?: Partial<TestState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(flightsApi.middleware),
  });
}

export async function renderWithStore(
  ui: ReactElement,
  store = createTestStore(),
) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const result = await render(ui, { wrapper });
  return { ...result, store };
}
