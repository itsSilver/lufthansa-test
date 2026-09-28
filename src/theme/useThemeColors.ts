import { useColorScheme } from 'nativewind';

import { colors } from './colors';

export function useThemeColors() {
  const { colorScheme = 'light' } = useColorScheme();
  return colors[colorScheme];
}
