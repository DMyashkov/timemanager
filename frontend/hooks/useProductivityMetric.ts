import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRelevantSessions } from "./useRelevantSessions";

export function useProductivityMetric() {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  // Get today's sessions using the existing hook
  const relevantSessions = useRelevantSessions();

  // Fetch all tags to check which ones are productive
  const tagsData = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.deleted, 0)),
    [],
  );

  // Calculate total productive time
  const productiveTime = relevantSessions.reduce((total, session) => {
    // Find the tag for this session
    const tag = tagsData?.data?.find(t => t.id === session.tagId);
    
    // If the tag is productive, add the work time
    if (tag?.productive === 1) {
      return total + (session.totalWorkTime ?? 0);
    }
    
    return total;
  }, 0);

  return productiveTime;
} 