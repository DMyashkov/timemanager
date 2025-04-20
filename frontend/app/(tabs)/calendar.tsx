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
import { ReactNode, useState } from "react";
import {
  FocusedDateProvider,
  useFocusedDate,
} from "@/context/focusedDateContext";
import { SessionData } from "@/constants/interfaces";
import { useRelevantSessions } from "@/hooks/useRelevantSessions";

export default function CalendarScreen() {
  const styles = useStyles();
  const productiveTime = useProductivityMetric();
  const productiveTimeObj = Time.fromSeconds(productiveTime);

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
            <CollapsedCalendar
              style={{ paddingHorizontal: 15 }}
              productiveTime={productiveTimeObj}
            />
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
  const productiveTime = useProductivityMetric();
  const productiveTimeObj = Time.fromSeconds(productiveTime);
  const today = DateStruct.fromDate(new Date());

  const { focusedDate } = useFocusedDate();

  const sessionsData: SessionData[] = useRelevantSessions(focusedDate);
  // console.log(
  //   "Sessions data taken in from useReleaventSessions (sessionList):",
  //   sessionsData,
  // );

  // Convert SessionData to Session instances
  const sessions =
    sessionsData
      ?.map((data: SessionData) => {
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
        return new Session(data.tagId, intervals, data.laps);
      })
      ?.sort((a, b) => {
        const aEnd = a.getLatestEndTime()?.toDate()?.getTime() ?? 0;
        const bEnd = b.getLatestEndTime()?.toDate()?.getTime() ?? 0;
        return bEnd - aEnd; // descending
      }) ?? [];

  return [
    <SessionList style={styles.leftScreen} sessions={sessions} key="list" />,
    <SessionCalendar
      style={styles.rightScreen}
      sessions={sessions}
      key="calendar"
    />,
  ];
}
