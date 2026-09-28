import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  const theme = useThemeColors();

  return (
    <View className="items-center gap-3 px-8 pt-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/15">
        <Icon name={icon} color={theme.primary} size={28} />
      </View>
      <Text className="text-center font-sans-bold text-lg text-foreground">
        {title}
      </Text>
      <Text className="text-center font-sans text-sm leading-5 text-muted">
        {description}
      </Text>
      {action ? <View className="mt-3 w-full">{action}</View> : null}
    </View>
  );
}
