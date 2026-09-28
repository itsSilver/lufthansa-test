import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import type { ReactNode } from 'react';

import { ThemeScope } from './ThemeScope';

export function ThemeRoot({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeScope className="flex-1 bg-background">
      {children}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeScope>
  );
}
