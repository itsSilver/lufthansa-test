import dayjs from 'dayjs';
import { useColorScheme } from 'nativewind';
import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import DateTimePicker, {
  useDefaultStyles,
  type DateType,
} from 'react-native-ui-datepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { ThemeScope } from '@/theme/ThemeScope';
import { palette } from '@/theme/colors';
import { useThemeColors } from '@/theme/useThemeColors';
import { fromUtcDate, toUtcMidnight } from '@/utils/dates';
import { formatDayLabel } from '@/utils/format';

import type { TripType } from '../validation';

type Props = {
  tripType: TripType;
  departureDate: string;
  returnDate: string;
  minimumDate: string;
  onConfirm: (departureDate: string, returnDate: string) => void;
  onClose: () => void;
};

type Styles = ReturnType<typeof useDefaultStyles>;

const toDay = (value: DateType) =>
  value ? fromUtcDate(dayjs(value).valueOf()) : null;

const circle = { borderRadius: 999 };
const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
};

export function TripDatesSheet({
  tripType,
  departureDate,
  returnDate,
  minimumDate,
  onConfirm,
  onClose,
}: Props) {
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const defaultStyles = useDefaultStyles(colorScheme);
  const isRoundTrip = tripType === 'round';

  const [start, setStart] = useState<string | null>(departureDate);
  const [end, setEnd] = useState<string | null>(returnDate);

  const styles = useMemo<Styles>(() => {
    const selectedLabel = { color: palette.white, fontFamily: fonts.bold };

    return {
      ...defaultStyles,
      header: { paddingBottom: 12 },
      month_selector_label: {
        color: theme.foreground,
        fontFamily: fonts.bold,
        fontSize: 17,
      },
      year_selector_label: {
        color: theme.foreground,
        fontFamily: fonts.bold,
        fontSize: 17,
      },
      button_prev_image: { tintColor: theme.foreground },
      button_next_image: { tintColor: theme.foreground },
      weekday_label: {
        color: theme.muted,
        fontFamily: fonts.medium,
        fontSize: 12,
        textTransform: 'uppercase',
      },
      day: circle,
      day_label: { color: theme.foreground, fontFamily: fonts.medium },
      today: { ...circle, borderWidth: 1, borderColor: theme.primary },
      today_label: { color: theme.primary, fontFamily: fonts.bold },
      selected: { ...circle, backgroundColor: theme.primary },
      selected_label: selectedLabel,
      range_start: { ...circle, backgroundColor: theme.primary },
      range_start_label: selectedLabel,
      range_end: { ...circle, backgroundColor: theme.primary },
      range_end_label: selectedLabel,
      range_fill: { backgroundColor: `${theme.primary}26` },
      range_middle_label: { color: theme.foreground },
      disabled: { opacity: 0.3 },
      disabled_label: { color: theme.muted },
      outside_label: { color: theme.muted },
      month_label: { color: theme.foreground, fontFamily: fonts.medium },
      year_label: { color: theme.foreground, fontFamily: fonts.medium },
      selected_month: { ...circle, backgroundColor: theme.primary },
      selected_month_label: selectedLabel,
      selected_year: { ...circle, backgroundColor: theme.primary },
      selected_year_label: selectedLabel,
    };
  }, [defaultStyles, theme]);

  const canConfirm = start != null && (!isRoundTrip || end != null);

  const confirm = () => {
    if (!start) return;
    onConfirm(start, isRoundTrip && end ? end : start);
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <ThemeScope className="flex-1">
        <Pressable
          accessibilityLabel="Close calendar"
          onPress={onClose}
          className="flex-1 justify-end bg-black/50">
          <Pressable
            onPress={() => {}}
            className="gap-4 rounded-t-[32px] bg-surface px-5 pt-3"
            style={{ paddingBottom: insets.bottom + 16 }}>
            <View className="h-1.5 w-10 self-center rounded-full bg-border" />

            <View className="flex-row gap-3">
              <DateSummary
                label="Departure"
                value={start}
                isActive={!isRoundTrip || end != null || start == null}
              />
              {isRoundTrip ? (
                <DateSummary
                  label="Return"
                  value={end}
                  isActive={start != null && end == null}
                />
              ) : null}
            </View>

            {isRoundTrip ? (
              <DateTimePicker
                mode="range"
                startDate={start ? toUtcMidnight(start) : undefined}
                endDate={end ? toUtcMidnight(end) : undefined}
                minDate={toUtcMidnight(minimumDate)}
                timeZone="UTC"
                firstDayOfWeek={1}
                allowRangeReset
                weekdaysFormat="short"
                styles={styles}
                onChange={({ startDate, endDate }) => {
                  setStart(toDay(startDate));
                  setEnd(toDay(endDate));
                }}
              />
            ) : (
              <DateTimePicker
                mode="single"
                date={start ? toUtcMidnight(start) : undefined}
                minDate={toUtcMidnight(minimumDate)}
                timeZone="UTC"
                firstDayOfWeek={1}
                weekdaysFormat="short"
                styles={styles}
                onChange={({ date }) => setStart(toDay(date))}
              />
            )}

            <Button
              title={
                canConfirm
                  ? 'Confirm dates'
                  : isRoundTrip && start
                    ? 'Pick a return date'
                    : 'Pick a date'
              }
              disabled={!canConfirm}
              onPress={confirm}
            />
          </Pressable>
        </Pressable>
      </ThemeScope>
    </Modal>
  );
}

function DateSummary({
  label,
  value,
  isActive,
}: {
  label: string;
  value: string | null;
  isActive: boolean;
}) {
  return (
    <View
      className={`flex-1 rounded-2xl border px-4 py-3 ${
        isActive ? 'border-primary bg-primary/10' : 'border-border bg-field'
      }`}>
      <Text className="font-sans text-xs text-muted">{label}</Text>
      <Text className="font-sans-bold text-base text-foreground">
        {value ? formatDayLabel(value) : 'Select date'}
      </Text>
    </View>
  );
}
