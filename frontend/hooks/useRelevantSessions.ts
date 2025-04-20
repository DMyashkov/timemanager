import { useState, useEffect, useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, sessions } from "@/db/schema";
import { Session } from "@/utils/dateTimeSession";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";
import type { SessionData } from "@constants/interfaces";
import { and, eq, gte, lt } from "drizzle-orm";
import { DateStruct } from "@/utils/dateTimeSession";

type DBSession = typeof sessions.$inferSelect;

/**
 * Fetches sessions from the database that occurred on the specified date.
 * Uses a live query to stay updated.
 * @param dateStruct - The date to fetch sessions for. If not provided, defaults to today.
 */
export function useRelevantSessions(dateStruct?: DateStruct) {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  // Convert DateStruct to Date and memoize the result
  const date = useMemo(() => {
    if (!dateStruct) return new Date();
    return new Date(
      dateStruct.year,
      dateStruct.month - 1,
      dateStruct.day
    );
  }, [dateStruct]);

  // Memoize the date range calculations
  const { dateStart, dateEnd } = useMemo(() => ({
    dateStart: startOfDay(date),
    dateEnd: endOfDay(date)
  }), [date]);

  // Fetch sessions that overlap with the specified date using the indexed startTime field
  const { data: sessionsData } = useLiveQuery(
    db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.deleted, 0),
          gte(sessions.startTime, dateStart.getTime()),
          lt(sessions.startTime, dateEnd.getTime()),
        ),
      )
      .orderBy(sessions.startTime),
    [dateStart, dateEnd],
  );

  // Transform database sessions to SessionData and memoize the result
  const relevantSessions = useMemo(() => {
    if (!sessionsData?.length) return [];
    return sessionsData.map(
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
  }, [sessionsData]);

  return relevantSessions;
}
