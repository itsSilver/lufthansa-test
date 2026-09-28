import { StatusBar } from 'expo-status-bar';
import { vars, useColorScheme } from 'nativewind';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { themeVariables } from './colors';

export function ThemeRoot({ children }: { children: ReactNode }) {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <View
      className="flex-1 bg-background"
      style={vars(themeVariables(colorScheme))}>
      {children}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}
