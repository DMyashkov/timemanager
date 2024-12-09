// expandedCalendar.tsx

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { DateStruct } from "@utils/dateTimeSession";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ExpandedCalendar({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  const today = DateStruct.fromDate(new Date());

  // Start from today's month only
  const CURRENT_MONTH_INDEX = 0;

  const [currentMonthIndex, setCurrentMonthIndex] =
    useState(CURRENT_MONTH_INDEX);
  const flatListRef = useRef<FlatList>(null);

  // Generate next 24 months including current
  const months = useMemo(() => generateMonths(today, 24), [today]);

  const [focusedDate, setFocusedDate] = useState<DateStruct>(
    new DateStruct(today),
  );
  const focusedMonth = months[currentMonthIndex]?.monthStart || today;

  const goBackToToday = () => {
    setFocusedDate(new DateStruct(today));
    flatListRef.current?.scrollToIndex({
      index: CURRENT_MONTH_INDEX,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const shouldGoBackBeVisible = !focusedDate.equals(today);

  const monthNames = [
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
  ];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex !== currentMonthIndex) {
      setCurrentMonthIndex(newIndex);
    }
  };

  return (
    <View style={[styles.outer, style]}>
      <View style={styles.header}>
        <View style={styles.leftPartHeader}>
          <Text style={styles.leftHeaderText}>
            {`${monthNames[focusedMonth.month - 1]} ${focusedMonth.year}`}
          </Text>
        </View>
      </View>

      <View style={styles.week}>
        {["M", "T", "W", "T", "F", "S", "S"].map((dayName, index) => (
          <View key={`day-name-${dayName}-${index}`} style={styles.dayName}>
            <Text style={styles.dayNameText}>{dayName}</Text>
          </View>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={months}
        keyExtractor={(item) => item.monthStart.toString()}
        horizontal
        pagingEnabled={false}
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={CURRENT_MONTH_INDEX}
        removeClippedSubviews={true}
        windowSize={2}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <MonthView
              monthStart={item.monthStart}
              focusedDate={focusedDate}
              setFocusedDate={setFocusedDate}
            />
          </View>
        )}
      />
    </View>
  );
}

// Generate months starting from today going forward `count` months
function generateMonths(today: DateStruct, count: number) {
  const months = [];
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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function MonthView({
  monthStart,
  focusedDate,
  setFocusedDate,
}: {
  monthStart: DateStruct;
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct) => void;
}) {
  const styles = useStyles();
  const firstOfMonth = new DateStruct(monthStart.year, monthStart.month, 1);
  const daysInMonth = getDaysInMonth(monthStart.year, monthStart.month);

  const startDayOfWeek = firstOfMonth.getDayOfTheWeek();
  const totalDaysNeeded = daysInMonth + startDayOfWeek;
  const rowsNeeded = Math.ceil(totalDaysNeeded / 7);

  const monthGridStart = DateStruct.addDays(firstOfMonth, -startDayOfWeek);

  const totalDaysToShow = rowsNeeded * 7;
  const gridDays: DateStruct[] = [];
  for (let i = 0; i < totalDaysToShow; i++) {
    gridDays.push(DateStruct.addDays(monthGridStart, i));
  }

  const rows = [];
  for (let i = 0; i < rowsNeeded; i++) {
    const rowDays = gridDays.slice(i * 7, i * 7 + 7);
    rows.push(
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

  return <View>{rows}</View>;
}

function DayElement({
  date,
  currentMonth,
  focusedDate,
  setFocusedDate,
}: {
  date: DateStruct;
  currentMonth: number;
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct) => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const today = new Date();
  const todayStruct = DateStruct.fromDate(today);

  const isToday =
    date.year === todayStruct.year &&
    date.month === todayStruct.month &&
    date.day === todayStruct.day;

  const dateObj = new Date(date.year, date.month - 1, date.day);
  const todayObj = new Date(
    todayStruct.year,
    todayStruct.month - 1,
    todayStruct.day,
  );

  const isBeforeToday = dateObj < todayObj;
  const isFocused = focusedDate.equals(date);
  const isCurrentMonth = date.month === currentMonth;

  // Now, both today and any future day is selectable and active
  // Past days (strictly before today) are inactive
  let clickable = false;
  let textColor: string = theme.color.darkGrey; // default for past days

  if (isToday || dateObj > todayObj) {
    clickable = true;
    textColor = isFocused ? theme.color.white : theme.color.black;
  }

  // Make days outside of the current month slightly transparent
  const dayOpacity = isCurrentMonth ? 1 : 0.3;

  const onPress = () => {
    if (clickable) {
      const selectedDate = new DateStruct(date);
      setFocusedDate(selectedDate);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
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
}
