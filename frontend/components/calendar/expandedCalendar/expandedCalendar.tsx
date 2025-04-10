// expandedCalendar.tsx

import React, {
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { DateStruct } from "@utils/dateTimeSession";

// Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const TOTAL_MONTHS = 24;
const INITIAL_NUM_TO_RENDER = 1;
const MAX_TO_RENDER_PER_BATCH = 2;
const WINDOW_SIZE = 3;
const SCROLL_DEBOUNCE_DELAY = 100; // milliseconds

export interface ExpandedCalendarRef {
  goToDate: (date: DateStruct) => void;
  getFocusedDate: () => DateStruct;
}

interface MonthItem {
  monthStart: DateStruct;
}

const ExpandedCalendar = forwardRef<ExpandedCalendarRef, { style?: object }>(
  ({ style = {} }, ref) => {
    const styles = useStyles();
    const { theme } = useTheme();

    const today = useMemo(() => DateStruct.fromDate(new Date()), []);
    const CURRENT_MONTH_INDEX = 0;

    const [currentMonthIndex, setCurrentMonthIndex] =
      useState<number>(CURRENT_MONTH_INDEX);
    const [focusedDate, setFocusedDate] = useState<DateStruct>(
      new DateStruct(today),
    );

    const flatListRef = useRef<FlatList<MonthItem>>(null);

    // Generate months once
    const months = useMemo(() => generateMonths(today, TOTAL_MONTHS), [today]);

    const focusedMonth = useMemo(
      () => months[currentMonthIndex]?.monthStart || today,
      [months, currentMonthIndex, today],
    );

    const monthNames = useMemo(
      () => [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      [],
    );

    // Handlers

    const goToDate = useCallback(
      (date: DateStruct) => {
        const targetMonthIndex = months.findIndex(
          (month) =>
            month.monthStart.year === date.year &&
            month.monthStart.month === date.month,
        );

        if (targetMonthIndex !== -1) {
          setFocusedDate(new DateStruct(date));
          setCurrentMonthIndex(targetMonthIndex);
          flatListRef.current?.scrollToIndex({
            index: targetMonthIndex,
            animated: true,
            viewPosition: 0.5,
          });
        } else {
          console.warn("Date is outside the range of the generated months");
        }
      },
      [months],
    );

    const getFocusedDate = useCallback(() => focusedDate, [focusedDate]);

    useImperativeHandle(ref, () => ({
      goToDate,
      getFocusedDate,
    }));

    // Scroll Handler with Debounce
    const debounce = useCallback(
      (func: (offsetX: number) => void, delay: number) => {
        let timer: NodeJS.Timeout;
        return (offsetX: number) => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            func(offsetX);
          }, delay);
        };
      },
      [],
    );

    const handleScroll = useCallback(
      debounce((offsetX: number) => {
        const newIndex = Math.round(offsetX / SCREEN_WIDTH);
        if (
          newIndex !== currentMonthIndex &&
          newIndex >= 0 &&
          newIndex < months.length
        ) {
          setCurrentMonthIndex(newIndex);
        }
      }, SCROLL_DEBOUNCE_DELAY),
      [currentMonthIndex, months.length, debounce],
    );

    // Render Functions

    const renderCalendarItem = useCallback(
      ({ item }: { item: MonthItem }) => (
        <View style={monthViewStyle}>
          <MonthView
            monthStart={item.monthStart}
            focusedDate={focusedDate}
            setFocusedDate={setFocusedDate}
          />
        </View>
      ),
      [focusedDate],
    );

    // Memoized Styles
    const monthViewStyle = useMemo(() => ({ width: SCREEN_WIDTH }), []);

    // Key Extractor
    const keyExtractor = useCallback(
      (item: MonthItem) => `${item.monthStart.year}-${item.monthStart.month}`,
      [],
    );

    return (
      <View style={[styles.outer, style]}>
        <Header focusedMonth={focusedMonth} monthNames={monthNames} />
        <WeekRow />

        <FlatList
          ref={flatListRef}
          data={months}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled={false}
          snapToAlignment="center"
          snapToInterval={SCREEN_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={CURRENT_MONTH_INDEX}
          initialNumToRender={INITIAL_NUM_TO_RENDER}
          maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
          windowSize={WINDOW_SIZE}
          removeClippedSubviews={true}
          onScroll={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            handleScroll(offsetX);
          }}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          renderItem={renderCalendarItem}
        />
      </View>
    );
  },
);

export default ExpandedCalendar;

// -----------------------
// Helper Functions
// -----------------------

// Generate months starting from today going forward `count` months
function generateMonths(today: DateStruct, count: number): MonthItem[] {
  const months: MonthItem[] = [];
  for (let i = 0; i < count; i++) {
    const monthDate = shiftMonth(today, i);
    months.push({ monthStart: monthDate });
  }
  return months;
}

function shiftMonth(date: DateStruct, shift: number): DateStruct {
  let newYear = date.year;
  let newMonth = date.month + shift;

  while (newMonth > 12) {
    newMonth -= 12;
    newYear += 1;
  }

  const daysInMonth = getDaysInMonth(newYear, newMonth);
  const newDay = Math.min(date.day, daysInMonth);

  return new DateStruct(newYear, newMonth, newDay);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// -----------------------
// Memoized Components
// -----------------------

// Header Component
interface HeaderProps {
  focusedMonth: DateStruct;
  monthNames: string[];
}

const Header: React.FC<HeaderProps> = React.memo(
  ({ focusedMonth, monthNames }) => {
    const styles = useStyles();

    return (
      <View style={styles.header}>
        <View style={styles.leftPartHeader}>
          <Text style={styles.leftHeaderText}>
            {`${monthNames[focusedMonth.month - 1]} ${focusedMonth.year}`}
          </Text>
        </View>
      </View>
    );
  },
);

// WeekRow Component
const WeekRow: React.FC = React.memo(() => {
  const styles = useStyles();
  const weekDays = useMemo(() => ["M", "T", "W", "T", "F", "S", "S"], []);

  return (
    <View style={styles.week}>
      {weekDays.map((dayName, index) => (
        <View key={`day-name-${dayName}-${index}`} style={styles.dayName}>
          <Text style={styles.dayNameText}>{dayName}</Text>
        </View>
      ))}
    </View>
  );
});

// MonthView Component
interface MonthViewProps {
  monthStart: DateStruct;
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct | null) => void;
}

