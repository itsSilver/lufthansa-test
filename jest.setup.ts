jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

jest.mock('react-native-worklets', () =>
  jest.requireActual('react-native-worklets/src/mock'),
);

jest.mock('react-native-reanimated', () =>
  jest.requireActual('react-native-reanimated/mock'),
);

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));
