import React from "react";
import { View, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SessionElement from "../session/session";
import { FlatList } from "react-native-gesture-handler";
import { useRelevantSessions } from "@/hooks/useRelevantSessions";
import {
  Session,
  Interval,
  DateTime,
  Time,
  IntervalType,
  DateStruct,
} from "@/utils/dateTimeSession";
import { SessionData } from "@/constants/interfaces";

export default function SessionList({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  // Get today's sessions from the hook
  const sessionsData: SessionData[] = useRelevantSessions();
  // console.log(
  //   "Sessions data taken in from useReleaventSessions (sessionList):",
  //   sessionsData,
  // );

  // Convert SessionData to Session instances
  const sessions =
    sessionsData
      ?.map((data) => {
        const intervals = data?.intervals?.map(
          (interval: {
            startTime: {
              date: DateStruct;
              time: { hours: number; minutes: number; seconds: number };
            };
            endTime: {
              date: DateStruct;
              time: { hours: number; minutes: number; seconds: number };
            };
            type: IntervalType;
          }) =>
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
      })
      ?.sort((a, b) => {
        const aEnd = a.getLatestEndTime()?.toDate()?.getTime() ?? 0;
        const bEnd = b.getLatestEndTime()?.toDate()?.getTime() ?? 0;
        return bEnd - aEnd; // descending
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
