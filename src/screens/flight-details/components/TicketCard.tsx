import { Text, View } from 'react-native';

import { StatusBadge } from '@/components/flights/StatusBadge';
import { Icon } from '@/components/ui/Icon';
import { findAirport } from '@/data/airports';
import type { Flight } from '@/types/flight';
import { useThemeColors } from '@/theme/useThemeColors';
import { arrivalDayOffset, flightDurationMinutes } from '@/utils/flights';
import { formatClock, formatDayLabel, formatDuration } from '@/utils/format';

function Endpoint({ code, align }: { code: string; align: 'start' | 'end' }) {
  const theme = useThemeColors();
  const city = findAirport(code)?.city ?? code;

  return (
    <View className={align === 'end' ? 'items-end' : 'items-start'}>
      <Text
        maxFontSizeMultiplier={1.3}
        className="font-sans-bold text-3xl text-foreground">
        {code}
      </Text>
      <View className="flex-row items-center gap-1">
        <Icon
          name={{ ios: 'mappin.circle', android: 'location_on' }}
          color={theme.muted}
          size={12}
        />
        <Text
          numberOfLines={1}
          className="max-w-28 font-sans text-sm text-muted">
          {city}
        </Text>
      </View>
    </View>
  );
}

export function TicketCard({ flight }: { flight: Flight }) {
  const theme = useThemeColors();
  const dayOffset = arrivalDayOffset(flight);

  return (
    <View
      className="rounded-3xl bg-surface"
      style={{ boxShadow: '0 16px 40px rgba(20, 40, 80, 0.10)' }}>
      <View className="gap-5 p-5">
        <View className="flex-row items-start justify-between">
          <Endpoint code={flight.departure.airport} align="start" />
          <View className="items-center gap-1 pt-1">
            <Text className="font-sans text-xs text-muted">Flight time</Text>
            <View className="flex-row items-center gap-1.5 rounded-full bg-field px-3 py-1.5">
              <Icon
                name={{ ios: 'airplane', android: 'flight' }}
                color={theme.foreground}
                size={12}
              />
              <Text className="font-sans-medium text-sm text-foreground">
                {formatDuration(flightDurationMinutes(flight))}
              </Text>
            </View>
          </View>
          <Endpoint code={flight.arrival.airport} align="end" />
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="font-sans-medium text-base text-foreground">
            {formatClock(flight.departure.time)}
          </Text>
          <View className="h-1.5 w-1.5 rounded-full bg-muted" />
          <View className="h-px flex-1 border-t border-dashed border-border" />
          <Icon
            name={{ ios: 'airplane', android: 'flight' }}
            color={theme.primary}
            size={22}
          />
          <View className="h-px flex-1 border-t border-dashed border-border" />
          <View className="h-1.5 w-1.5 rounded-full bg-muted" />
          <Text className="font-sans-medium text-base text-foreground">
            {formatClock(flight.arrival.time)}
            {dayOffset > 0 ? (
              <Text className="text-xs text-primary"> +{dayOffset}</Text>
            ) : null}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="font-sans text-xs text-muted">
            {formatDayLabel(flight.departure.time.slice(0, 10))}
          </Text>
          <Text className="font-sans text-xs text-muted">
            {formatDayLabel(flight.arrival.time.slice(0, 10))}
          </Text>
        </View>
      </View>

      <View className="h-6 justify-center">
        <View className="absolute -left-3 h-6 w-6 rounded-full bg-background" />
        <View className="mx-5 border-t border-dashed border-border" />
        <View className="absolute -right-3 h-6 w-6 rounded-full bg-background" />
      </View>

      <View className="flex-row items-center justify-between p-5">
        <View className="flex-1 gap-1">
          <Text
            numberOfLines={1}
            className="font-sans-bold text-base text-primary">
            {flight.airline}
          </Text>
          <StatusBadge
            status={flight.status}
            delayMinutes={flight.delayMinutes}
          />
        </View>
        <Text
          maxFontSizeMultiplier={1.3}
          className="font-sans-bold text-2xl text-foreground">
          {flight.flightNumber}
        </Text>
      </View>
    </View>
  );
}
