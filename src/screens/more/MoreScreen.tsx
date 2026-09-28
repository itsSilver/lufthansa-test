import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import type {
  MoreStackParamList,
  MoreStackScreenProps,
} from '@/navigation/types';
import { useThemeColors } from '@/theme/useThemeColors';

type MenuItem = {
  route: Exclude<keyof MoreStackParamList, 'More'>;
  icon: IconName;
};

const menuItems: MenuItem[] = [
  { route: 'Settings', icon: { ios: 'gearshape', android: 'settings' } },
  { route: 'Help', icon: { ios: 'questionmark.circle', android: 'help' } },
  { route: 'About', icon: { ios: 'info.circle', android: 'info' } },
  { route: 'Contact', icon: { ios: 'envelope', android: 'mail' } },
];

export function MoreScreen({ navigation }: MoreStackScreenProps<'More'>) {
  const theme = useThemeColors();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4">
      <View className="overflow-hidden rounded-3xl bg-surface">
        {menuItems.map(({ route, icon }, index) => (
          <Pressable
            key={route}
            accessibilityRole="button"
            onPress={() => navigation.navigate(route)}
            className={`flex-row items-center gap-4 px-4 py-4 active:bg-border/40 ${
              index > 0 ? 'border-t border-border/60' : ''
            }`}>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
              <Icon name={icon} color={theme.primary} size={20} />
            </View>
            <Text className="flex-1 font-sans-medium text-base text-foreground">
              {route}
            </Text>
            <Icon
              name={{ ios: 'chevron.right', android: 'chevron_right' }}
              color={theme.muted}
              size={16}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
