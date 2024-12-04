import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { FlatList } from "react-native-gesture-handler";
import { exampleSessions } from "@/constants/exampleSessions";
import { dataIndex } from "@/constants/exampleData";
import { IntervalType, Time } from "@/utils/dateTimeSession";
import { blendColors, hexWithOpacity } from "@/utils/colorUtils";
import At from "@assets/icons/at.svg";
import { moduleType } from "@/constants/interfaces";
import ArrowRotateLeft from "@assets/icons/arrow-rotate-left.svg";
import TagIcon from "@assets/icons/tag.svg";

export default function SessionCalendar({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();
  const FULL_ENTRY_HEIGHT = 55; // Height for one hour
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
          const workTime = session.getWorkTime();

          const startInMinutes = startTime.hours * 60 + startTime.minutes;
          const offsetMinutes = startInMinutes - hourStart * 60; // Offset within this hour
          const topOffset =
            (FULL_ENTRY_HEIGHT / 60) * offsetMinutes + ENTRY_LINE_HEIGHT / 2;

          const durationInMinutes = totalTime.hours * 60 + totalTime.minutes;
          const height = (FULL_ENTRY_HEIGHT / 60) * durationInMinutes;
          const tagItem = dataIndex[tagId]?.item;
          const colorPallete = theme.color.presets[tagItem?.colorPreset];

          const breakIntervals = intervals.filter(
            (interval) => interval.type === IntervalType.BREAK,
          );

          const isProject = tagItem?.type === moduleType.project;
          const parentId = dataIndex[tagId].path.at(-1);
          const parentTagItem = parentId ? dataIndex[parentId]?.item : null;
          const itemProject = isProject ? tagItem : null;
          const itemActivity = isProject
            ? parentTagItem
              ? tagItem
              : null
            : tagItem;

          return (
            <View
              key={`${startTime.toString()}-${totalTime}-${tagId}`}
              style={[
                styles.session,
                {
                  top: topOffset,
                  height,
                  backgroundColor: blendColors(
                    theme.color.white,
                    colorPallete.medium,
                    0.8,
                  ),
                },
              ]}
            >
              <View style={styles.content}>
                <View style={styles.project}>
                  {itemProject && (
                    <>
                      <At width={13} height={13} fill={theme.color.white} />
                      <Text style={styles.textSession}>
                        {itemProject?.title}
                      </Text>
                    </>
                  )}
                </View>
                <View style={styles.footer}>
                  <Text
                    style={styles.textSession}
                  >{`${workTime.toString()} / ${totalTime.toString()}`}</Text>
                  <View style={styles.rightFooter}>
                    <View style={styles.lapsContainer}>
                      <Text style={styles.textSession}>
                        {session.getLapAmount()}
                      </Text>
                      <ArrowRotateLeft
                        width={13}
                        height={13}
                        fill={theme.color.white}
                      />
                    </View>
                    <View style={styles.tagContainer}>
                      <TagIcon
                        width={13}
                        height={13}
                        fill={theme.color.white}
                      />
                      <Text style={styles.textSession}>
                        {" "}
                        {itemActivity?.title}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {breakIntervals.map((breakInterval, breakIndex) => {
                const breakStartTime = breakInterval.startTime.time;
                const breakDuration = breakInterval.getDurationInSeconds() / 60; // In minutes

                const breakStartInMinutes =
                  breakStartTime.hours * 60 + breakStartTime.minutes;
                const breakOffsetMinutes = breakStartInMinutes - startInMinutes; // Offset within this hour
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
                      backgroundColor: hexWithOpacity(theme.color.black, 0.1), // 15% opacity
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
