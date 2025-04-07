import React from "react";
import { View, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SessionElement from "../session/session";
import { FlatList } from "react-native-gesture-handler";
import { useRelevantSessions } from "@/hooks/useRelevantSessions";
import { Session, Interval, DateTime, Time, IntervalType, DateStruct } from "@/utils/dateTimeSession";

export default function SessionList({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  // Get today's sessions from the hook
  const sessionsData = useRelevantSessions();

  // Convert SessionData to Session instances
  const sessions = sessionsData?.map(data => {
    if (!data.intervals || !Array.isArray(data.intervals) || data.intervals.length === 0) {
      // Create a default interval if none exists to avoid errors
      const now = new Date();
      const defaultInterval = new Interval(
        new DateTime(
          new DateStruct(now.getFullYear(), now.getMonth() + 1, now.getDate()),
          new Time(now.getHours(), now.getMinutes(), 0)
        ),
        new DateTime(
          new DateStruct(now.getFullYear(), now.getMonth() + 1, now.getDate()),
          new Time(now.getHours(), now.getMinutes() + 30, 0)
        ),
        IntervalType.WORK
      );
      return new Session(data.tagId, [defaultInterval]);
    }

    const intervals = data.intervals.map(interval => 
      new Interval(
        new DateTime(
          interval.startTime.date,
          new Time(
            interval.startTime.time.hours,
            interval.startTime.time.minutes,
            interval.startTime.time.seconds
          )
        ),
        new DateTime(
          interval.endTime.date,
          new Time(
            interval.endTime.time.hours,
            interval.endTime.time.minutes,
            interval.endTime.time.seconds
          )
        ),
        interval.type as IntervalType
      )
    );
    return new Session(data.tagId, intervals);
  }) ?? [];

  return (
    <View style={[styles.container, style]}>
      <FlatList
        style={styles.outer}
        data={sessions}
        renderItem={({ item }) => <SessionElement session={item} />}
        keyExtractor={(item, index) => `session-${index}-${item.getTagId()}`}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}
