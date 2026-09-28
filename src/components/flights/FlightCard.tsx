import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import type { Flight } from '@/types/flight';
import { useThemeColors } from '@/theme/useThemeColors';
import { arrivalDayOffset, flightDurationMinutes } from '@/utils/flights';
import { formatClock, formatDayLabel, formatDuration } from '@/utils/format';

import { FavoriteButton } from './FavoriteButton';
import { StatusBadge } from './StatusBadge';

type Props = {
  flight: Flight;
  showDate?: boolean;
  onPress: (flight: Flight) => void;
};

export const FlightCard = memo(function FlightCard({
  flight,
  showDate = false,
  onPress,
}: Props) {
  const theme = useThemeColors();
  const dayOffset = arrivalDayOffset(flight);
  const departureTime = formatClock(flight.departure.time);
  const arrivalTime = formatClock(flight.arrival.time);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${flight.airline} ${flight.flightNumber}, departs ${departureTime} from ${flight.departure.airport}, arrives ${arrivalTime} at ${flight.arrival.airport}`}
      onPress={() => onPress(flight)}
      style={{ boxShadow: '0 6px 20px rgba(20, 40, 80, 0.06)' }}
      className="mx-4 gap-5 rounded-3xl bg-surface p-4 pb-5 active:opacity-90">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
          <Icon
            name={{ ios: 'airplane', android: 'flight' }}
            color={theme.primary}
            size={18}
          />
        </View>
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="font-sans-medium text-base text-foreground">
            {flight.airline}
          </Text>
          <Text className="font-sans text-sm text-muted">
            {flight.flightNumber}
            {showDate
              ? ` · ${formatDayLabel(flight.departure.time.slice(0, 10))}`
              : ''}
          </Text>
        </View>
        {flight.status !== 'scheduled' ? (
          <StatusBadge
            status={flight.status}
            delayMinutes={flight.delayMinutes}
          />
        ) : null}
        <FavoriteButton flight={flight} />
      </View>

      <View className="flex-row items-center gap-3">
        <View>
          <Text
            maxFontSizeMultiplier={1.3}
            className="font-sans-bold text-2xl text-foreground">
            {departureTime}
          </Text>
          <Text className="font-sans text-sm text-muted">
            {flight.departure.airport}
          </Text>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="font-sans text-xs text-muted">
            {formatDuration(flightDurationMinutes(flight))}
          </Text>
          <View className="w-full flex-row items-center">
            <View className="h-2 w-2 rounded-full border border-muted" />
            <View className="h-px flex-1 border-t border-dashed border-border" />
            <Icon
              name={{ ios: 'airplane', android: 'flight' }}
              color={theme.primary}
              size={16}
            />
            <View className="h-px flex-1 border-t border-dashed border-border" />
            <View className="h-2 w-2 rounded-full bg-muted" />
          </View>
        </View>

        <View className="items-end">
          <View className="flex-row items-start">
            <Text
              maxFontSizeMultiplier={1.3}
              className="font-sans-bold text-2xl text-foreground">
              {arrivalTime}
            </Text>
            {dayOffset > 0 ? (
              <Text className="font-sans-bold text-xs text-primary">
                +{dayOffset}
              </Text>
            ) : null}
          </View>
          <Text className="font-sans text-sm text-muted">
            {flight.arrival.airport}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
