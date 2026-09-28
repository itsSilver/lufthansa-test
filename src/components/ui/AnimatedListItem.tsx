import type { ReactNode } from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

const STAGGER_MS = 60;
const MAX_STAGGERED_ITEMS = 6;

type Props = {
  index?: number;
  children: ReactNode;
};

export function AnimatedListItem({ index = 0, children }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(
        Math.min(index, MAX_STAGGERED_ITEMS) * STAGGER_MS,
      ).duration(300)}
      exiting={FadeOut.duration(200)}>
      {children}
    </Animated.View>
  );
}
