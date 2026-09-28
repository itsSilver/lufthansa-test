import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppReady } from '@/hooks/useAppReady';
import { TabNavigator } from '@/navigation/TabNavigator';
import { navigationTheme } from '@/navigation/theme';
import { ThemeRoot } from '@/theme/ThemeRoot';

export default function App() {
  const isReady = useAppReady();
  const { colorScheme = 'light' } = useColorScheme();

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <ThemeRoot>
        <NavigationContainer
          theme={navigationTheme(colorScheme)}
          onReady={() => SplashScreen.hideAsync()}>
          <TabNavigator />
        </NavigationContainer>
      </ThemeRoot>
    </SafeAreaProvider>
  );
}
