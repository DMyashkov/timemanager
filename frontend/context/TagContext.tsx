import { createContext, useContext, useEffect } from "react";
import { openDatabaseSync } from "expo-sqlite/next";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import { dataIndex } from "@/db/schema";
import type { ColorPresets, TagData } from "@/constants/interfaces";

// Open the SQLite database using Expo SQLite and Drizzle
const expoDb = openDatabaseSync("TimeManager.db");
const db = drizzle(expoDb);

// Initialize the database (migrations should be handled separately)
export const initializeDatabase = async () => {
  console.log("Database initialized");
};

// Insert a new tag
export const insertTag = async (item: Omit<TagData, "id">): Promise<number> => {
  const { title, type, productive, lapName, colorPreset, parent, children } =
    item;
  const result = await db
    .insert(dataIndex)
    .values({
      title,
      type,
      productive: productive ? 1 : 0,
      lapName,
      colorPreset,
      parent,
      children: JSON.stringify(children),
    })
    .returning({ insertId: dataIndex.id });
  return result[0].insertId;
};

// Retrieve a tag by ID
export const getTag = async (id: number): Promise<TagData | null> => {
  const result = await db
    .select()
    .from(dataIndex)
    .where(eq(dataIndex.id, id))
    .limit(1);
  if (result.length > 0) {
    const row = result[0];
    if (row.deleted === 1) return null;
    return {
      id: row.id,
      title: row.title ?? "",
      type: row.type === "activity" ? moduleType.activity : moduleType.project,
      productive: row.productive === 1,
      lapName: row.lapName ?? "Lap",
      colorPreset: row.colorPreset as ColorPresets,
      parent: row.parent,
      children: JSON.parse(row.children || "[]"),
    };
  }
  return null;
};

// Update an existing tag
export const updateTag = async (id: number, updates: Partial<TagData>) => {
  const { title, type, productive, lapName, colorPreset, parent, children } =
    updates;
  await db
    .update(dataIndex)
    .set({
      title,
      type,
      productive: productive ? 1 : 0,
      lapName,
      colorPreset,
      parent,
      children: JSON.stringify(children),
      synced: 0,
    })
    .where(eq(dataIndex.id, id));
};

// Delete a tag
export const deleteTag = async (id: number): Promise<void> => {
  const children = await db
    .select({ id: dataIndex.id })
    .from(dataIndex)
    .where(eq(dataIndex.parent, id));
  for (const child of children) {
    await deleteTag(child.id);
  }
  await db
    .update(dataIndex)
    .set({ deleted: 1, synced: 0 })
    .where(eq(dataIndex.id, id));
};

// Sync unsynced rows with the backend
export const syncUnsyncedRows = async () => {
  const rows = await db.select().from(dataIndex).where(eq(dataIndex.synced, 0));
  try {
    const response = await fetch("https://your-backend-url.com/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows),
    });
    if (response.ok) {
      await db
        .update(dataIndex)
        .set({ synced: 1 })
        .where(eq(dataIndex.synced, 0));
      console.log("All unsynced rows marked as synced");
    } else {
      throw new Error("Failed to sync with backend");
    }
  } catch (error) {
    console.error("Sync error:", error);
    throw error;
  }
};

// Cleanup deleted rows that have been synced
export const cleanupDeletedRows = async () => {
  await db
    .delete(dataIndex)
    .where(and(eq(dataIndex.deleted, 1), eq(dataIndex.synced, 1)));
  console.log("Deleted rows cleaned up");
};

interface TagContextProps {
  createTag: (item: Omit<TagData, "id">) => Promise<number>;
  getTag: (id: number) => Promise<TagData | null>;
  updateTag: (id: number, updates: Partial<TagData>) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  syncUnsyncedRows: () => Promise<void>;
  cleanupDeletedRows: () => Promise<void>;
}

export const TagContext = createContext<TagContextProps | null>(null);

// Context Provider
export const TagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    (async () => {
      await initializeDatabase();
    })();
  }, []);

  return (
    <TagContext.Provider
      value={{
        createTag: insertTag,
        getTag,
        updateTag,
        deleteTag,
        syncUnsyncedRows,
        cleanupDeletedRows,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

// Hook to use the context
export const useTagContext = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
};
