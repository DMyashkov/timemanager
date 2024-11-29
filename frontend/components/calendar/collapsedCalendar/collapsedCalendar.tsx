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

  // Snap to next or previous week
  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );
    setCurrentWeekIndex(newIndex);
    setIsTransitioning(false); // Re-enable swiping after the transition
  };

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
      onMomentumScrollEnd={handleMomentumScrollEnd}
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
    textColor = theme.color.black; // Dates after today
  } else {
    textColor = theme.color.darkGrey; // Dates before today
  }

  return (
    <View>
      <Text
        style={[
          styles.textDay,
          {
            color: textColor,
          },
        ]}
      >
        {day}
      </Text>
    </View>
  );
}
