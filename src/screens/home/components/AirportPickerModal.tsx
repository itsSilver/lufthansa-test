import { useDeferredValue, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { searchAirports } from '@/data/airports';
import type { Airport } from '@/types/flight';
import { ThemeScope } from '@/theme/ThemeScope';
import { useThemeColors } from '@/theme/useThemeColors';
import { countryFlag } from '@/utils/flags';

type Props = {
  visible: boolean;
  title: string;
  selectedCode: string | null;
  blocked?: { code: string; label: string };
  onSelect: (airport: Airport) => void;
  onClose: () => void;
};

const webInputReset = Platform.OS === 'web' ? { outlineWidth: 0 } : null;

export function AirportPickerModal({
  visible,
  title,
  selectedCode,
  blocked,
  onSelect,
  onClose,
}: Props) {
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => searchAirports(deferredQuery), [deferredQuery]);
  const lastIndex = results.length - 1;

  const close = () => {
    setQuery('');
    onClose();
  };

  const select = (airport: Airport) => {
    setQuery('');
    onSelect(airport);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={close}>
      <ThemeScope
        className="flex-1 bg-background"
        style={{ paddingTop: Platform.OS === 'ios' ? 8 : insets.top + 8 }}>
        {Platform.OS === 'ios' ? (
          <View className="mb-2 h-1.5 w-10 self-center rounded-full bg-border" />
        ) : null}

        <View className="flex-row items-center justify-between px-5 pb-4 pt-2">
          <Text
            maxFontSizeMultiplier={1.3}
            className="font-sans-bold text-2xl text-foreground">
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={8}
            onPress={close}
            className="h-9 w-9 items-center justify-center rounded-full bg-surface active:opacity-70">
            <Icon
              name={{ ios: 'xmark', android: 'close' }}
              color={theme.foreground}
              size={14}
            />
          </Pressable>
        </View>

        <View className="mx-4 mb-3 h-12 flex-row items-center gap-2 rounded-full bg-surface px-4">
          <Icon
            name={{ ios: 'magnifyingglass', android: 'search' }}
            color={theme.muted}
            size={18}
          />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="City, airport or code"
            placeholderTextColor={theme.muted}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search airports"
            selectionColor={theme.primary}
            style={webInputReset}
            className="h-full flex-1 py-0 font-sans text-base text-foreground"
          />
          {query ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
              onPress={() => setQuery('')}>
              <Icon
                name={{ ios: 'xmark.circle.fill', android: 'cancel' }}
                color={theme.muted}
                size={18}
              />
            </Pressable>
          ) : null}
        </View>

        <FlatList
          data={results}
          keyExtractor={(airport) => airport.code}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          ListHeaderComponent={
            <Text className="px-6 pb-2 pt-2 font-sans-medium text-xs uppercase tracking-widest text-muted">
              {query ? 'Results' : 'Popular airports'}
            </Text>
          }
          ListEmptyComponent={
            <View className="items-center gap-3 px-8 pt-16">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-surface">
                <Icon
                  name={{ ios: 'airplane', android: 'flight' }}
                  color={theme.muted}
                  size={24}
                />
              </View>
              <Text className="font-sans-medium text-base text-foreground">
                No airports found
              </Text>
              <Text className="text-center font-sans text-sm text-muted">
                Try a city name, an airport or a 3-letter code
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isSelected = item.code === selectedCode;
            const isBlocked = item.code === blocked?.code;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                  disabled: isBlocked,
                }}
                accessibilityLabel={`${item.city}, ${item.name}, ${item.code}${
                  isBlocked
                    ? `, already your ${blocked.label.toLowerCase()}`
                    : ''
                }`}
                disabled={isBlocked}
                onPress={() => select(item)}
                className={`mx-4 flex-row items-center gap-3 bg-surface px-4 py-3 active:opacity-70 ${
                  index === 0 ? 'rounded-t-3xl' : 'border-t border-border/50'
                } ${index === lastIndex ? 'rounded-b-3xl' : ''} ${
                  isBlocked ? 'opacity-40' : ''
                }`}>
                <View
                  className={`h-11 w-14 items-center justify-center rounded-2xl ${
                    isSelected ? 'bg-primary' : 'bg-primary/10'
                  }`}>
                  <Text
                    className={`font-sans-bold text-sm tracking-wider ${
                      isSelected ? 'text-primary-foreground' : 'text-primary'
                    }`}>
                    {item.code}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="font-sans-medium text-base text-foreground">
                    {item.city}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="font-sans text-sm text-muted">
                    {item.name}
                  </Text>
                </View>
                {isBlocked ? (
                  <View className="rounded-full bg-field px-2.5 py-1">
                    <Text className="font-sans-medium text-xs text-muted">
                      {blocked.label}
                    </Text>
                  </View>
                ) : isSelected ? (
                  <Icon
                    name={{ ios: 'checkmark', android: 'check' }}
                    color={theme.primary}
                    size={16}
                  />
                ) : (
                  <Text className="text-xl">{countryFlag(item.country)}</Text>
                )}
              </Pressable>
            );
          }}
        />
      </ThemeScope>
    </Modal>
  );
}
