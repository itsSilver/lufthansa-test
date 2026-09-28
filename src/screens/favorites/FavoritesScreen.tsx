import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { EmptyState } from '@/components/EmptyState';
import { FlightCard } from '@/components/flights/FlightCard';
import { AnimatedListItem } from '@/components/ui/AnimatedListItem';
import { Button } from '@/components/ui/Button';
import type { FavoritesStackScreenProps } from '@/navigation/types';
import { useAppSelector } from '@/store/hooks';
import { selectFavorites } from '@/store/slices/favorites';
import type { Flight } from '@/types/flight';
import { useThemeColors } from '@/theme/useThemeColors';
import { flightDetailsParams } from '@/utils/flights';

export function FavoritesScreen({
  navigation,
}: FavoritesStackScreenProps<'Favorites'>) {
  const theme = useThemeColors();
  const favorites = useAppSelector(selectFavorites);

  const openFlight = useCallback(
    (flight: Flight) =>
      navigation.navigate('FlightDetails', flightDetailsParams(flight)),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Flight; index: number }) => (
      <AnimatedListItem index={index}>
        <FlightCard flight={item} showDate onPress={openFlight} />
      </AnimatedListItem>
    ),
    [openFlight],
  );

  return (
    <Animated.FlatList
      style={{ flex: 1, backgroundColor: theme.background }}
      itemLayoutAnimation={LinearTransition}
      data={favorites}
      keyExtractor={(flight) => flight.id}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
      ListHeaderComponent={
        favorites.length > 0 ? (
          <Text className="px-5 pb-3 font-sans text-sm text-muted">
            {favorites.length} saved{' '}
            {favorites.length === 1 ? 'flight' : 'flights'} · tap the heart to
            remove
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState
          icon={{ ios: 'heart', android: 'favorite_border' }}
          title="No favorite flights yet"
          description="Tap the heart on any flight in your search results to save it here."
          action={
            <Button
              title="Search flights"
              icon={{ ios: 'magnifyingglass', android: 'search' }}
              iconPosition="leading"
              onPress={() =>
                navigation.getParent()?.navigate('HomeTab', { screen: 'Home' })
              }
            />
          }
        />
      }
    />
  );
}

function Separator() {
  return <View className="h-3" />;
}
