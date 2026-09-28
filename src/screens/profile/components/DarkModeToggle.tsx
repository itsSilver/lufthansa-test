import { useColorScheme } from 'nativewind';
import { Switch, Text, View } from 'react-native';

import { useAppDispatch } from '@/store/hooks';
import { setThemeMode } from '@/store/slices/settings';
import { palette } from '@/theme/colors';
import { useThemeColors } from '@/theme/useThemeColors';

export function DarkModeToggle() {
  const dispatch = useAppDispatch();
  const theme = useThemeColors();
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-surface px-4 py-3">
      <Text className="font-sans-medium text-base text-foreground">
        Dark mode
      </Text>
      <Switch
        accessibilityLabel="Dark mode"
        value={colorScheme === 'dark'}
        onValueChange={(value) => {
          dispatch(setThemeMode(value ? 'dark' : 'light'));
        }}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor={palette.white}
        ios_backgroundColor={theme.border}
      />
    </View>
  );
}
