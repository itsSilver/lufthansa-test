import { Text, View } from 'react-native';

import type { FlightStatus } from '@/types/flight';

const STATUS_STYLES: Record<
  FlightStatus,
  { label: string; container: string; text: string }
> = {
  scheduled: {
    label: 'Scheduled',
    container: 'bg-primary/15',
    text: 'text-primary',
  },
  delayed: {
    label: 'Delayed',
    container: 'bg-warning/15',
    text: 'text-warning',
  },
  active: {
    label: 'In flight',
    container: 'bg-success/15',
    text: 'text-success',
  },
  landed: { label: 'Landed', container: 'bg-muted/15', text: 'text-muted' },
  cancelled: {
    label: 'Cancelled',
    container: 'bg-danger/15',
    text: 'text-danger',
  },
  diverted: {
    label: 'Diverted',
    container: 'bg-danger/15',
    text: 'text-danger',
  },
  incident: {
    label: 'Incident',
    container: 'bg-danger/15',
    text: 'text-danger',
  },
};

type Props = {
  status: FlightStatus;
  delayMinutes?: number;
};

export function StatusBadge({ status, delayMinutes = 0 }: Props) {
  const style = STATUS_STYLES[status];
  const label =
    status === 'delayed' && delayMinutes > 0
      ? `${style.label} ${delayMinutes}m`
      : style.label;

  return (
    <View className={`self-start rounded-full px-3 py-1 ${style.container}`}>
      <Text className={`font-sans-medium text-xs ${style.text}`}>{label}</Text>
    </View>
  );
}
