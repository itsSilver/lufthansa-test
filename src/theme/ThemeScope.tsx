import { vars, useColorScheme } from 'nativewind';
import { View, type ViewProps } from 'react-native';

import { themeVariables } from './colors';

const schemeVariables = {
  light: vars(themeVariables('light')),
  dark: vars(themeVariables('dark')),
};

export function ThemeScope({ style, ...props }: ViewProps) {
  const { colorScheme = 'light' } = useColorScheme();

  return <View style={[schemeVariables[colorScheme], style]} {...props} />;
}
