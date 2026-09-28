import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  label: string;
  icon: IconName;
  accessibilityLabel: string;
  error?: string;
  isActive?: boolean;
  onPress: () => void;
  children: ReactNode;
};

export function FieldPill({
  label,
  icon,
  accessibilityLabel,
  error,
  isActive = false,
  onPress,
  children,
}: Props) {
  const theme = useThemeColors();

  const border = error
    ? 'border-danger'
    : isActive
      ? 'border-primary/60 bg-primary/10'
      : 'border-transparent';

  return (
    <View className="gap-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={`h-16 flex-row items-center rounded-full border bg-field pl-5 pr-4 active:opacity-80 ${border}`}>
        <Icon
          name={icon}
          color={isActive ? theme.primary : theme.muted}
          size={20}
        />
        <View className="mx-3 h-7 w-px bg-border" />
        <View className="flex-1">
          <Text className="font-sans text-xs text-muted">{label}</Text>
          {children}
        </View>
      </Pressable>
      {error ? (
        <Text className="px-5 font-sans text-sm text-danger">{error}</Text>
      ) : null}
    </View>
  );
}
