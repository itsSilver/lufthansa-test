import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/colors';

import { popularDestinations } from '../destinations';

type Props = {
  onSelect: (code: string) => void;
};

export const PopularDestinations = memo(function PopularDestinations({
  onSelect,
}: Props) {
  return (
    <View className="gap-3 pt-6">
      <Text className="px-5 font-sans-bold text-lg text-foreground">
        Popular destinations
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4">
        {popularDestinations.map((destination) => (
          <Pressable
            key={destination.code}
            accessibilityRole="button"
            accessibilityLabel={`Fly to ${destination.city}`}
            onPress={() => onSelect(destination.code)}
            className="h-40 w-64 overflow-hidden rounded-3xl active:opacity-90">
            <Image
              source={destination.image}
              contentFit="cover"
              transition={200}
              accessible={false}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.45)']}
              style={StyleSheet.absoluteFill}
            />
            <View className="flex-1 justify-between p-4">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="font-sans-bold text-lg text-white">
                    {destination.city}
                  </Text>
                  <Text className="font-sans text-sm text-white/80">
                    {destination.code}
                  </Text>
                </View>
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/80">
                  <Icon
                    name={{ ios: 'arrow.up.right', android: 'north_east' }}
                    color={palette.white}
                    size={14}
                  />
                </View>
              </View>
              <Text className="font-sans-medium text-sm text-white">
                Set as destination
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});
