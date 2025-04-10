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
  syncUnsyncedRows: (
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
  console.log("Inserting task into database with data:", item);
  const {
    id,
    title,
    description,
    date,
    priority,
    completed,
    synced,
    tagId,
  } = item;

  try {
    const result = await db
      .insert(tasks)
      .values({
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

    console.log("Database insert result:", result);
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
    activityId: task.activityId ?? null,
    projectId: task.projectId ?? null,
    priority: task.priority ?? 4,
    completed: task.completed === 1,
    synced: task.synced ?? 0,
    deleted: task.deleted ?? 0,
    tagId: task.tagId ?? "",
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
  const dbUpdates: Partial<typeof tasks.$inferInsert> = {
    ...updates,
    completed: updates.completed ? 1 : 0,
    synced: 0,
  };

  await db.update(tasks).set(dbUpdates).where(eq(tasks.id, id));
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
  const unsyncedRows = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.synced, 0), eq(tasks.deleted, 0)));

  const deletedRows = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.synced, 0), eq(tasks.deleted, 1)));

  for (const row of unsyncedRows) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/tasks/",
        {
          id: row.id,
          title: row.title,
          description: row.description,
          date: row.date,
          activity_id: row.activityId,
          project_id: row.projectId,
          priority: row.priority,
          completed: row.completed === 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      await db
        .update(tasks)
        .set({ synced: 1 })
        .where(eq(tasks.id, row.id));
    } catch (error) {
      console.error("Error syncing task:", error);
    }
  }

  for (const row of deletedRows) {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${row.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      await db
        .update(tasks)
        .set({ synced: 1 })
        .where(eq(tasks.id, row.id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
};

const cleanupDeletedRows = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<void> => {
  await db
    .delete(tasks)
    .where(and(eq(tasks.deleted, 1), eq(tasks.synced, 1)));
};

const fetchAndStoreTasks = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
): Promise<void> => {
  try {
    const response = await axios.get("http://localhost:8000/api/tasks/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const remoteTasks = response.data;
    for (const task of remoteTasks) {
      await insertTask(db, {
        id: task.id,
        title: task.title,
        description: task.description,
        date: task.date,
        activityId: task.activity_id,
        projectId: task.project_id,
        priority: task.priority,
        completed: task.completed,
        synced: 1,
        deleted: 0,
        tagId: task.tag_id ?? "",
      });
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
  syncUnsyncedRows,
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
        syncUnsyncedRows,
        cleanupDeletedRows,
        fetchAndStoreTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
} 