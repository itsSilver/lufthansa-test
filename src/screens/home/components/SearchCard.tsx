import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useThemeColors } from '@/theme/useThemeColors';

import type { SearchErrors, SearchForm } from '../validation';
import { AirportField } from './AirportField';
import { TripDates } from './TripDates';
import { TripTypeSwitch } from './TripTypeSwitch';

type Props = {
  form: SearchForm;
  errors: SearchErrors;
  today: string;
  onChange: <K extends keyof SearchForm>(
    field: K,
    value: SearchForm[K],
  ) => void;
  onDatesChange: (departureDate: string, returnDate: string) => void;
  onSwap: () => void;
  onSubmit: () => void;
};

const FIELD_HEIGHT = 64;
const FIELD_GAP = 12;
const ERROR_LINE_HEIGHT = 24;
const SWAP_SIZE = 44;

export function SearchCard({
  form,
  errors,
  today,
  onChange,
  onDatesChange,
  onSwap,
  onSubmit,
}: Props) {
  const theme = useThemeColors();
  const swapTop =
    FIELD_HEIGHT +
    (errors.origin ? ERROR_LINE_HEIGHT : 0) +
    FIELD_GAP / 2 -
    SWAP_SIZE / 2;

  return (
    <View
      className="gap-3 rounded-[32px] bg-surface p-4"
      style={{ boxShadow: '0 16px 40px rgba(20, 40, 80, 0.10)' }}>
      <TripTypeSwitch
        value={form.tripType}
        onChange={(tripType) => onChange('tripType', tripType)}
      />
      <View className="gap-3">
        <AirportField
          label="From"
          pickerTitle="Where from?"
          icon={{ ios: 'airplane.departure', android: 'flight_takeoff' }}
          value={form.origin}
          blockedCode={form.destination}
          blockedLabel="Arrival airport"
          error={errors.origin}
          onChange={(code) => onChange('origin', code)}
        />
        <AirportField
          label="To"
          pickerTitle="Where to?"
          icon={{ ios: 'airplane.arrival', android: 'flight_land' }}
          value={form.destination}
          blockedCode={form.origin}
          blockedLabel="Departure airport"
          error={errors.destination}
          onChange={(code) => onChange('destination', code)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Swap origin and destination"
          onPress={onSwap}
          style={{
            top: swapTop,
            boxShadow: '0 6px 16px rgba(20, 40, 80, 0.18)',
          }}
          className="absolute right-6 z-10 h-11 w-11 items-center justify-center rounded-full bg-surface active:opacity-80">
          <Icon
            name={{ ios: 'arrow.up.arrow.down', android: 'swap_vert' }}
            color={theme.foreground}
            size={18}
          />
        </Pressable>
      </View>

      <TripDates
        form={form}
        errors={errors}
        today={today}
        onChange={onDatesChange}
      />

      <Button
        title="Search Flight"
        icon={{ ios: 'magnifyingglass', android: 'search' }}
        iconPosition="leading"
        onPress={onSubmit}
      />
    </View>
  );
}
