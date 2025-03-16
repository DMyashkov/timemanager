import { createContext, useContext, useEffect } from "react";
import { openDatabaseSync } from "expo-sqlite";
import type { ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import {
  moduleTypeEnum,
  type ColorPresets,
  type TagData,
} from "@/constants/interfaces";
import { tags } from "@/db/schema";
import axios from "axios";
import type { schema } from "@/db/schema";

const insertTag = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  item: Omit<TagData, "id" | "synced" | "deleted">,
): Promise<number> => {
  const {
    title,
    moduleType,
    productive,
    lapName,
    colorPreset,
    parent,
    children,
  } = item;

  // ✅ Allow parent to be null (for root-level tags)
  if (parent !== null) {
    const parentTag = db.select().from(tags).where(eq(tags.id, parent)).get();
    if (!parentTag) {
      throw new Error(`Parent tag with ID ${parent} not found`);
    }

    const currentChildren: number[] = parentTag?.children
      ? JSON.parse(parentTag.children)
      : [];

    // Insert new tag
    const result = await db
      .insert(tags)
      .values({
        title,
        moduleType,
        productive: productive ? 1 : 0,
        lapName,
        colorPreset,
        parent,
        children: JSON.stringify(children),
      })
      .returning({ insertId: tags.id });

    // Update parent to include new child
    await updateTag(db, parent, {
      children: [...currentChildren, result[0].insertId],
    });

    console.log("Whole table after insert:", await db.select().from(tags));

    return result[0].insertId;
  }
  // ✅ Insert tag without a parent (root-level tag)
  const result = await db
    .insert(tags)
    .values({
      title,
      moduleType,
      productive: productive ? 1 : 0,
      lapName,
      colorPreset,
      parent: null,
      children: JSON.stringify(children),
    })
    .returning({ insertId: tags.id });

  console.log("Whole table after insert:", await db.select().from(tags));

  return result[0].insertId;
};

const parseTag = (result: (typeof tags.$inferSelect)[]): TagData | null => {
  if (result.length === 0) return null;

  const row = result[0];
  if (row.deleted === 1) return null;

  return {
    id: row.id,
    title: row.title ?? "",
    moduleType:
      row.moduleType === "activity"
        ? moduleTypeEnum.activity
        : moduleTypeEnum.project,
    productive: row.productive === 1,
    lapName: row.lapName ?? "Lap",
    colorPreset: row.colorPreset as ColorPresets,
    parent: row.parent,
    children: JSON.parse(row.children || "[]"),
  };
};

const getTag = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
): Promise<TagData | null> => {
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return parseTag(result);
};

const updateTag = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
  updates: Partial<TagData>,
) => {
  // Fetch the existing tag
  const existingTag = await db
    .select()
    .from(tags)
    .where(eq(tags.id, id))
    .limit(1);

  if (existingTag.length === 0) {
    throw new Error(`Tag with id ${id} not found`);
  }

  const currentTag = existingTag[0];

  const updatedTag = {
    title: updates.title ?? currentTag.title,
    type: updates.moduleType ?? currentTag.moduleType,
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
    synced: 0,
  };

  if (updates.id && updates.id !== id) {
    const newId = updates.id;

    const children = JSON.parse(currentTag.children || "[]");
    for (const childId of children) {
      await db
        .update(tags)
        .set({ parent: newId, synced: 0 })
        .where(eq(tags.id, childId));
    }

    if (currentTag.parent !== null) {
      const parentTag = await db
        .select({ children: tags.children })
        .from(tags)
        .where(eq(tags.id, currentTag.parent))
        .limit(1);

      if (parentTag.length > 0) {
        const updatedChildren = JSON.parse(parentTag[0].children || "[]").map(
          (childId: number) => (childId === id ? newId : childId),
        );

        await db
          .update(tags)
          .set({ children: JSON.stringify(updatedChildren), synced: 0 })
          .where(eq(tags.id, currentTag.parent));
      }
    }
  }

  await db.update(tags).set(updatedTag).where(eq(tags.id, id));
};

// Delete a tag
const deleteTag = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number,
): Promise<void> => {
  // Fetch the tag to get the parent ID before deleting
  const tag = await db
    .select({ parent: tags.parent, children: tags.children })
    .from(tags)
    .where(eq(tags.id, id))
    .limit(1);

  if (tag.length === 0) {
    throw new Error(`Tag with id ${id} not found`);
  }

  const { parent, children } = tag[0];

  const childTags = await db
    .select({ id: tags.id })
    .from(tags)
    .where(eq(tags.parent, id));

  for (const child of childTags) {
    await deleteTag(db, child.id);
  }

  if (parent !== null) {
    const parentTag = await db
      .select({ children: tags.children })
      .from(tags)
      .where(eq(tags.id, parent))
      .limit(1);

    if (parentTag.length > 0) {
      const updatedChildren = JSON.parse(parentTag[0].children || "[]").filter(
        (childId: number) => childId !== id,
      );

      await db
        .update(tags)
        .set({ children: JSON.stringify(updatedChildren), synced: 0 })
        .where(eq(tags.id, parent));
    }
  }

  await db.update(tags).set({ deleted: 1, synced: 0 }).where(eq(tags.id, id));

  console.log(`Tag with id ${id} deleted successfully`);
};

