import { View } from "react-native";
import useStyles from "./styles/calendarStyles";
import { useTheme } from "@context/ThemeContext";
import Header from "@/components/header/headerBasic/header";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";
import SessionCalendar from "@components/calendar/sessionCalendar/sessionCalendar";
import SessionList from "@components/calendar/sessionList/sessionList";
import CollapsedCalendar from "@/components/calendar/collapsedCalendar/collapsedCalendar";
import { useProductivityMetric } from "@/hooks/useProductivityMetric";
import {
  DateStruct,
  DateTime,
  Interval,
  IntervalType,
  Session,
  Time,
} from "@/utils/dateTimeSession";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  FocusedDateProvider,
  useFocusedDate,
} from "@/context/focusedDateContext";
import { SessionData } from "@/constants/interfaces";
import { useRelevantSessions } from "@/hooks/useRelevantSessions";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, and } from "drizzle-orm";
import { schema } from "@/db/schema";
import { tags } from "@/db/schema";
import type { TagData } from "@/constants/interfaces";

export default function CalendarScreen() {
  const styles = useStyles();

  return (
    <FocusedDateProvider>
      <View style={styles.screen}>
        <Header title="Calendar" />

        <SwitchWrapper
          buttons={[
            { text: "List", onPress: () => {} },
            { text: "Calendar", onPress: () => {} },
          ]}
          styleSwitch={{ paddingHorizontal: 13 }}
          TopElement={() => (
            <CollapsedCalendar style={{ paddingHorizontal: 15 }} />
          )}
        >
          <CalendarScreenInner />
        </SwitchWrapper>
      </View>
    </FocusedDateProvider>
  );
}

function CalendarScreenInner(): [ReactNode, ReactNode] {
  const styles = useStyles();
  const { theme } = useTheme();
  const today = DateStruct.fromDate(new Date());

  const { focusedDate } = useFocusedDate();

  const sessionsData: SessionData[] = useRelevantSessions(focusedDate);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  // Get unique tag IDs from sessions
  const tagIds = useMemo(() => {
    if (!sessionsData?.length) return [];
    const ids = new Set<number>();
    sessionsData.forEach((session) => {
      if (session.tagId && session.tagId > 0) ids.add(session.tagId);
    });
    return Array.from(ids);
  }, [sessionsData]);

  // Only fetch the tags we need
  const { data: tagsData } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(and(eq(tags.deleted, 0), ...tagIds.map((id) => eq(tags.id, id)))),
    [tagIds],
  );

  // Create a map of tag IDs to their productivity status
  const productiveTagsMap = useMemo(() => {
    if (!tagsData?.length) return new Map<number, boolean>();
    const map = new Map<number, boolean>();
    tagsData.forEach((tag: { id: number; productive: number | null }) => {
      map.set(tag.id, tag.productive === 1);
    });
    return map;
  }, [tagsData]);

  const sessions = useMemo(() => {
    if (!sessionsData?.length) return [];
    return sessionsData
      .map((data: SessionData) => {
        if (!data.tagId || !data.intervals?.length) return null;
        const intervals = data.intervals.map(
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
        return new Session(data.tagId, intervals, data.laps);
      })
      .filter((session): session is Session => session !== null)
      .sort((a, b) => {
        const aEnd = a.getLatestEndTime()?.toDate()?.getTime() ?? 0;
        const bEnd = b.getLatestEndTime()?.toDate()?.getTime() ?? 0;
        return bEnd - aEnd; // descending
      });
  }, [sessionsData]);

  const { productiveTime, setProductiveTime } = useFocusedDate();

  const productiveTimeLocal = useMemo(() => {
    if (!sessions.length) return new Time(0, 0, 0);
    let result = new Time(0, 0, 0);
    for (const session of sessions) {
      const tagId = session.getTagId();
      if (tagId && productiveTagsMap.get(tagId)) {
        const workTime = session.getWorkTime();
        result = result.add(workTime);
      }
    }
    return result;
  }, [sessions, productiveTagsMap]);

  useEffect(() => {
    if (!productiveTimeLocal.equals(productiveTime)) {
      setProductiveTime(productiveTimeLocal);
    }
  }, [productiveTimeLocal, setProductiveTime, productiveTime]);

  return [
    <SessionList style={styles.leftScreen} sessions={sessions} key="list" />,
    <SessionCalendar
      style={styles.rightScreen}
      sessions={sessions}
      key="calendar"
    />,
  ];
}
