import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { palette } from '@/theme/colors';
import { useThemeColors } from '@/theme/useThemeColors';

import { Icon, type IconName } from './Icon';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
}: Props) {
  const theme = useThemeColors();
  const isPrimary = variant === 'primary';
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      className={`h-14 flex-row items-center justify-center rounded-full px-16 active:opacity-80 ${
        isPrimary ? 'bg-primary' : 'border border-border bg-surface'
      } ${disabled ? 'opacity-50' : ''}`}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? theme['primary-foreground'] : theme.foreground}
        />
      ) : (
        <Text
          className={`font-sans-medium text-base ${
            isPrimary ? 'text-primary-foreground' : 'text-foreground'
          }`}>
          {title}
        </Text>
      )}
      {icon && !loading ? (
        <View className="absolute right-1.5 top-1.5 h-11 w-11 items-center justify-center rounded-full bg-white">
          <Icon name={icon} color={palette.black} size={20} />
        </View>
      ) : null}
    </Pressable>
  );
}
