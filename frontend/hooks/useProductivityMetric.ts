import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRelevantSessions } from "./useRelevantSessions";
import { useMemo, useEffect, useState } from "react";
import { Time, Session, Interval, DateTime, IntervalType } from "@/utils/dateTimeSession";
import type { SessionData } from "@/constants/interfaces";
import { useFocusedDate } from "@/context/focusedDateContext";

export function useProductivityMetric() {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { focusedDate, setProductiveTime } = useFocusedDate();
  const [isLoading, setIsLoading] = useState(true);

  // Get sessions for the focused date
  const relevantSessions = useRelevantSessions(focusedDate);

  // Fetch all tags to check which ones are productive
  const { data: tagsData } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.deleted, 0)),
    [],
  );

  // Calculate total productive time and memoize the result
  const productiveTime = useMemo(() => {
    if (!relevantSessions?.length || !tagsData?.length) {
      setIsLoading(false);
      return new Time(0, 0, 0);
    }
    
    const result = new Time(0, 0, 0);
    for (const sessionData of relevantSessions) {
      // Find the tag for this session
      const tag = tagsData.find(t => t.id === sessionData.tagId);
      
      // If the tag is productive (productive === 1), add the work time
      if (tag?.productive === 1) {
        // Convert SessionData to Session object
        const session = new Session(sessionData);
        const workTime = session.getWorkTime();
        result.add(workTime);
      }
    }
    setIsLoading(false);
    return result;
  }, [relevantSessions, tagsData]);

  // Update the focused date context whenever productive time changes
  useEffect(() => {
    if (!isLoading) {
      console.log("Tags data:", tagsData);
      console.log("Productive time:", productiveTime.toString());
      setProductiveTime(productiveTime);
    }
  }, [productiveTime, setProductiveTime, tagsData, isLoading]);

  return productiveTime;
} 