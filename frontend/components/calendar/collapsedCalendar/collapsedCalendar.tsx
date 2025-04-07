import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Touchable,
  TouchableOpacity,
} from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Calendar from "@assets/icons/calendar.svg";
import { transform } from "@babel/core";
import { Time } from "@utils/dateTimeSession";

const SCREEN_WIDTH = Dimensions.get("window").width;

import { DateStruct } from "@utils/dateTimeSession";

interface CollapsedCalendarProps {
  style?: object;
  productiveTime: Time;
}

export default function CollapsedCalendar({
  style = {},
  productiveTime,
}: CollapsedCalendarProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  // Calculate the current week's starting date
  const today = DateStruct.fromDate(new Date());
  const startingDay = new DateStruct(
    today.year,
    today.month,
    today.day - ((today.getDayOfTheWeek() - 1) % 7), // Adjust to Monday
  );
  const CURRENT_WEEK_INDEX = 480;

  // Manage current week index
  const [currentWeekIndex, setCurrentWeekIndex] = useState(CURRENT_WEEK_INDEX); // Start in the middle of generated weeks
  const flatListRef = useRef<FlatList>(null);

  // Generate weeks dynamically for rendering
  const weeks = useMemo(
    () => generateWeeks(startingDay, CURRENT_WEEK_INDEX),
    [startingDay],
  );

  const [focusedDate, setFocusedDate] = useState(new DateStruct(today));
  const dayOfWeekFocus = focusedDate.getDayOfTheWeek();
  const [transitioning, setTransitioning] = useState(false);
  const goBackToToday = () => {
    setFocusedDate(new DateStruct(today));
    setTransitioning(true);
    flatListRef.current?.scrollToIndex({
      index: CURRENT_WEEK_INDEX, // Target the current week index
      animated: true,
      viewPosition: 0.5, // Scroll to center the target index
    });
    setTimeout(() => {
      setFocusedDate(new DateStruct(today));
      setTransitioning(false);
    }, 300);
  };

  const shouldGoBackBeVisible = !focusedDate.equals(today);

  const focusedWeekStart = weeks[currentWeekIndex]?.startingDate;

  // const getCertainDayFromWeekWithStart = (
  //   weekStart: DateStruct,
  //   dayOfWeek: number,
  // ) => {
  //   return DateStruct.addDays(weekStart, dayOfWeek - 1);
  // };

  useEffect(() => {
    if (focusedWeekStart && !transitioning) {
      const newFocusedDate = DateStruct.addDays(
        focusedWeekStart,
        dayOfWeekFocus, // Use dayOfWeekFocus directly without subtracting 1
      );
      if (!newFocusedDate.equals(focusedDate)) {
        if (newFocusedDate.isSameOrBefore(today)) {
          setFocusedDate(newFocusedDate);
        } else {
          setFocusedDate(new DateStruct(today));
        }
      }
    }
  }, [focusedWeekStart, dayOfWeekFocus, focusedDate, transitioning, today]);

  // console.log(currentWeekIndex);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <View style={styles.outer}>
      <View style={styles.header}>
        <View style={styles.leftPartHeader}>
          <Text style={styles.leftHeaderText}>
            {`${monthNames[focusedDate.month - 1]} ${focusedDate.year}`}
          </Text>
          {/* <Calendar fill={theme.color.red} height={20} width={20} /> */}
          {shouldGoBackBeVisible && (
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => {
                goBackToToday();
              }}
              activeOpacity={1}
            >
              <Text style={styles.goBackText}>{today.day}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.rightHeaderText}>
          Productivity:{" "}
          <Text style={styles.productiveTimeText}>
            {productiveTime.toStringLong()}
          </Text>
        </Text>
      </View>
      <View style={styles.week}>
        {["M", "T", "W", "T", "F", "S", "S"].map((dayName, index) => (
          <View
            // biome-ignore lint: a11y/no-index-key
            key={`day-name-${index}`}
            style={styles.dayName}
          >
            <Text style={styles.dayNameText}>{dayName}</Text>
          </View>
        ))}
      </View>
      <FlatList
        ref={flatListRef}
        data={weeks}
        keyExtractor={(item) => `${item.startingDate.toString()}`}
        horizontal
        pagingEnabled={false}
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={CURRENT_WEEK_INDEX}
        removeClippedSubviews={true}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <Week
              startingDate={item.startingDate}
              endingDate={item.endingDate}
              month={item.startingDate.month}
              year={item.startingDate.year}
              focusedDate={focusedDate}
              setFocusedDate={setFocusedDate}
            />
          </View>
        )}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x; // Current scroll offset
          const newIndex = Math.round(offsetX / SCREEN_WIDTH); // Calculate the nearest index
          if (newIndex !== currentWeekIndex) {
            setCurrentWeekIndex(newIndex); // Update index only if it has changed
          }
        }}
      />
    </View>
  );
}

