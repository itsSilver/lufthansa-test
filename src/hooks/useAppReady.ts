import { useAssets } from 'expo-asset';
import { useFonts } from 'expo-font';
import { useEffect, useSyncExternalStore } from 'react';

import { homeImages } from '@/screens/home/destinations';
import { onboardingImages } from '@/screens/onboarding/slides';
import { persistor } from '@/store';
import { fonts } from '@/theme/fonts';

const preloadImages = [...onboardingImages, ...homeImages];

const isRehydrated = () => persistor.getState().bootstrapped;

export function useAppReady(): boolean {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const [images, imagesError] = useAssets(preloadImages);
  const rehydrated = useSyncExternalStore(persistor.subscribe, isRehydrated);

  useEffect(() => {
    if (fontError) console.warn('Failed to load fonts', fontError);
    if (imagesError) console.warn('Failed to preload images', imagesError);
  }, [fontError, imagesError]);

  const fontsDone = fontsLoaded || fontError != null;
  const imagesDone = images != null || imagesError != null;

  return fontsDone && imagesDone && rehydrated;
}
