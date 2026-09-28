import { useState } from 'react';
import { Text, View } from 'react-native';

import { formatDayLabel } from '@/utils/format';

import type { SearchErrors, SearchForm } from '../validation';
import { FieldPill } from './FieldPill';
import { TripDatesSheet } from './TripDatesSheet';

type Props = {
  form: SearchForm;
  errors: SearchErrors;
  today: string;
  onChange: (departureDate: string, returnDate: string) => void;
};

const calendarIcon = { ios: 'calendar', android: 'calendar_today' } as const;

export function TripDates({ form, errors, today, onChange }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isRoundTrip = form.tripType === 'round';
  const open = () => setIsSheetOpen(true);

  return (
    <>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <FieldPill
            label="Departure"
            icon={calendarIcon}
            error={errors.departureDate}
            isActive={isSheetOpen}
            accessibilityLabel={`Departure: ${formatDayLabel(form.departureDate)}`}
            onPress={open}>
            <Text className="font-sans-medium text-base text-foreground">
              {formatDayLabel(form.departureDate)}
            </Text>
          </FieldPill>
        </View>
        {isRoundTrip ? (
          <View className="flex-1">
            <FieldPill
              label="Return"
              icon={calendarIcon}
              error={errors.returnDate}
              isActive={isSheetOpen}
              accessibilityLabel={`Return: ${formatDayLabel(form.returnDate)}`}
              onPress={open}>
              <Text className="font-sans-medium text-base text-foreground">
                {formatDayLabel(form.returnDate)}
              </Text>
            </FieldPill>
          </View>
        ) : null}
      </View>

      {isSheetOpen ? (
        <TripDatesSheet
          tripType={form.tripType}
          departureDate={form.departureDate}
          returnDate={form.returnDate}
          minimumDate={today}
          onConfirm={(departureDate, returnDate) => {
            setIsSheetOpen(false);
            onChange(departureDate, returnDate);
          }}
          onClose={() => setIsSheetOpen(false)}
        />
      ) : null}
    </>
  );
}
