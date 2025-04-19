import { createContext, useContext, useEffect } from "react";
import { openDatabaseSync } from "expo-sqlite";
import type { ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import { sessions } from "@/db/schema";
import axios from "axios";
import type { schema } from "@/db/schema";
import { useFocus } from "./FocusContext";
import type { SessionData } from "@constants/interfaces";
import { underDampedSpringCalculations } from "react-native-reanimated/lib/typescript/animation/springUtils";

interface SessionContextProps {
  createSession: (
    db: ExpoSQLiteDatabase<typeof schema>,
    item: SessionData & { id?: number; synced?: number; deleted?: number },
  ) => Promise<number>;
  getSession: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<SessionData | null>;
  parseSession: (
    result: (typeof sessions.$inferSelect)[],
  ) => SessionData | null;
  updateSession: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
    updates: Partial<SessionData>,
  ) => Promise<void>;
  deleteSession: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<void>;
  syncUnsyncedRows: (
    db: ExpoSQLiteDatabase<typeof schema>,
    token: string,
  ) => Promise<void>;
  cleanupDeletedRows: (db: ExpoSQLiteDatabase<typeof schema>) => Promise<void>;
  fetchAndStoreSessions: (
    db: ExpoSQLiteDatabase<typeof schema>,
    token: string,
  ) => Promise<void>;
}

const insertSession = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  item: SessionData & { id?: number; synced?: number; deleted?: number },
): Promise<number> => {
  console.log("Insert session:", item);
  const {
    idConst,
    tagId,
    totalWorkTime,
    totalBreakTime,
    intervals,
    laps,
    synced,
    startTime,
    endTime,
  } = item;
  const id = idConst === 0 ? undefined : idConst; // Use null if idConst is 0
  // Check if intervals and laps are already strings
  const intervalsStr =
    typeof intervals === "string" ? intervals : JSON.stringify(intervals);
  const lapsStr = typeof laps === "string" ? laps : JSON.stringify(laps);

  const result = await db
    .insert(sessions)
    .values({
      id,
      tagId,
      totalWorkTime,
      totalBreakTime,
      intervals: intervalsStr,
      laps: lapsStr,
      synced,
      startTime,
      endTime,
    })
    .returning({ insertId: sessions.id });

  // console.log("Inserted session:", result);
  // console.log("table after insert:", await db.select().from(sessions));

  return result[0].insertId;
};

const parseSession = (
  result: (typeof sessions.$inferSelect)[],
): SessionData | null => {
  if (result.length === 0) return null;

  const row = result[0];
  if (row.deleted === 1) return null;

  return {
    id: row.id,
    tagId: row.tagId ?? 0,
    totalWorkTime: row.totalWorkTime ?? 0,
    totalBreakTime: row.totalBreakTime ?? 0,
    intervals: JSON.parse(row.intervals || "[]"),
    laps: JSON.parse(row.laps || "[]"),
    deleted: row.deleted ?? 0,
    synced: row.synced ?? 0,
    startTime: row.startTime ? row.startTime * 1000 : 0,
    endTime: row.endTime ? row.endTime * 1000 : 0,
  };
};

const getSession = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
): Promise<SessionData | null> => {
  const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);
  return parseSession(result);
};

const updateSession = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
  updates: Partial<SessionData>,
) => {
  const existingSession = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);

  if (existingSession.length === 0) {
    throw new Error(`Session with id ${id} not found`);
  }

  const currentSession = existingSession[0];

  const updatedSession = {
    tagId: updates.tagId ?? currentSession.tagId,
    totalWorkTime: updates.totalWorkTime ?? currentSession.totalWorkTime,
    totalBreakTime: updates.totalBreakTime ?? currentSession.totalBreakTime,
    intervals:
      updates.intervals !== undefined
        ? JSON.stringify(updates.intervals)
        : currentSession.intervals,
    laps:
      updates.laps !== undefined
        ? JSON.stringify(updates.laps)
        : currentSession.laps,
    synced: 0,
    startTime: updates.startTime ?? currentSession.startTime,
    endTime: updates.endTime ?? currentSession.endTime,
  };

  await db.update(sessions).set(updatedSession).where(eq(sessions.id, id));
};

const deleteSession = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
): Promise<void> => {
  await db
    .update(sessions)
    .set({ deleted: 1, synced: 0 })
    .where(eq(sessions.id, id));
};

export const syncUnsyncedRows = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
) => {
  console.log("syncUnsyncedRows of all rows", await db.select().from(sessions));
  const rows = await db.select().from(sessions).where(eq(sessions.synced, 0));

  if (rows.length === 0) {
    console.log("Tried to sync sessions but no unsynced rows found");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/sessions/sync/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(rows),
    });

    if (response.ok) {
      await db
        .update(sessions)
        .set({ synced: 1 })
        .where(eq(sessions.synced, 0));
      // console.log("All unsynced rows marked as synced");
      await cleanupDeletedRows(db);
    } else {
      throw new Error("Failed to sync with backend");
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
};

const cleanupDeletedRows = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  await db
    .delete(sessions)
    .where(and(eq(sessions.deleted, 1), eq(sessions.synced, 1)));
  // console.log("Deleted rows cleaned up");
};

const fetchAndStoreSessions = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
) => {
  try {
    // console.log("Auth token:", token);

    const response = await axios.get("http://127.0.0.1:8000/api/sessions/", {
      headers: { Authorization: `Token ${token}` },
    });

    console.log("Fetched sessions:", response.data);
    // console.log("Response status:", response.status);

    if (response.status === 200) {
      const fetchedSessions: SessionData[] = response.data;

      // console.log("Sessions fetched successfully.");

      // Clear local database first
      await db.delete(sessions);
      // console.log("Local database cleared successfully.");

      // Insert all sessions
      for (const session of fetchedSessions) {
        await insertSession(db, {
          id: session.id,
          tagId: session.tagId,
          totalWorkTime: session.totalWorkTime,
          totalBreakTime: session.totalBreakTime,
          intervals: session.intervals,
          laps: session.laps,
          deleted: session.deleted ?? 0,
          synced: 1,
          startTime: session.startTime,
          endTime: session.endTime,
        });
      }
      console.log(
        "Sessions inserted - end result:",
        await db.select().from(sessions),
      );

      // console.log("Sessions inserted into local database successfully.");
    } else {
      console.error("Failed to fetch sessions:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching sessions:", error);
  }
};

export const SessionContext = createContext<SessionContextProps | null>(null);

// Context Provider
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionContext.Provider
      value={{
        createSession: insertSession,
        getSession,
        parseSession,
        updateSession,
        deleteSession,
        syncUnsyncedRows,
        cleanupDeletedRows,
        fetchAndStoreSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Hook to use the context
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
};
