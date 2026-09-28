import { Pressable, Text, View } from 'react-native';

import type { TripType } from '../validation';

const OPTIONS: { value: TripType; label: string }[] = [
  { value: 'round', label: 'Round trip' },
  { value: 'oneWay', label: 'One way' },
];

type Props = {
  value: TripType;
  onChange: (value: TripType) => void;
};

export function TripTypeSwitch({ value, onChange }: Props) {
  return (
    <View
      accessibilityRole="radiogroup"
      className="flex-row self-start rounded-full bg-field p-1">
      {OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            onPress={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : ''}`}>
            <Text
              className={`font-sans-medium text-sm ${
                isSelected ? 'text-primary-foreground' : 'text-muted'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