const MonthView: React.FC<MonthViewProps> = React.memo(
  ({ monthStart, focusedDate, setFocusedDate }) => {
    const styles = useStyles();
    const firstOfMonth = useMemo(
      () => new DateStruct(monthStart.year, monthStart.month, 1),
      [monthStart],
    );
    const daysInMonth = useMemo(
      () => getDaysInMonth(monthStart.year, monthStart.month),
      [monthStart],
    );

    const startDayOfWeek = useMemo(
      () => firstOfMonth.getDayOfTheWeek(),
      [firstOfMonth],
    );
    const totalDaysNeeded = useMemo(
      () => daysInMonth + startDayOfWeek,
      [daysInMonth, startDayOfWeek],
    );
    const rowsNeeded = useMemo(
      () => Math.ceil(totalDaysNeeded / 7),
      [totalDaysNeeded],
    );

    const monthGridStart = useMemo(
      () => DateStruct.addDays(firstOfMonth, -startDayOfWeek),
      [firstOfMonth, startDayOfWeek],
    );

    const totalDaysToShow = useMemo(() => rowsNeeded * 7, [rowsNeeded]);

    const gridDays: DateStruct[] = useMemo(() => {
      const days: DateStruct[] = [];
      for (let i = 0; i < totalDaysToShow; i++) {
        days.push(DateStruct.addDays(monthGridStart, i));
      }
      return days;
    }, [monthGridStart, totalDaysToShow]);

    const rows = useMemo(() => {
      const tempRows: JSX.Element[] = [];
      for (let i = 0; i < rowsNeeded; i++) {
        const rowDays = gridDays.slice(i * 7, i * 7 + 7);
        tempRows.push(
          <View
            key={`row-${rowDays[0].toString()}-${rowDays[6].toString()}`}
            style={styles.week}
          >
            {rowDays.map((date) => (
              <DayElement
                key={`dayElement-${monthStart.toString()}-${date.toString()}`}
                date={date}
                currentMonth={monthStart.month}
                focusedDate={focusedDate}
                setFocusedDate={setFocusedDate}
              />
            ))}
          </View>,
        );
      }
      return tempRows;
    }, [
      gridDays,
      rowsNeeded,
      styles.week,
      monthStart,
      focusedDate,
      setFocusedDate,
    ]);

    return <View>{rows}</View>;
  },
  (prevProps, nextProps) =>
    prevProps.monthStart.equals(nextProps.monthStart) &&
    prevProps.focusedDate.equals(nextProps.focusedDate),
);

// DayElement Component
interface DayElementProps {
  date: DateStruct;
  currentMonth: number;
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct) => void;
}

const DayElement: React.FC<DayElementProps> = React.memo(
  ({ date, currentMonth, focusedDate, setFocusedDate }) => {
    const styles = useStyles();
    const { theme } = useTheme();

    const today = useMemo(() => DateStruct.fromDate(new Date()), []);
    const isToday = useMemo(
      () =>
        date.year === today.year &&
        date.month === today.month &&
        date.day === today.day,
      [date, today],
    );

    const dateObj = useMemo(
      () => new Date(date.year, date.month - 1, date.day),
      [date],
    );
    const todayObj = useMemo(
      () => new Date(today.year, today.month - 1, today.day),
      [today],
    );

    const isFocused = useMemo(
      () => focusedDate.equals(date),
      [focusedDate, date],
    );
    const isCurrentMonth = useMemo(
      () => date.month === currentMonth,
      [date, currentMonth],
    );

    // Determine if the day is clickable
    const { clickable, textColor } = useMemo(() => {
      if (isToday || dateObj > todayObj) {
        return {
          clickable: true,
          textColor: isFocused ? theme.color.white : theme.color.black,
        };
      }
      return {
        clickable: false,
        textColor: theme.color.darkGrey,
      };
    }, [isToday, dateObj, todayObj, isFocused, theme.color]);

    // Opacity for days outside the current month
    const dayOpacity = useMemo(
      () => (isCurrentMonth ? 1 : 0.3),
      [isCurrentMonth],
    );

    const handlePress = useCallback(() => {
      if (clickable) {
        const selectedDate = new DateStruct(date);
        setFocusedDate(selectedDate);
      }
    }, [clickable, date, setFocusedDate]);

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        <View
          style={[
            styles.outerDateDay,
            {
              backgroundColor:
                isFocused && clickable ? theme.color.red : "transparent",
              opacity: dayOpacity,
            },
          ]}
        >
          <Text
            style={[
              styles.textDay,
              {
                color: textColor,
                fontFamily:
                  theme.font[isFocused && clickable ? "medium" : "regular"],
              },
            ]}
          >
            {date.day}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.date.equals(nextProps.date) &&
    prevProps.currentMonth === nextProps.currentMonth &&
    prevProps.focusedDate.equals(nextProps.focusedDate),
);
