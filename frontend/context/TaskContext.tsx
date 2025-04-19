import { createContext, useContext } from "react";
import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import { type TaskData } from "@/constants/interfaces";
import { tasks } from "@/db/schema";
import axios from "axios";
import type { schema } from "@/db/schema";

interface TaskContextProps {
  createTask: (
    db: ExpoSQLiteDatabase<typeof schema>,
    item: TaskData & { id?: number; synced?: number; deleted?: number },
  ) => Promise<number>;
  getTask: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<TaskData | null>;
  parseTask: (result: (typeof tasks.$inferSelect)[]) => TaskData | null;
  updateTask: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
    updates: Partial<TaskData>,
  ) => Promise<void>;
  deleteTask: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<void>;
  syncUnsyncedTasks: (
    db: ExpoSQLiteDatabase<typeof schema>,
    token: string,
  ) => Promise<void>;
  cleanupDeletedRows: (db: ExpoSQLiteDatabase<typeof schema>) => Promise<void>;
  fetchAndStoreTasks: (
    db: ExpoSQLiteDatabase<typeof schema>,
    token: string,
  ) => Promise<void>;
}

const insertTask = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  item: TaskData & { id?: number; synced?: number; deleted?: number },
): Promise<number> => {
  // console.log("Inserting task into database with data:", item);
  const { id, title, description, date, priority, completed, synced, tagId } =
    item;

  try {
    const result = await db
      .insert(tasks)
      .values({
        id,
        title,
        description,
        date,
        priority,
        completed: completed ? 1 : 0,
        synced: synced ? 1 : 0,
        deleted: 0,
        tagId,
      })
      .returning({ insertId: tasks.id });

    // console.log("Database after insert", await db.select().from(tasks));
    return result[0].insertId;
  } catch (error) {
    console.error("Error inserting task into database:", error);
    throw error;
  }
};

const parseTask = (result: (typeof tasks.$inferSelect)[]): TaskData | null => {
  if (!result || result.length === 0) return null;
  const task = result[0];
  return {
    id: task.id,
    title: task.title ?? "",
    description: task.description ?? "",
    date: task.date ?? 0,
    priority: task.priority ?? 4,
    completed: task.completed === 1,
    synced: task.synced ?? 0,
    deleted: task.deleted ?? 0,
    tagId: task.tagId,
  };
};

const getTask = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
): Promise<TaskData | null> => {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  return parseTask(result);
};

const updateTask = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
  updates: Partial<TaskData>,
): Promise<void> => {
  // console.log("Updating task with ID:", id, "with data:", updates);
  const dbUpdates: Partial<typeof tasks.$inferInsert> = {
    ...updates,
    completed: updates.completed ? 1 : 0,
    synced: 0,
  };
  // console.log("WOWOO");

  try {
    console.log(dbUpdates);
    await db.update(tasks).set(dbUpdates).where(eq(tasks.id, id));
    // console.log("After update");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

const deleteTask = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
): Promise<void> => {
  await db.update(tasks).set({ deleted: 1, synced: 0 }).where(eq(tasks.id, id));
};

const syncUnsyncedRows = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
): Promise<void> => {
  const rows = await db.select().from(tasks).where(eq(tasks.synced, 0));
  // console.log("Unsynced rows found: ", rows);

  // console.log("Sending rows for sync: ", rows);

  if (rows.length === 0) {
    console.log("Tried to sync tags but no unsynced rows found");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/tasks/sync/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(rows),
    });

    if (response.ok) {
      await db.update(tasks).set({ synced: 1 }).where(eq(tasks.synced, 0));
      console.log("All unsynced rows marked as synced");
      await cleanupDeletedRows(db);
    } else {
      throw new Error("Failed to sync with backend");
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
};

const cleanupDeletedRows = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<void> => {
  await db.delete(tasks).where(and(eq(tasks.deleted, 1), eq(tasks.synced, 1)));
};

const fetchAndStoreTasks = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
): Promise<void> => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log("Fetched tasks:", response.data);

    if (response.status === 200) {
      const fetchedTasks = response.data;

      // Clear local database first
      await db.delete(tasks);
      console.log("Local database cleared successfully.");

      // Insert all tasks
      for (const task of fetchedTasks) {
        await insertTask(db, {
          id: task.id,
          title: task.title,
          description: task.description,
          date: task.date,
          priority: task.priority,
          completed: task.completed,
          synced: 1,
          deleted: 0,
          tagId: task.tagId,
        });
      }

      console.log("Tasks inserted into local database successfully.");
    } else {
      console.error("Failed to fetch tasks:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const TaskContext = createContext<TaskContextProps>({
  createTask: insertTask,
  getTask,
  parseTask,
  updateTask,
  deleteTask,
  syncUnsyncedTasks: syncUnsyncedRows,
  cleanupDeletedRows,
  fetchAndStoreTasks,
});

export const useTaskContext = () => useContext(TaskContext);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  return (
    <TaskContext.Provider
      value={{
        createTask: insertTask,
        getTask,
        parseTask,
        updateTask,
        deleteTask,
        syncUnsyncedTasks: syncUnsyncedRows,
        cleanupDeletedRows,
        fetchAndStoreTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
