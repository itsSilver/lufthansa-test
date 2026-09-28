import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedListItem } from '@/components/ui/AnimatedListItem';
import type { HomeStackScreenProps } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/auth';
import {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  selectRecentSearches,
  type RecentSearch,
} from '@/store/slices/recentSearches';
import { useThemeColors } from '@/theme/useThemeColors';
import { addDays, toDayString } from '@/utils/dates';

import { HomeHeader } from './components/HomeHeader';
import { PopularDestinations } from './components/PopularDestinations';
import { RecentSearchItem } from './components/RecentSearchItem';
import { SearchCard } from './components/SearchCard';
import { hasErrors, validateSearch, type SearchForm } from './validation';

const DEFAULT_TRIP_OFFSET_DAYS = 7;

export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const user = useAppSelector(selectUser);
  const recentSearches = useAppSelector(selectRecentSearches);
  const today = toDayString(new Date());

  const [form, setForm] = useState<SearchForm>(() => ({
    tripType: 'round',
    origin: null,
    destination: null,
    departureDate: addDays(today, DEFAULT_TRIP_OFFSET_DAYS),
    returnDate: addDays(today, DEFAULT_TRIP_OFFSET_DAYS * 2),
  }));
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const errors = useMemo(() => validateSearch(form, today), [form, today]);
  const isSameAirport = form.origin != null && form.origin === form.destination;
  const visibleErrors = hasSubmitted
    ? errors
    : isSameAirport
      ? { destination: errors.destination }
      : {};

  const updateField = useCallback(
    <K extends keyof SearchForm>(field: K, value: SearchForm[K]) => {
      setForm((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const updateDates = useCallback(
    (departureDate: string, returnDate: string) => {
      setForm((current) => ({ ...current, departureDate, returnDate }));
    },
    [],
  );

  const swapAirports = useCallback(() => {
    setForm((current) => ({
      ...current,
      origin: current.destination,
      destination: current.origin,
    }));
  }, []);

  const submit = () => {
    setHasSubmitted(true);
    if (hasErrors(errors) || !form.origin || !form.destination) return;

    const criteria = {
      origin: form.origin,
      destination: form.destination,
      departureDate: form.departureDate,
      ...(form.tripType === 'round' ? { returnDate: form.returnDate } : {}),
    };
    dispatch(addRecentSearch(criteria));
    setHasSubmitted(false);
    navigation.navigate('SearchResults', criteria);
  };

  const prefill = useCallback((search: RecentSearch) => {
    setForm({
      tripType: search.returnDate ? 'round' : 'oneWay',
      origin: search.origin,
      destination: search.destination,
      departureDate: search.departureDate,
      returnDate: search.returnDate ?? search.departureDate,
    });
    setHasSubmitted(false);
  }, []);

  const pickDestination = useCallback(
    (code: string) => updateField('destination', code),
    [updateField],
  );

  const remove = useCallback(
    (id: string) => dispatch(removeRecentSearch(id)),
    [dispatch],
  );

  return (
    <Animated.FlatList
      style={{ flex: 1, backgroundColor: theme.background }}
      itemLayoutAnimation={LinearTransition}
      data={recentSearches}
      keyExtractor={(search) => search.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 32 }}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={
        <View className="gap-6 pb-4">
          <HomeHeader user={user} topInset={insets.top} />

          <View className="-mt-16 px-4">
            <SearchCard
              form={form}
              errors={visibleErrors}
              today={today}
              onChange={updateField}
              onDatesChange={updateDates}
              onSwap={swapAirports}
              onSubmit={submit}
            />
          </View>

          {recentSearches.length > 0 ? (
            <View className="flex-row items-center justify-between px-5 pt-2">
              <Text className="font-sans-bold text-lg text-foreground">
                Recent searches
              </Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => dispatch(clearRecentSearches())}>
                <Text className="font-sans-medium text-sm text-primary">
                  Clear
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      }
      ListFooterComponent={<PopularDestinations onSelect={pickDestination} />}
      ListEmptyComponent={
        <Text className="px-6 pt-2 text-center font-sans text-sm text-muted">
          Your recent searches will show up here
        </Text>
      }
      renderItem={({ item }) => (
        <AnimatedListItem>
          <RecentSearchItem search={item} onPress={prefill} onRemove={remove} />
        </AnimatedListItem>
      )}
    />
  );
}

function Separator() {
  return <View className="h-2" />;
}
