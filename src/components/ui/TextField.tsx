import { useState, type ReactNode, type Ref } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';

type Props = TextInputProps & {
  label: string;
  error?: string;
  trailing?: ReactNode;
  ref?: Ref<TextInput>;
};

export function TextField({
  label,
  error,
  trailing,
  ref,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const theme = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? 'border-danger'
    : isFocused
      ? 'border-primary'
      : 'border-border';

  return (
    <View className="gap-2">
      <Text className="px-1 font-sans-medium text-sm text-foreground">
        {label}
      </Text>
      <View
        className={`h-14 flex-row items-center gap-2 rounded-2xl border bg-surface px-4 ${borderColor}`}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={theme.muted}
          className="h-full flex-1 py-0 font-sans text-base text-foreground"
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {trailing}
      </View>
      {error ? (
        <Text className="px-1 font-sans text-sm text-danger">{error}</Text>
      ) : null}
    </View>
  );
}
