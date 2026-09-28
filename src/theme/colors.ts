// tailwind.config.ts imports this in node, so no react-native imports here

export const palette = {
  blue: '#6792EF',
  indigo: '#5546FB',
  black: '#0E0E0E',
  graphite: '#3F4246',
  silver: '#D6D6D6',
  white: '#FFFFFF',
} as const;

export type ColorScheme = 'light' | 'dark';

export type ColorToken =
  | 'background'
  | 'surface'
  | 'foreground'
  | 'muted'
  | 'border'
  | 'primary'
  | 'primary-foreground'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export const colors: Record<ColorScheme, Record<ColorToken, string>> = {
  light: {
    background: '#F5F6F8',
    surface: palette.white,
    foreground: palette.black,
    muted: '#6B6F76',
    border: palette.silver,
    primary: palette.blue,
    'primary-foreground': palette.white,
    accent: palette.indigo,
    success: '#2E9E6A',
    warning: '#E59A1A',
    danger: '#E5484D',
  },
  dark: {
    background: palette.black,
    surface: '#1B1C1F',
    foreground: palette.white,
    muted: '#A0A4AB',
    border: palette.graphite,
    primary: palette.blue,
    'primary-foreground': palette.white,
    accent: palette.indigo,
    success: '#3DBE84',
    warning: '#F5B544',
    danger: '#F2555A',
  },
};

export const colorTokens = Object.keys(colors.light) as ColorToken[];

export function hexToRgbChannels(hex: string): string {
  const value = parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].join(' ');
}

export function themeVariables(scheme: ColorScheme): Record<`--color-${ColorToken}`, string> {
  return Object.fromEntries(
    colorTokens.map((token) => [`--color-${token}`, hexToRgbChannels(colors[scheme][token])]),
  ) as Record<`--color-${ColorToken}`, string>;
}
