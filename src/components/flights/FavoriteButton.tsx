import * as Haptics from 'expo-haptics';
import { Platform, Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsFavorite, toggleFavorite } from '@/store/slices/favorites';
import type { Flight } from '@/types/flight';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  flight: Flight;
  size?: number;
};

const SETTLE = { damping: 14, stiffness: 320, mass: 0.7 };

export function FavoriteButton({ flight, size = 20 }: Props) {
  const dispatch = useAppDispatch();
  const theme = useThemeColors();
  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, flight.id),
  );

  const scale = useSharedValue(1);
  const burst = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value === 0 ? 0 : 0.5 * (1 - burst.value),
    transform: [{ scale: 0.6 + burst.value * 0.9 }],
  }));

  const toggle = () => {
    if (isFavorite) {
      scale.set(
        withSequence(
          withTiming(0.85, { duration: 80, easing: Easing.out(Easing.quad) }),
          withSpring(1, SETTLE),
        ),
      );
    } else {
      scale.set(
        withSequence(
          withTiming(0.7, { duration: 90, easing: Easing.out(Easing.quad) }),
          withSpring(1, SETTLE),
        ),
      );
      burst.set(0);
      burst.set(
        withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
      );
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        isFavorite
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium,
      );
    }
    dispatch(toggleFavorite(flight));
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite
          ? `Remove ${flight.flightNumber} from favorites`
          : `Save ${flight.flightNumber} to favorites`
      }
      accessibilityState={{ selected: isFavorite }}
      hitSlop={10}
      onPress={toggle}
      className={`h-10 w-10 items-center justify-center rounded-full ${
        isFavorite ? 'bg-danger/15' : 'bg-field'
      }`}>
      <Animated.View
        pointerEvents="none"
        style={[
          burstStyle,
          {
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: theme.danger,
          },
        ]}
      />
      <Animated.View style={heartStyle}>
        <Icon
          name={
            isFavorite
              ? { ios: 'heart.fill', android: 'favorite' }
              : { ios: 'heart', android: 'favorite_border' }
          }
          color={isFavorite ? theme.danger : theme.muted}
          size={size}
        />
      </Animated.View>
    </Pressable>
  );
}