export const syncUnsyncedRows = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
) => {
  let rows = await db.select().from(tags).where(eq(tags.synced, 0));
  // console.log("Unsynced rows found: ", rows);

  // console.log("Sending rows for sync: ", rows);

  if (rows.length === 0) {
    console.log("Tried to sync rows but no unsynced rows found");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/tags/sync/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(rows),
    });

    if (response.ok) {
      await db.update(tags).set({ synced: 1 }).where(eq(tags.synced, 0));
      console.log("All unsynced rows marked as synced");
      await cleanupDeletedRows(db);
    } else {
      throw new Error("Failed to sync with backend");
    }
  } catch (error) {
    console.error("Sync error:", error);
    console.log("Attempting to sync all data from frontend...");

    try {
      // Fetch all rows instead of just the unsynced ones
      rows = await db.select().from(tags);
      console.log("Syncing all rows:", rows);

      const fullSyncResponse = await fetch(
        "http://127.0.0.1:8000/api/tags/sync/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(rows),
        },
      );

      if (fullSyncResponse.ok) {
        await db.update(tags).set({ synced: 1 });
        console.log("All data successfully synced after retry.");
        await cleanupDeletedRows(db);
      } else {
        throw new Error("Full data sync failed");
      }
    } catch (fullSyncError) {
      console.error("Full sync error:", fullSyncError);
      throw fullSyncError;
    }
  }
};

// Cleanup deleted rows that have been synced
const cleanupDeletedRows = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  await db.delete(tags).where(and(eq(tags.deleted, 1), eq(tags.synced, 1)));
  console.log("Deleted rows cleaned up");
};

interface TagContextProps {
  createTag: (
    db: ExpoSQLiteDatabase<typeof schema>,
    item: Omit<TagData, "id" | "synced" | "deleted">,
  ) => Promise<number>;
  getTag: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<TagData | null>;
  parseTag: (result: (typeof tags.$inferSelect)[]) => TagData | null;
  updateTag: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
    updates: Partial<TagData>,
  ) => Promise<void>;
  deleteTag: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<void>;
  syncUnsyncedRows: (
    db: ExpoSQLiteDatabase<typeof schema>,
    token: string,
  ) => Promise<void>;
  cleanupDeletedRows: (db: ExpoSQLiteDatabase<typeof schema>) => Promise<void>;
  fetchAndStoreTags: (
    db: ExpoSQLiteDatabase<typeof schema>,
    token: string,
  ) => Promise<void>;
}

const fetchAndStoreTags = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
) => {
  try {
    console.log("Auth token:", token);

    const response = await axios.get("http://127.0.0.1:8000/api/tags/", {
      headers: { Authorization: `Token ${token}` },
    });

    if (response.status === 200) {
      let fetchedTags: TagData[] = response.data;
      console.log("Tags fetched successfully.");

      // Clear local database first
      await db.delete(tags).execute();
      console.log("Local database cleared successfully.");

      // Fix malformed children fields
      fetchedTags = fetchedTags.map((tag) => ({
        ...tag,
        children: parseChildren(tag.children),
      }));

      // Find the actual root tag
      const rootTag = fetchedTags.find((tag) => tag.parent === null);
      if (!rootTag) {
        throw new Error("No root tag found in fetched data!");
      }

      console.log("Detected root tag:", rootTag);

      // Ensure all references to `parent: 0` are replaced with the actual root ID
      fetchedTags = fetchedTags.map((tag) => ({
        ...tag,
        parent: tag.parent === 0 ? rootTag.id : tag.parent,
      }));

      // Build graph (adjacency list)
      const tagMap = new Map<number | null, TagData[]>();
      for (const tag of fetchedTags) {
        if (!tagMap.has(tag.parent)) {
          tagMap.set(tag.parent, []);
        }
        tagMap.get(tag.parent)!.push(tag);
      }

      console.log("Tag graph constructed successfully.");

      // Insert in BFS order
      const insertedTags = new Set<number>();
      const queue: TagData[] = [rootTag];

      while (queue.length > 0) {
        const tag = queue.shift()!; // Process first tag in queue

        console.log("Inserting tag:", tag);
        const insertedId = await insertTag(db, {
          title: tag.title,
          moduleType: tag.moduleType,
          productive: tag.productive,
          lapName: tag.lapName,
          colorPreset: tag.colorPreset,
          parent: tag.parent,
          children: tag.children,
        });

        insertedTags.add(insertedId);

        // Add children to the queue
        if (tagMap.has(tag.id)) {
          for (const child of tagMap.get(tag.id)!) {
            if (!insertedTags.has(child.id)) {
              queue.push(child);
            }
          }
        }
      }

      console.log("Tags inserted into the local database successfully.");
    } else {
      console.error("Failed to fetch tags:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

// Fix children parsing issues
const parseChildren = (children: any): number[] => {
  if (typeof children === "string") {
    try {
      return JSON.parse(children.replace(/^"|"$/g, "").replace(/\\"/g, '"'));
    } catch (e) {
      console.error("Error parsing children:", children, e);
      return [];
    }
  }
  return Array.isArray(children) ? children : [];
};

export const TagContext = createContext<TagContextProps | null>(null);

// Context Provider
export const TagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TagContext.Provider
      value={{
        createTag: insertTag,
        getTag,
        parseTag,
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
