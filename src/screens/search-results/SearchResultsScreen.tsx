import { useCallback, useMemo } from 'react';
import { RefreshControl, SectionList, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FlightCard } from '@/components/flights/FlightCard';
import { FlightCardSkeleton } from '@/components/flights/FlightCardSkeleton';
import { AnimatedListItem } from '@/components/ui/AnimatedListItem';
import { Button } from '@/components/ui/Button';
import type { HomeStackScreenProps } from '@/navigation/types';
import { useGetRouteTimetableQuery } from '@/store/api/flightsApi';
import type { Flight } from '@/types/flight';
import { useThemeColors } from '@/theme/useThemeColors';
import { flightDetailsParams, flightsOnDate } from '@/utils/flights';
import { formatDayLabel } from '@/utils/format';

import { SourceNotice } from './components/SourceNotice';

type LegQuery = ReturnType<typeof useGetRouteTimetableQuery>;

type Section = {
  key: string;
  title: string;
  origin: string;
  destination: string;
  date: string;
  query: LegQuery;
  data: Flight[];
};

const SKELETON_KEYS = ['a', 'b'];

export function SearchResultsScreen({
  navigation,
  route,
}: HomeStackScreenProps<'SearchResults'>) {
  const theme = useThemeColors();
  const { origin, destination, departureDate, returnDate } = route.params;

  const outbound = useGetRouteTimetableQuery({ origin, destination });
  const inbound = useGetRouteTimetableQuery(
    { origin: destination, destination: origin },
    { skip: !returnDate },
  );

  const outboundFlights = useMemo(
    () => (outbound.data ? flightsOnDate(outbound.data, departureDate) : []),
    [outbound.data, departureDate],
  );
  const inboundFlights = useMemo(
    () =>
      inbound.data && returnDate ? flightsOnDate(inbound.data, returnDate) : [],
    [inbound.data, returnDate],
  );

  const sections: Section[] = [
    {
      key: 'outbound',
      title: 'Outbound',
      origin,
      destination,
      date: departureDate,
      query: outbound,
      data: outboundFlights,
    },
  ];
  if (returnDate) {
    sections.push({
      key: 'return',
      title: 'Return',
      origin: destination,
      destination: origin,
      date: returnDate,
      query: inbound,
      data: inboundFlights,
    });
  }

  const notice = outbound.data?.notice ?? inbound.data?.notice;
  const isRefreshing =
    (outbound.isFetching && !outbound.isLoading) ||
    (inbound.isFetching && !inbound.isLoading);

  const { refetch: refetchOutbound } = outbound;
  const { refetch: refetchInbound } = inbound;
  const refresh = useCallback(() => {
    refetchOutbound();
    if (returnDate) refetchInbound();
  }, [refetchOutbound, refetchInbound, returnDate]);

  const openFlight = useCallback(
    (flight: Flight) =>
      navigation.navigate('FlightDetails', flightDetailsParams(flight)),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Flight; index: number }) => (
      <AnimatedListItem index={index}>
        <FlightCard flight={item} onPress={openFlight} />
      </AnimatedListItem>
    ),
    [openFlight],
  );

  return (
    <SectionList
      className="flex-1 bg-background"
      sections={sections}
      keyExtractor={(flight) => flight.id}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
      ListHeaderComponent={
        notice ? (
          <View className="px-4 pb-2">
            <SourceNotice message={notice} />
          </View>
        ) : null
      }
      renderSectionHeader={({ section }) => (
        <View className="flex-row items-end justify-between px-5 pb-3 pt-4">
          <View>
            <Text className="font-sans-medium text-xs uppercase tracking-widest text-primary">
              {section.title}
            </Text>
            <Text className="font-sans-bold text-lg text-foreground">
              {section.origin} → {section.destination}
            </Text>
          </View>
          <Text className="font-sans text-sm text-muted">
            {formatDayLabel(section.date)}
            {section.query.data ? ` · ${section.data.length}` : ''}
          </Text>
        </View>
      )}
      renderSectionFooter={({ section }) => <SectionStatus section={section} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
    />
  );
}

function SectionStatus({ section }: { section: Section }) {
  const { query } = section;

  if (query.isLoading) {
    return (
      <View className="gap-3">
        {SKELETON_KEYS.map((key) => (
          <FlightCardSkeleton key={key} />
        ))}
      </View>
    );
  }

  if (query.error) {
    return (
      <EmptyState
        icon={{ ios: 'wifi.exclamationmark', android: 'wifi_off' }}
        title="Couldn't load flights"
        description={
          typeof query.error === 'string'
            ? query.error
            : 'Check your connection and try again.'
        }
        action={<Button title="Try again" onPress={query.refetch} />}
      />
    );
  }

  if (query.data && section.data.length === 0) {
    return (
      <View className="mx-4 rounded-3xl bg-surface p-5">
        <Text className="text-center font-sans text-sm text-muted">
          No direct flights from {section.origin} to {section.destination}.
        </Text>
      </View>
    );
  }

  return null;
}

function Separator() {
  return <View className="h-3" />;
}
