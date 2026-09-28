import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { User } from '@/services/auth';
import { useThemeColors } from '@/theme/useThemeColors';

import { heroImage } from '../destinations';

type Props = {
  user: User | null;
  topInset: number;
};

const PHOTO_ASPECT = 1400 / 933;
const PLANE_CENTER = { x: 0.53, y: 0.5 };
const HERO_HEIGHT = 300;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function HomeHeader({ user, topInset }: Props) {
  const theme = useThemeColors();
  const { colorScheme } = useColorScheme();
  const { width } = useWindowDimensions();

  const heroHeight = topInset + HERO_HEIGHT;
  const photoWidth = Math.max(width * 1.5, heroHeight * PHOTO_ASPECT);
  const photoHeight = photoWidth / PHOTO_ASPECT;
  const photoLeft = clamp(
    width * 0.72 - photoWidth * PLANE_CENTER.x,
    width - photoWidth,
    0,
  );
  const photoTop = clamp(
    heroHeight * 0.68 - photoHeight * PLANE_CENTER.y,
    heroHeight - photoHeight,
    0,
  );

  const firstName = user?.name.split(' ')[0];
  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View style={{ height: heroHeight }}>
      <View className="overflow-hidden bg-sky" style={StyleSheet.absoluteFill}>
        <Image
          source={heroImage}
          contentFit="cover"
          accessible={false}
          style={{
            position: 'absolute',
            left: photoLeft,
            top: photoTop,
            width: photoWidth,
            height: photoHeight,
            opacity: colorScheme === 'dark' ? 0.5 : 1,
          }}
        />
        <LinearGradient
          colors={[`${theme.background}00`, theme.background]}
          locations={[0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={{ paddingTop: topInset + 12 }} className="gap-5 px-5">
        {user ? (
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Text className="font-sans-bold text-sm text-primary-foreground">
                {initials}
              </Text>
            </View>
            <View>
              <Text className="font-sans text-xs text-muted">Hi</Text>
              <Text className="font-sans-bold text-base leading-5 text-foreground">
                {firstName}
              </Text>
            </View>
          </View>
        ) : null}
        <Text
          maxFontSizeMultiplier={1.3}
          className="font-sans-bold text-[32px] leading-[38px] text-foreground">
          Where would you{'\n'}like to go?
        </Text>
      </View>
    </View>
  );
}
