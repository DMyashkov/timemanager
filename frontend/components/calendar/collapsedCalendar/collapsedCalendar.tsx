import React, { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CollapsedCalendar({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  // Calculate the current week's starting date
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = (currentDayOfWeek + 6) % 7; // How far today is from Monday
  const startingDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysFromMonday,
  ); // Previous Monday

  // Manage current week index
  const [currentWeekIndex, setCurrentWeekIndex] = useState(10); // Start in the middle of generated weeks
  const [isTransitioning, setIsTransitioning] = useState(false); // Prevent multiple swipes
  const flatListRef = useRef<FlatList>(null);

  // Generate weeks dynamically for rendering
  const weeks = generateWeeks(startingDay, 10); // 10 weeks before and after the current week

  // Handle swipe gestures with strict locking
  const scrollToWeek = (direction: "prev" | "next") => {
    if (isTransitioning) return; // Prevent swipe if already transitioning

    let newIndex = currentWeekIndex;
    if (direction === "prev" && currentWeekIndex > 0) {
      newIndex = currentWeekIndex - 1;
    } else if (direction === "next" && currentWeekIndex < weeks.length - 1) {
      newIndex = currentWeekIndex + 1;
    }

    setIsTransitioning(true); // Lock swiping
    flatListRef.current?.scrollToOffset({
      offset: newIndex * SCREEN_WIDTH,
      animated: true,
    });

    // Wait for the animation to complete before unlocking
    setTimeout(() => {
      setCurrentWeekIndex(newIndex);
      setIsTransitioning(false);
    }, 300); // Match animation duration
  };

  return (
    <View style={styles.outer}>
      <View style={styles.header}>
        <Text style={styles.leftHeaderText}>Sep 2024</Text>
        <Text style={styles.rightHeaderText}>
          Productivity: <Text style={styles.productiveTimeText}>4:54:32</Text>
        </Text>
      </View>
      <View style={styles.week}>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>M</Text>
        </View>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>T</Text>
        </View>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>W</Text>
        </View>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>T</Text>
        </View>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>F</Text>
        </View>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>S</Text>
        </View>
        <View style={[styles.dayName]}>
          <Text style={[styles.dayNameText]}>S</Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={weeks}
        keyExtractor={(item) => `${item.startingDate.toISOString()}`}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH} // Snap to the screen width (one week at a time)
        decelerationRate="fast" // Slow down momentum to prevent multiple snaps
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentWeekIndex}
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
              month={item.startingDate.getMonth() + 1}
              year={item.startingDate.getFullYear()}
            />
          </View>
        )}
      />
    </View>
  );
}

// Function to generate weeks dynamically
function generateWeeks(startingDay: Date, numberOfWeeks: number) {
  const weeks = [];
  for (let i = -numberOfWeeks; i <= numberOfWeeks; i++) {
    const weekStart = new Date(
      startingDay.getFullYear(),
      startingDay.getMonth(),
      startingDay.getDate() + i * 7,
    );
    const weekEnd = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + 6,
    );
    weeks.push({ startingDate: weekStart, endingDate: weekEnd });
  }
  return weeks;
}

function Week({
  startingDate,
  endingDate,
  month,
  year,
}: {
  startingDate: Date;
  endingDate: Date;
  month: number;
  year: number;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  // Create a list of dates for the current week
  const weekDays = [];
  const currentDate = new Date(startingDate);
  while (currentDate <= endingDate) {
    weekDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <View>
      <View style={styles.week}>
        {weekDays.map((date) => (
          <DayElement
            key={`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`}
            day={date.getDate()}
            month={date.getMonth() + 1}
            year={date.getFullYear()}
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
}: {
  day: number;
  month: number;
  year: number;
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
  if (isToday) {
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
    <View>
      <View
        style={[
          styles.outerDateDay,
          {
            backgroundColor: isToday ? theme.color.red : "transparent",
          },
        ]}
      >
        {isFirstOfMonth && (
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
              fontFamily: theme.font[isToday ? "medium" : "regular"],
            },
          ]}
        >
          {day}
        </Text>
      </View>
    </View>
  );
}