// Function to generate weeks dynamically
function generateWeeks(startingDay: DateStruct, numberOfWeeks: number) {
  const weeks = [];
  const adjustedStartingDay = startingDay.getMonday(); // Adjust to ensure week starts on Monday
  for (let i = -numberOfWeeks; i <= 0; i++) {
    const weekStart = DateStruct.addDays(adjustedStartingDay, i * 7);
    const weekEnd = DateStruct.addDays(weekStart, 6);
    weeks.push({ startingDate: weekStart, endingDate: weekEnd });
  }
  return weeks;
}

function Week({
  startingDate,
  endingDate,
  month,
  year,
  focusedDate,
  setFocusedDate,
}: {
  startingDate: DateStruct;
  endingDate: DateStruct;
  month: number;
  year: number;
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct) => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const weekDays = [];
  let currentDate = startingDate;

  while (!currentDate.equals(DateStruct.addDays(endingDate, 1))) {
    weekDays.push(currentDate);
    currentDate = DateStruct.addDays(currentDate, 1);
  }

  return (
    <View>
      <View style={styles.week}>
        {weekDays.map((date) => (
          <DayElement
            key={date.toString()}
            day={date.day}
            month={date.month}
            year={date.year}
            isFocused={focusedDate.equals(date)}
            onPress={() => {
              // Only allow focusing on today or dates before today
              const today = DateStruct.fromDate(new Date());
              const selectedDate = new DateStruct(date);
              // console.log(
              //   selectedDate,
              //   today,
              //   selectedDate.isSameOrBefore(today),
              // );
              if (selectedDate.isSameOrBefore(today)) {
                setFocusedDate(selectedDate);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}

function DayElement({
  day,
  month,
  year,
  isFocused = false,
  onPress,
}: {
  day: number;
  month: number;
  year: number;
  isFocused?: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  // Get today's date
  const today = new Date();
  const isToday =
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear();
  const isBeforeToday =
    new Date(year, month - 1, day) <
    new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isAfterToday = !isToday && !isBeforeToday;

  // Determine text color
  let textColor:
    | typeof theme.color.white
    | typeof theme.color.black
    | typeof theme.color.darkGrey;
  if (isFocused) {
    textColor = theme.color.white; // Today's date
  } else if (isAfterToday) {
    textColor = theme.color.darkGrey; // Dates after today
  } else {
    textColor = theme.color.black; // Dates before today
  }

  // Check if the day is the first of the month
  const isFirstOfMonth = day === 1;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[month - 1];

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      activeOpacity={1}
    >
      <View
        style={[
          styles.outerDateDay,
          {
            backgroundColor: isFocused ? theme.color.red : "transparent",
          },
        ]}
      >
        {isFirstOfMonth && !isFocused && (
          <View>
            <Text
              style={[
                styles.monthText,
                {
                  color: textColor,
                },
              ]}
            >
              {monthName}
            </Text>
          </View>
        )}
        <Text
          style={[
            styles.textDay,
            {
              color: textColor,
              fontFamily: theme.font[isFocused ? "medium" : "regular"],
            },
          ]}
        >
          {day}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
