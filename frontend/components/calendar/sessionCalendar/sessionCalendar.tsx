import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { FlatList } from "react-native-gesture-handler";
import { exampleSessions } from "@/constants/exampleSessions";
import { dataIndex } from "@/constants/exampleData";
import { IntervalType, Time } from "@/utils/dateTimeSession";

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

  const sessionData = exampleSessions;

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const hourStart = index; // Current hour index (0 for 12:00 AM, 1 for 1:00 AM, etc.)
    const hourEnd = index + 1;

    const relevantSessions =
      index !== 24
        ? sessionData.filter((session) => {
            const sessionStartInHours =
              session.getStartTime().hours +
              session.getStartTime().minutes / 60;
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
          const startTime: Time = session.getStartTime();
          const totalTime: Time = session.getTotalTime();
          const tagId = session.getActivityId();
          const intervals = session.getIntervals();

          const startInMinutes = startTime.hours * 60 + startTime.minutes;
          const offsetMinutes = startInMinutes - hourStart * 60; // Offset within this hour
          const topOffset =
            (FULL_ENTRY_HEIGHT / 60) * offsetMinutes + ENTRY_LINE_HEIGHT / 2;

          const durationInMinutes = totalTime.hours * 60 + totalTime.minutes;
          const height = (FULL_ENTRY_HEIGHT / 60) * durationInMinutes;
          const activityItem = dataIndex[tagId]?.item;
          const colorPallete = theme.color.presets[activityItem?.colorPreset];

          const breakIntervals = intervals.filter(
            (interval) => interval.type === IntervalType.BREAK,
          );

          return (
            <View
              key={`${startTime.toString()}-${totalTime}-${tagId}`}
              style={[
                styles.session,
                {
                  top: topOffset,
                  height,
                  backgroundColor: colorPallete.medium,
                },
              ]}
            >
              <Text>{tagId}</Text>
              {/* Render Breaks */}
              {breakIntervals.map((breakInterval, breakIndex) => {
                const breakStartTime = breakInterval.startTime.time;
                const breakDuration = breakInterval.getDurationInSeconds() / 60; // In minutes

                const breakStartInMinutes =
                  breakStartTime.hours * 60 + breakStartTime.minutes;
                const breakOffsetMinutes = breakStartInMinutes - startInMinutes; // Offset within this hour
                console.log(
                  tagId,
                  startInMinutes,
                  breakStartInMinutes,
                  breakOffsetMinutes,
                );
                const breakTopOffset =
                  (FULL_ENTRY_HEIGHT / 60) * breakOffsetMinutes;
                const breakHeight = (FULL_ENTRY_HEIGHT / 60) * breakDuration;

                return (
                  <View
                    key={`break-${breakTopOffset}-${breakHeight}`}
                    style={{
                      position: "absolute",
                      top: breakTopOffset,
                      height: breakHeight,
                      width: "100%",
                      backgroundColor: `${theme.color.black}26`, // 15% opacity
                    }}
                  />
                );
              })}
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
        style={{ paddingHorizontal: 15 }}
      />
    </View>
  );
}
