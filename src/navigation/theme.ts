import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { colors, type ColorScheme } from '@/theme/colors';

export function navigationTheme(scheme: ColorScheme): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const palette = colors[scheme];

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.primary,
      background: palette.background,
      card: palette.surface,
      text: palette.foreground,
      border: palette.border,
      notification: palette.danger,
    },
    fonts: {
      regular: { fontFamily: 'Inter_400Regular', fontWeight: '400' },
      medium: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
      bold: { fontFamily: 'Inter_700Bold', fontWeight: '700' },
      heavy: { fontFamily: 'Inter_700Bold', fontWeight: '700' },
    },
  };
}
