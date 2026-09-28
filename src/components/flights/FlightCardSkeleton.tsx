import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function FlightCardSkeleton() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={pulse}
      className="mx-4 gap-5 rounded-3xl bg-surface p-4 pb-5">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 rounded-full bg-field" />
        <View className="flex-1 gap-2">
          <View className="h-4 w-1/2 rounded-full bg-field" />
          <View className="h-3 w-1/4 rounded-full bg-field" />
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="h-7 w-16 rounded-lg bg-field" />
        <View className="h-2 w-24 rounded-full bg-field" />
        <View className="h-7 w-16 rounded-lg bg-field" />
      </View>
    </Animated.View>
  );
}
