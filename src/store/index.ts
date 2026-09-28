import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { flightsApi } from './api/flightsApi';
import { listenerMiddleware } from './listeners';
import auth from './slices/auth';
import favorites from './slices/favorites';
import onboarding from './slices/onboarding';
import recentSearches from './slices/recentSearches';
import settings from './slices/settings';

const rootReducer = combineReducers({
  settings,
  onboarding,
  recentSearches,
  favorites,
  auth: persistReducer(
    {
      key: 'auth',
      storage: AsyncStorage,
      whitelist: ['user', 'token', 'expiresAt'],
    },
    auth,
  ),
  [flightsApi.reducerPath]: flightsApi.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['settings', 'onboarding', 'recentSearches', 'favorites'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware.middleware)
      .concat(flightsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
