import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { FlatList } from "react-native-gesture-handler";
import {
  Session,
  Time,
  DateTime,
  Interval,
  IntervalType,
} from "@/utils/dateTimeSession";
import { blendColors, hexWithOpacity } from "@/utils/colorUtils";
import At from "@assets/icons/at.svg";
import { moduleTypeEnum } from "@/constants/interfaces";
import ArrowRotateLeft from "@assets/icons/arrow-rotate-left.svg";
import TagIcon from "@assets/icons/tag.svg";
import { useRelevantSessions } from "@/hooks/useRelevantSessions";

export default function SessionCalendar({ style = {} }: { style?: object }) {
  const { theme } = useTheme();
  const textColor = theme.color.white;
  const styles = useStyles(textColor);
  const FULL_ENTRY_HEIGHT = 60; // Height for one hour
  const ENTRY_LINE_HEIGHT = 17; // Height for the time line

  const hours = Array.from({ length: 25 }, (_, i) => {
    const hour = i % 12 || 12; // Convert to 12-hour format
    const period = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${period}`;
  });

  // Get today's sessions from the hook
  const sessionsData = useRelevantSessions();

  // Convert SessionData to Session instances
  const sessions =
    sessionsData?.map((data) => {
      const intervals = data.intervals.map(
        (interval) =>
          new Interval(
            new DateTime(
              interval.startTime.date,
              new Time(
                interval.startTime.time.hours,
                interval.startTime.time.minutes,
                interval.startTime.time.seconds,
              ),
            ),
            new DateTime(
              interval.endTime.date,
              new Time(
                interval.endTime.time.hours,
                interval.endTime.time.minutes,
                interval.endTime.time.seconds,
              ),
            ),
            interval.type as IntervalType,
          ),
      );
      return new Session(data.tagId, intervals);
    }) ?? [];

  // State to keep track of current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  const [currentLineWidth, setCurrentLineWidth] = useState(0);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const hourStart = index; // Current hour index (0 for 12:00 AM, 1 for 1:00 AM, etc.)
    const hourEnd = index + 1;

    const relevantSessions =
      index !== 24
        ? sessions.filter((session) => {
            const sessionStartInHours =
              session.getStartTime().hours +
              session.getStartTime().minutes / 60;
            return (
              sessionStartInHours >= hourStart && sessionStartInHours < hourEnd
            );
          })
        : [];

    // Determine if the current time is within this hour
    const currentHour = currentTime.getHours() % 24; // 0-23
    const isCurrentHour = currentHour === hourStart;

    // Calculate the top position for the red line within the hour's view
    let redLineTop = 0;
    if (isCurrentHour && index !== 24) {
      const minutesPassed = currentTime.getMinutes();
      redLineTop =
        (minutesPassed / 60) * FULL_ENTRY_HEIGHT + ENTRY_LINE_HEIGHT / 2;
    }

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
          <View
            style={styles.line}
            onLayout={(event) => {
              if (isCurrentHour) {
                const { width } = event.nativeEvent.layout;
                setCurrentLineWidth(width);
              }
            }}
          />
        </View>

        {/* Render Sessions */}
        {relevantSessions.map((session, sessionIndex) => {
          const startTime: Time = session.getStartTime();
          const totalTime: Time = session.getTotalTime();
          const tagId = session.getTagId();
          const intervals = session.getIntervals();
          const workTime = session.getWorkTime();

          const startInMinutes = startTime.hours * 60 + startTime.minutes;
          const offsetMinutes = startInMinutes - hourStart * 60; // Offset within this hour
          const topOffset =
            (FULL_ENTRY_HEIGHT / 60) * offsetMinutes + ENTRY_LINE_HEIGHT / 2;

          const durationInMinutes = totalTime.hours * 60 + totalTime.minutes;
          const height = (FULL_ENTRY_HEIGHT / 60) * durationInMinutes;

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
                  overflow: "hidden",
                  height,
                  backgroundColor: theme.color.presets.green.medium, // Default to green for now
                },
              ]}
            >
              <View style={styles.content}>
                <View style={styles.project}>
                  <Text style={styles.textSession}>{tagId}</Text>
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
                        fill={textColor}
                        style={styles.textSession}
                      />
                    </View>
                    <View style={styles.tagContainer}>
                      <TagIcon
                        width={13}
                        height={13}
                        fill={textColor}
                        style={styles.textSession}
                      />
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
                      backgroundColor: hexWithOpacity(
                        theme.color.presets.green.dark,
                        0.3,
                      ),
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  />
                );
              })}
            </View>
          );
        })}

        {/* Render Red Line if current time is within this hour */}
        {isCurrentHour && index !== 24 && (
          <View
            style={{
              position: "absolute",
              top: redLineTop - 3 / 2,
              right: 0,
              height: 3,
              backgroundColor: "red",
              width: currentLineWidth,
              zIndex: 5,
            }}
          >
            <View style={styles.dot} />
          </View>
        )}
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
        initialScrollIndex={Math.max(
          Math.min(currentTime.getHours(), 23) - 3,
          0,
        )}
        getItemLayout={
          // Optimized scroll
          (_, index) => ({
            length: index !== 24 ? FULL_ENTRY_HEIGHT : ENTRY_LINE_HEIGHT,
            offset:
              (index !== 24 ? FULL_ENTRY_HEIGHT : ENTRY_LINE_HEIGHT) * index,
            index,
          })
        }
      />
    </View>
  );
}
