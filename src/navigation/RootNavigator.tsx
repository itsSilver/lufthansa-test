import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/screens/auth/LoginScreen';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { useAppSelector } from '@/store/hooks';
import { selectIsLoggedIn } from '@/store/slices/auth';
import { selectHasSeenOnboarding } from '@/store/slices/onboarding';

import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackType = typeof Stack;

declare module '@react-navigation/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RootNavigator extends RootStackType {}
}

export function RootNavigator() {
  const hasSeenOnboarding = useAppSelector(selectHasSeenOnboarding);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}
