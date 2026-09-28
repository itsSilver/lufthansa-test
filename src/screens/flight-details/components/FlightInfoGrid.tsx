import { Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import type { Flight } from '@/types/flight';
import { formatDayLabel } from '@/utils/format';
import { useThemeColors } from '@/theme/useThemeColors';

type Cell = {
  label: string;
  value: string | null;
  icon: IconName;
};

function InfoCell({
  label,
  value,
  icon,
  align,
}: Cell & { align: 'start' | 'end' }) {
  const theme = useThemeColors();

  return (
    <View className={`flex-1 gap-1.5 ${align === 'end' ? 'items-end' : ''}`}>
      <View className="flex-row items-center gap-1.5">
        <Icon name={icon} color={theme.muted} size={14} />
        <Text className="font-sans text-sm text-muted">{label}</Text>
      </View>
      <Text className="font-sans-bold text-lg text-foreground">
        {value ?? '—'}
      </Text>
    </View>
  );
}

export function FlightInfoGrid({ flight }: { flight: Flight }) {
  const rows: [Cell, Cell][] = [
    [
      {
        label: 'Departure terminal',
        value: flight.departure.terminal,
        icon: { ios: 'building.2', android: 'domain' },
      },
      {
        label: 'Gate',
        value: flight.departure.gate,
        icon: { ios: 'door.left.hand.open', android: 'door_front' },
      },
    ],
    [
      {
        label: 'Arrival terminal',
        value: flight.arrival.terminal,
        icon: { ios: 'building.2', android: 'domain' },
      },
      {
        label: 'Baggage belt',
        value: flight.arrival.baggage,
        icon: { ios: 'suitcase', android: 'luggage' },
      },
    ],
    [
      {
        label: 'Aircraft',
        value: flight.aircraft,
        icon: { ios: 'airplane.circle', android: 'airplanemode_active' },
      },
      {
        label: 'Date',
        value: formatDayLabel(flight.departure.time.slice(0, 10)),
        icon: { ios: 'calendar', android: 'calendar_today' },
      },
    ],
  ];

  return (
    <View className="rounded-3xl bg-surface px-5">
      {rows.map(([left, right], index) => (
        <View
          key={left.label}
          className={`flex-row gap-4 py-4 ${
            index > 0 ? 'border-t border-dashed border-border' : ''
          }`}>
          <InfoCell {...left} align="start" />
          <InfoCell {...right} align="end" />
        </View>
      ))}
    </View>
  );
}
