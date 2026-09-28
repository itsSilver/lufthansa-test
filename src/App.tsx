import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { useAppReady } from '@/hooks/useAppReady';
import { RootNavigator } from '@/navigation/RootNavigator';
import { navigationTheme } from '@/navigation/theme';
import { store } from '@/store';
import { ThemeRoot } from '@/theme/ThemeRoot';

export default function App() {
  const isReady = useAppReady();
  const { colorScheme = 'light' } = useColorScheme();

  if (!isReady) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeRoot>
          <NavigationContainer
            theme={navigationTheme(colorScheme)}
            onReady={() => SplashScreen.hideAsync()}>
            <RootNavigator />
          </NavigationContainer>
        </ThemeRoot>
      </SafeAreaProvider>
    </Provider>
  );
}
