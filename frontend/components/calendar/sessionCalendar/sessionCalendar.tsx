import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { FlatList } from "react-native-gesture-handler";
import { exampleSessions } from "@/constants/exampleSessions";

export default function SessionCalendar({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();
  const FULL_ENTRY_HEIGHT = 50; // Height for one hour
  const ENTRY_LINE_HEIGHT = 17; // Height for the time line

  const hours = Array.from({ length: 25 }, (_, i) => {
    const hour = i % 12 || 12; // Convert to 12-hour format
    const period = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${period}`;
  });

  const sessionData = exampleSessions.map((session) => ({
    id: session.getActivityId() || "unknown",
    startTime: session.getStartTime(),
    endTime: session.getEndTime(),
    workTime: session.getWorkTime(),
  }));

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    // Filter sessions for this hour slot
    const hourStart = index; // Current hour index (0 for 12:00 AM, 1 for 1:00 AM, etc.)
    const hourEnd = index + 1;

    const relevantSessions =
      index !== 24
        ? sessionData.filter((session) => {
            const sessionStartInHours =
              session.startTime.hours + session.startTime.minutes / 60;
            return (
              sessionStartInHours >= hourStart && sessionStartInHours < hourEnd
            );
          })
        : [];

    return (
      <View
        style={{
          position: "relative",
          height: index !== 24 ? FULL_ENTRY_HEIGHT : ENTRY_LINE_HEIGHT,
        }}
      >
        {/* Render Hour */}
        <View style={[styles.entryTime]}>
          <Text style={styles.timeText}>{item}</Text>
          <View style={styles.line} />
        </View>

        {/* Render Sessions */}
        {relevantSessions.map((session) => {
          const startInMinutes =
            session.startTime.hours * 60 + session.startTime.minutes;
          const offsetMinutes = startInMinutes - hourStart * 60; // Offset within this hour
          const topOffset =
            (FULL_ENTRY_HEIGHT / 60) * offsetMinutes + ENTRY_LINE_HEIGHT / 2;

          const durationInMinutes =
            session.workTime.hours * 60 + session.workTime.minutes;
          const height = (FULL_ENTRY_HEIGHT / 60) * durationInMinutes;

          return (
            <View
              key={session.id}
              style={{
                position: "absolute",
                top: topOffset,
                left: 0,
                height,
                width: "100%",
                backgroundColor: "red",
                zIndex: 1,
              }}
            >
              <Text style={{ color: theme.color.white }}>
                {session.id} ({session.workTime.toString()})
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.outer, style]}>
      <FlatList
        data={hours}
        renderItem={renderItem}
        keyExtractor={(item, index) => `hour-${index}`}
      />
    </View>
  );
}
