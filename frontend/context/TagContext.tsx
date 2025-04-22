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
import { useFocus } from "./FocusContext";
import { API_URL } from "@/utils/config";

interface TagContextProps {
  createTag: (
    db: ExpoSQLiteDatabase<typeof schema>,
    item: TagData & { id?: number; synced?: number; deleted?: number },
  ) => Promise<number>;
  getTag: (
    db: ExpoSQLiteDatabase<typeof schema>,
    id: number,
  ) => Promise<TagData | null>;
  getAllTags: (
    db: ExpoSQLiteDatabase<typeof schema>,
  ) => Promise<TagData[]>;
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
const insertTag = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  item: TagData & { id?: number; synced?: number; deleted?: number },
): Promise<number> => {
  const {
    id,
    title,
    moduleType,
    productive,
    lapName,
    colorPreset,
    parent,
    children,
    synced,
  } = item;
  // console.log("Tag ", title, " has a synced value of ", synced);

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
        id,
        title,
        moduleType,
        productive: productive ? 1 : 0,
        lapName,
        colorPreset,
        parent,
        children: JSON.stringify(children),
        synced: synced ?? 0,
      })
      .returning({ insertId: tags.id });

    // Update parent to include new child
    if (!currentChildren.includes(result[0].insertId)) {
      await updateTag(db, parent, {
        children: [...currentChildren, result[0].insertId],
      });
    }

    // console.log("Whole table after insert:", await db.select().from(tags));

    return result[0].insertId;
  }
  // ✅ Insert tag without a parent (root-level tag)
  const result = await db
    .insert(tags)
    .values({
      id,
      title,
      moduleType,
      productive: productive ? 1 : 0,
      lapName,
      colorPreset,
      parent: null,
      children: JSON.stringify(children),
      synced,
    })
    .returning({ insertId: tags.id });

  // console.log("Whole table after insert:", await db.select().from(tags));

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
    deleted: row.deleted ?? 0,
    synced: row.synced ?? 0,
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
  const rows = await db.select().from(tags).where(eq(tags.synced, 0));
  console.log("Unsynced rows TAGS:", rows);

  if (rows.length === 0) {
    console.log("Tried to sync tags but no unsynced rows found");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/tags/sync/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(rows),
    });

    if (response.ok) {
      await db
        .update(tags)
        .set({ synced: 1 })
        .where(eq(tags.synced, 0));
      await cleanupDeletedRows(db);
    } else {
      throw new Error("Failed to sync with backend");
    }
  } catch (error) {
    console.error("Sync error TAGS:", error);
  }
};

// Cleanup deleted rows that have been synced
const cleanupDeletedRows = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  await db.delete(tags).where(and(eq(tags.deleted, 1), eq(tags.synced, 1)));
  console.log("Deleted rows cleaned up");
};

const fetchAndStoreTags = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  token: string,
) => {
  try {
    const response = await axios.get(`${API_URL}/api/tags/`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (response.status === 200) {
      const fetchedTags: TagData[] = response.data;

      // Clear local database first
      await db.delete(tags);

      // Group tags by parent ID
      const tagMap = new Map<number | null, TagData[]>();
      const visited = new Set<number>(); // Track inserted tags

      for (const tag of fetchedTags) {
        const parentTags = tagMap.get(tag.parent) ?? [];
        parentTags.push(tag);
        tagMap.set(tag.parent, parentTags);
      }

      // BFS insertion using a queue
      const queue: TagData[] = tagMap.get(null) ?? []; // Start with root-level tags

      while (queue.length > 0) {
        const tag: TagData | undefined = queue.shift(); // Remove first element
        if (!tag) continue;

        // Skip if already inserted
        if (visited.has(tag.id)) continue;
        visited.add(tag.id);

        // Ensure children is a properly formatted JSON array string
        const childrenArray =
          tagMap.get(tag.id)?.map((child) => child.id) || [];
        const childrenString = JSON.stringify(childrenArray);

        await insertTag(db, {
          id: tag.id, // Ensure ID is preserved
          title: tag.title,
          moduleType: tag.moduleType,
          productive: tag.productive,
          lapName: tag.lapName,
          colorPreset: tag.colorPreset,
          parent: tag.parent,
          children: childrenArray,
          synced: 1,
        } as TagData);

        // Add children to queue
        const childrenTags = tagMap.get(tag.id) ?? [];
        if (childrenTags.length > 0) {
          queue.push(...childrenTags);
        }
      }

      console.log("Tags inserted into local database successfully.");

      // Ensure "Root Activity" exists only ONCE
      const rootActivity = await db
        .select()
        .from(tags)
        .where(eq(tags.id, 0))
        .limit(1);

      if (rootActivity.length === 0) {
        await db.insert(tags).values({
          id: 0,
          title: "ROOT",
          moduleType: "activity",
          productive: 1,
          lapName: "Lap",
          colorPreset: "green",
          parent: null,
          children: "[]", // Empty array for root initially
        });

        console.log("Root Activity created successfully.");
      } else {
        console.log("Root Activity already exists.");
      }

      console.log("Local database populated successfully.");
    } else {
      console.error("Failed to fetch tags:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

const getAllTags = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<TagData[]> => {
  const results = await db
    .select()
    .from(tags)
    .where(eq(tags.deleted, 0))
    .all();

  return results.map((row) => ({
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
    deleted: row.deleted ?? 0,
    synced: row.synced ?? 0,
  }));
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
        getAllTags,
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
