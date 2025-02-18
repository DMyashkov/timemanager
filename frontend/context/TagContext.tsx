import { createContext, useContext, useEffect } from "react";
import { openDatabaseSync } from "expo-sqlite/next";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import { dataIndex } from "@/db/schema";
import type { ColorPresets, TagData } from "@/constants/interfaces";
import axios from "axios";

// Open the SQLite database using Expo SQLite and Drizzle
const expoDb = openDatabaseSync("TimeManager.db");
const db = drizzle(expoDb);

// Initialize the database (migrations should be handled separately)
export const initializeDatabase = async () => {
  console.log("Database initialized");
};

const generateTemporaryId = (): number =>
  -Math.floor(1000000000 + Math.random() * 9000000000);

const ensureUniqueTemporaryId = async (): Promise<number> => {
  let tempId = 0;
  let exists = true;

  while (exists) {
    tempId = generateTemporaryId();
    const existing = await db
      .select({ id: dataIndex.id })
      .from(dataIndex)
      .where(eq(dataIndex.id, tempId))
      .limit(1);
    exists = existing.length > 0;
  }

  return tempId;
};

// Insert a new tag
export const insertTag = async (item: Omit<TagData, "id">): Promise<number> => {
  const { title, type, productive, lapName, colorPreset, parent, children } =
    item;

  if (parent === null) {
    throw new Error("Parent ID is required");
  }

  const newId = await ensureUniqueTemporaryId();

  updateTag(parent, { children: [...children, newId] });

  const result = await db
    .insert(dataIndex)
    .values({
      id: newId,
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

export const updateTag = async (id: number, updates: Partial<TagData>) => {
  // Fetch the existing tag
  const existingTag = await db
    .select()
    .from(dataIndex)
    .where(eq(dataIndex.id, id))
    .limit(1);

  if (existingTag.length === 0) {
    throw new Error(`Tag with id ${id} not found`);
  }

  const currentTag = existingTag[0];

  // Merge updates with the existing tag data
  const updatedTag = {
    title: updates.title ?? currentTag.title,
    type: updates.type ?? currentTag.type,
    productive:
      updates.productive !== undefined
        ? updates.productive
          ? 1
          : 0
        : currentTag.productive,
    lapName: updates.lapName ?? currentTag.lapName,
    colorPreset: updates.colorPreset ?? currentTag.colorPreset,
    parent: updates.parent ?? currentTag.parent,
    children:
      updates.children !== undefined
        ? JSON.stringify(updates.children)
        : currentTag.children,
    synced: 0, // Mark as needing sync
  };

  if (updates.id && updates.id !== id) {
    const newId = updates.id;

    // Update the parent references of the children
    const children = JSON.parse(currentTag.children || "[]");
    for (const childId of children) {
      await db
        .update(dataIndex)
        .set({ parent: newId, synced: 0 })
        .where(eq(dataIndex.id, childId));
    }

    // Update the parent's children array to include the new ID and remove the old ID
    if (currentTag.parent !== null) {
      const parentTag = await db
        .select({ children: dataIndex.children })
        .from(dataIndex)
        .where(eq(dataIndex.id, currentTag.parent))
        .limit(1);

      if (parentTag.length > 0) {
        const updatedChildren = JSON.parse(parentTag[0].children || "[]").map(
          (childId: number) => (childId === id ? newId : childId),
        );

        await db
          .update(dataIndex)
          .set({ children: JSON.stringify(updatedChildren), synced: 0 })
          .where(eq(dataIndex.id, currentTag.parent));
      }
    }
  }

  // Perform the update
  await db.update(dataIndex).set(updatedTag).where(eq(dataIndex.id, id));
};

// Delete a tag
export const deleteTag = async (id: number): Promise<void> => {
  // Fetch the tag to get the parent ID before deleting
  const tag = await db
    .select({ parent: dataIndex.parent, children: dataIndex.children })
    .from(dataIndex)
    .where(eq(dataIndex.id, id))
    .limit(1);

  if (tag.length === 0) {
    throw new Error(`Tag with id ${id} not found`);
  }

  const { parent, children } = tag[0];

  // Recursively delete child tags
  const childTags = await db
    .select({ id: dataIndex.id })
    .from(dataIndex)
    .where(eq(dataIndex.parent, id));

  for (const child of childTags) {
    await deleteTag(child.id); // Recursively delete child tags
  }

  // Remove the ID from the parent's children array if parent exists
  if (parent !== null) {
    const parentTag = await db
      .select({ children: dataIndex.children })
      .from(dataIndex)
      .where(eq(dataIndex.id, parent))
      .limit(1);

    if (parentTag.length > 0) {
      // Remove the deleted tag ID from the parent's children array
      const updatedChildren = JSON.parse(parentTag[0].children || "[]").filter(
        (childId: number) => childId !== id,
      );

      // Update the parent's children list in the database
      await db
        .update(dataIndex)
        .set({ children: JSON.stringify(updatedChildren), synced: 0 })
        .where(eq(dataIndex.id, parent));
    }
  }

  // Mark the tag as deleted
  await db
    .update(dataIndex)
    .set({ deleted: 1, synced: 0 })
    .where(eq(dataIndex.id, id));

  console.log(`Tag with id ${id} deleted successfully`);
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
  fetchAndStoreTags: (token: string) => Promise<void>;
}

export const fetchAndStoreTags = async (token: string) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/tags/", {
      headers: { Authorization: `Token ${token}` },
    });

    console.log("Fetched tags:", response.data);
    console.log("Response status:", response.status);

    if (response.status === 200) {
      const tags: TagData[] = response.data;
      console.log("Tags fetched successfully.");

      // Clear local database first
      await db.delete(dataIndex).execute();

      console.log("Local database cleared successfully.");

      // Insert fetched tags into SQLite
      for (const tag of tags) {
        console.log("Inserting tag:", tag);
        await insertTag({
          title: tag.title,
          type: tag.type,
          productive: tag.productive,
          lapName: tag.lapName,
          colorPreset: tag.colorPreset,
          parent: tag.parent,
          children: tag.children,
        });
      }

      console.log("Tags inserted into local database successfully.");

      const rootActivity = await db
        .select()
        .from(dataIndex)
        .where(and(eq(dataIndex.id, 0), eq(dataIndex.title, "Root Activity")))
        .limit(1);

      console.log("Root Activity:", rootActivity);

      if (rootActivity.length === 0) {
        await db.insert(dataIndex).values({
          id: 0,
          title: "ROOT",
          type: "activity",
          productive: 1,
          lapName: "Lap",
          colorPreset: "green",
          parent: null,
          children: "[]",
          synced: 0,
          deleted: 0,
        });

        console.log("Root Activity created successfully.");
      } else {
        console.log("Root Activity already exists for user.");
      }

      console.log("Local database populated successfully.");
    } else {
      console.error("Failed to fetch tags:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

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
        fetchAndStoreTags,
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
function createClient(arg0: { url: string }) {
  throw new Error("Function not implemented.");
}
