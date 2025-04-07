import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, sessions } from "@/db/schema";
import { Session } from "@/utils/dateTimeSession";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";
import type { SessionData } from "@constants/interfaces";
import { and, eq, gte, lt } from "drizzle-orm";

type DBSession = typeof sessions.$inferSelect;

/**
 * Fetches sessions from the database that occurred today.
 * Uses a live query to stay updated.
 */
export function useRelevantSessions() {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  const [todayStart, setTodayStart] = useState(startOfDay(new Date()));
  const [todayEnd, setTodayEnd] = useState(endOfDay(new Date()));

  // Update date range daily or if the component remounts significantly later
  useEffect(() => {
    const interval = setInterval(
      () => {
        const now = new Date();
        setTodayStart(startOfDay(now));
        setTodayEnd(endOfDay(now));
      },
      60 * 60 * 1000,
    ); // Check every hour, less frequent than per minute update

    // Initial check in case the day changed between initial render and effect setup
    const now = new Date();
    setTodayStart(startOfDay(now));
    setTodayEnd(endOfDay(now));

    return () => clearInterval(interval);
  }, []);

  // Fetch sessions that overlap with today using the indexed startTime field
  const sessionsData = useLiveQuery(
    db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.deleted, 0),
          gte(sessions.startTime, todayStart.getTime()),
          lt(sessions.startTime, todayEnd.getTime()),
        ),
      )
      .orderBy(sessions.startTime),
    [],
  );

  // Transform database sessions to SessionData
  const relevantSessions = (sessionsData?.data ?? []).map(
    (data: DBSession) =>
      ({
        id: data.id,
        tagId: data.tagId ?? 0,
        startTime: data.startTime ?? 0,
        endTime: data.endTime ?? 0,
        totalWorkTime: data.totalWorkTime ?? 0,
        totalBreakTime: data.totalBreakTime ?? 0,
        intervals: JSON.parse(data.intervals || "[]"),
        laps: JSON.parse(data.laps || "[]"),
        deleted: data.deleted ?? 0,
        synced: data.synced ?? 0,
      }) as SessionData,
  );

  return relevantSessions;
}
