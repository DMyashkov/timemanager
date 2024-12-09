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

  // Current date
  const today = DateStruct.fromDate(new Date());

  // We store a large range of months around the current date
  const CURRENT_MONTH_INDEX = 120;

  const [currentMonthIndex, setCurrentMonthIndex] =
    useState(CURRENT_MONTH_INDEX);
  const flatListRef = useRef<FlatList>(null);

  const months = useMemo(
    () => generateMonths(today, CURRENT_MONTH_INDEX),
    [today],
  );

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
          {shouldGoBackBeVisible && (
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={goBackToToday}
              activeOpacity={1}
            >
              <Text style={styles.goBackText}>{today.day}</Text>
            </TouchableOpacity>
          )}
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

// Generate a range of months around `today`
function generateMonths(today: DateStruct, currentIndex: number) {
  const months = [];
  const totalMonths = currentIndex * 2;
  const startMonthDate = shiftMonth(today, -currentIndex);
  for (let i = 0; i < totalMonths; i++) {
    const monthDate = shiftMonth(startMonthDate, i);
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

  while (newMonth < 1) {
    newMonth += 12;
    newYear -= 1;
  }

  const daysInMonth = getDaysInMonth(newYear, newMonth);
  // Adjust the day if it exceeds the number of days in that month
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

  // Monday=0,... Sunday=6
  const startDayOfWeek = firstOfMonth.getDayOfTheWeek();
  // total days including previous month's days shown in the first row
  const totalDaysNeeded = daysInMonth + startDayOfWeek;
  const rowsNeeded = Math.ceil(totalDaysNeeded / 7); // between 4 and 6 typically

  // The first date displayed in the grid is `firstOfMonth - startDayOfWeek` days
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
  const isToday =
    date.day === today.getDate() &&
    date.month === today.getMonth() + 1 &&
    date.year === today.getFullYear();

  const isFocused = focusedDate.equals(date);
  const isCurrentMonth = date.month === currentMonth;

  const dateObj = new Date(date.year, date.month - 1, date.day);
  const isBeforeToday =
    dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isAfterToday = !isToday && !isBeforeToday;

  let textColor: string;
  if (isFocused) {
    textColor = theme.color.white;
  } else if (isAfterToday) {
    textColor = theme.color.darkGrey;
  } else {
    textColor = theme.color.black;
  }

  // Make days outside of the current month more transparent
  const dayOpacity = isCurrentMonth ? 1 : 0.3;

  const onPress = () => {
    const todayStruct = DateStruct.fromDate(new Date());
    const selectedDate = new DateStruct(date);
    if (selectedDate.isSameOrBefore(todayStruct)) {
      setFocusedDate(selectedDate);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View
        style={[
          styles.outerDateDay,
          {
            backgroundColor: isFocused ? theme.color.red : "transparent",
            opacity: dayOpacity,
          },
        ]}
      >
        <Text
          style={[
            styles.textDay,
            {
              color: textColor,
              fontFamily: theme.font[isFocused ? "medium" : "regular"],
            },
          ]}
        >
          {date.day}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
