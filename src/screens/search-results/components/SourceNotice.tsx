import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useThemeColors } from '@/theme/useThemeColors';

export function SourceNotice({ message }: { message: string }) {
  const theme = useThemeColors();

  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-warning/15 px-4 py-3">
      <Icon
        name={{ ios: 'info.circle', android: 'info' }}
        color={theme.warning}
        size={18}
      />
      <Text className="flex-1 font-sans text-sm text-foreground">
        {message}
      </Text>
    </View>
  );
}
