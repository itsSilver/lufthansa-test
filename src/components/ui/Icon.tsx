import { SymbolView, type SymbolViewProps } from 'expo-symbols';

type PlatformSymbols = Extract<SymbolViewProps['name'], object>;

export type IconName = {
  ios: NonNullable<PlatformSymbols['ios']>;
  android: NonNullable<PlatformSymbols['android']>;
};

type Props = {
  name: IconName;
  color: string;
  size?: number;
};

export function Icon({ name, color, size = 24 }: Props) {
  return (
    <SymbolView
      name={{ ios: name.ios, android: name.android, web: name.android }}
      tintColor={color}
      size={size}
    />
  );
}
