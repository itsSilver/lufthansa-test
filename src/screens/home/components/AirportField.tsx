import { useState } from 'react';
import { Text } from 'react-native';

import type { IconName } from '@/components/ui/Icon';
import { findAirport } from '@/data/airports';
import type { Airport } from '@/types/flight';

import { AirportPickerModal } from './AirportPickerModal';
import { FieldPill } from './FieldPill';

type Props = {
  label: string;
  pickerTitle: string;
  icon: IconName;
  value: string | null;
  blockedCode: string | null;
  blockedLabel: string;
  error?: string;
  onChange: (code: string) => void;
};

export function AirportField({
  label,
  pickerTitle,
  icon,
  value,
  blockedCode,
  blockedLabel,
  error,
  onChange,
}: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const airport = value ? findAirport(value) : undefined;

  const select = (selected: Airport) => {
    setIsPickerOpen(false);
    onChange(selected.code);
  };

  return (
    <>
      <FieldPill
        label={label}
        icon={icon}
        error={error}
        isActive={isPickerOpen}
        accessibilityLabel={`${label}: ${airport ? `${airport.city}, ${airport.code}` : 'not selected'}`}
        onPress={() => setIsPickerOpen(true)}>
        {airport ? (
          <Text
            numberOfLines={1}
            className="font-sans-medium text-base text-foreground">
            {airport.city}{' '}
            <Text className="font-sans text-muted">{airport.code}</Text>
          </Text>
        ) : (
          <Text className="font-sans text-base text-muted">Select airport</Text>
        )}
      </FieldPill>

      <AirportPickerModal
        visible={isPickerOpen}
        title={pickerTitle}
        selectedCode={value}
        blocked={
          blockedCode ? { code: blockedCode, label: blockedLabel } : undefined
        }
        onSelect={select}
        onClose={() => setIsPickerOpen(false)}
      />
    </>
  );
}
