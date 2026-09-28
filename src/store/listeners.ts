import { createListenerMiddleware } from '@reduxjs/toolkit';
import { colorScheme } from 'nativewind';
import { REHYDRATE } from 'redux-persist';

import { logout } from './slices/auth';

import type { AppDispatch, RootState } from '.';

export const listenerMiddleware = createListenerMiddleware();

const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

// also fires on rehydrate, so the saved theme is applied before the splash hides
startAppListening({
  predicate: (_action, current, previous) =>
    current.settings.themeMode !== previous.settings.themeMode,
  effect: (_action, api) => {
    colorScheme.set(api.getState().settings.themeMode);
  },
});

startAppListening({
  predicate: (action) =>
    action.type === REHYDRATE && (action as { key?: string }).key === 'auth',
  effect: (_action, api) => {
    const { expiresAt } = api.getState().auth;
    if (expiresAt != null && expiresAt < Date.now()) {
      api.dispatch(logout());
    }
  },
});
