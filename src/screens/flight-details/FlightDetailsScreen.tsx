import { LinearGradient } from 'expo-linear-gradient';
import { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FavoriteButton } from '@/components/flights/FavoriteButton';
import { Button } from '@/components/ui/Button';
import type { FlightDetailsScreenProps } from '@/navigation/types';
import { useGetRouteTimetableQuery } from '@/store/api/flightsApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectFavoriteById,
  selectIsFavorite,
  toggleFavorite,
} from '@/store/slices/favorites';
import { useThemeColors } from '@/theme/useThemeColors';
import { flightsOnDate } from '@/utils/flights';

import { CodeshareList } from './components/CodeshareList';
import { FlightInfoGrid } from './components/FlightInfoGrid';
import { TicketCard } from './components/TicketCard';

export function FlightDetailsScreen({
  navigation,
  route,
}: FlightDetailsScreenProps) {
  const dispatch = useAppDispatch();
  const theme = useThemeColors();
  const { flightId, origin, destination, date } = route.params;

  const saved = useAppSelector((state) => selectFavoriteById(state, flightId));
  const [savedOnOpen] = useState(saved);
  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, flightId),
  );

  const { data, error, isLoading, refetch } = useGetRouteTimetableQuery(
    { origin, destination },
    { skip: savedOnOpen != null },
  );

  const flight = useMemo(
    () =>
      saved ??
      savedOnOpen ??
      (data
        ? flightsOnDate(data, date).find((item) => item.id === flightId)
        : undefined),
    [saved, savedOnOpen, data, date, flightId],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: flight
        ? () => <FavoriteButton flight={flight} size={18} />
        : undefined,
    });
  }, [navigation, flight]);

  if (!flight) {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator color={theme.primary} />
        </View>
      );
    }

    return (
      <View className="flex-1 bg-background">
        <EmptyState
          icon={{ ios: 'airplane', android: 'flight' }}
          title={error ? "Couldn't load this flight" : 'Flight not found'}
          description={
            error
              ? 'Check your connection and try again.'
              : 'This flight is no longer in the timetable.'
          }
          action={
            error ? <Button title="Try again" onPress={refetch} /> : undefined
          }
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 pb-10 pt-4">
      <LinearGradient
        colors={[theme.sky, `${theme.background}00`]}
        style={[StyleSheet.absoluteFill, { height: 280 }]}
      />
      <TicketCard flight={flight} />
      <FlightInfoGrid flight={flight} />
      <CodeshareList codeshares={flight.codeshares} />
      <Button
        title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        variant={isFavorite ? 'secondary' : 'primary'}
        icon={
          isFavorite
            ? { ios: 'heart.slash', android: 'heart_minus' }
            : { ios: 'heart', android: 'favorite_border' }
        }
        iconPosition="leading"
        onPress={() => dispatch(toggleFavorite(flight))}
      />
    </ScrollView>
  );
}
