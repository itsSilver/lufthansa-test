import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { fonts } from '@/theme/fonts';

export function useAppReady(): boolean {
  const [fontsLoaded, fontError] = useFonts(fonts);

  useEffect(() => {
    if (fontError) {
      console.warn('Failed to load fonts', fontError);
    }
  }, [fontError]);

  return fontsLoaded || fontError != null;
}
