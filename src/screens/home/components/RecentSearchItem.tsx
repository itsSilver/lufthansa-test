import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import type { RecentSearch } from '@/store/slices/recentSearches';
import { useThemeColors } from '@/theme/useThemeColors';
import {
  formatRecentSearch,
  formatRoute,
  formatSearchDates,
} from '@/utils/format';

type Props = {
  search: RecentSearch;
  onPress: (search: RecentSearch) => void;
  onRemove: (id: string) => void;
};

export const RecentSearchItem = memo(function RecentSearchItem({
  search,
  onPress,
  onRemove,
}: Props) {
  const theme = useThemeColors();

  return (
    <View className="mx-4 flex-row items-center rounded-2xl bg-surface">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Search again: ${formatRecentSearch(search)}`}
        onPress={() => onPress(search)}
        className="flex-1 flex-row items-center gap-3 py-3 pl-4 active:opacity-70">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
          <Icon
            name={{ ios: 'clock.arrow.circlepath', android: 'history' }}
            color={theme.primary}
            size={18}
          />
        </View>
        <View className="flex-1">
          <Text className="font-sans-medium text-base text-foreground">
            {formatRoute(search)}
          </Text>
          <Text className="font-sans text-sm text-muted">
            {formatSearchDates(search)}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${formatRecentSearch(search)}`}
        hitSlop={8}
        onPress={() => onRemove(search.id)}
        className="px-4 py-3 active:opacity-70">
        <Icon
          name={{ ios: 'xmark', android: 'close' }}
          color={theme.muted}
          size={14}
        />
      </Pressable>
    </View>
  );
});
