import { Image } from 'expo-image';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  completeOnboarding,
  selectOnboardingStep,
  setOnboardingStep,
} from '@/store/slices/onboarding';
import { useThemeColors } from '@/theme/useThemeColors';

import { PageDots } from './components/PageDots';
import { slides, type Slide } from './slides';

const SLIDE_PADDING = 16;
const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

export function OnboardingScreen() {
  const dispatch = useAppDispatch();
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [listHeight, setListHeight] = useState(0);
  const savedStep = useAppSelector(selectOnboardingStep);
  const index = Math.min(savedStep, slides.length - 1);
  const [initialIndex] = useState(index);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Slide>[] }) => {
      const visibleIndex = viewableItems[0]?.index;
      if (visibleIndex != null) dispatch(setOnboardingStep(visibleIndex));
    },
    [dispatch],
  );

  const isLastSlide = index === slides.length - 1;
  const finish = () => dispatch(completeOnboarding());

  const goNext = () => {
    if (isLastSlide) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
    dispatch(setOnboardingStep(index + 1));
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(slide) => slide.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
        initialScrollIndex={initialIndex > 0 ? initialIndex : undefined}
        getItemLayout={(_, itemIndex) => ({
          length: width,
          offset: width * itemIndex,
          index: itemIndex,
        })}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              height: listHeight,
              paddingHorizontal: SLIDE_PADDING,
            }}
            className="gap-8 pt-2">
            <Image
              source={item.image}
              contentFit="cover"
              accessible={false}
              style={{
                flex: 1,
                width: width - SLIDE_PADDING * 2,
                borderRadius: 32,
              }}
            />
            <View className="gap-3 px-4">
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-center font-sans-bold text-3xl text-foreground">
                {item.title}
              </Text>
              <Text className="text-center font-sans text-base leading-6 text-muted">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="gap-6 px-6 pt-8">
        <PageDots count={slides.length} activeIndex={index} />
        <Button
          title={isLastSlide ? 'Get Started' : 'Next'}
          icon={
            isLastSlide
              ? { ios: 'airplane', android: 'flight' }
              : { ios: 'arrow.right', android: 'arrow_forward' }
          }
          onPress={goNext}
        />
      </View>

      {isLastSlide ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={finish}
          hitSlop={8}
          style={{ top: insets.top + 20 }}
          className="absolute right-8 h-11 w-11 items-center justify-center rounded-full bg-surface/90 active:opacity-80">
          <Icon
            name={{ ios: 'xmark', android: 'close' }}
            color={theme.foreground}
            size={18}
          />
        </Pressable>
      )}
    </View>
  );
}
