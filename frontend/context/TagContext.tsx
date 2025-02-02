// timemanager/frontend/database/database.ts

import SQLite from "react-native-sqlite-storage";
import { createContext, useContext, useEffect } from "react";

// Enable debug mode during development
SQLite.DEBUG(true);
SQLite.enablePromise(true);

import type { TagData } from "@/constants/interfaces";

const DATABASE_NAME = "TimeManager.db";

// Open or create the database
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: "default",
    });
    console.log("Database opened");
    return db;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
};

// Initialize the database and create tables if they don't exist
export const initializeDatabase = async () => {
  const db = await openDatabase();
  await db.transaction(async (tx) => {
    await tx.executeSql(
      `CREATE TABLE IF NOT EXISTS dataIndex (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT,
        type TEXT,
        productive INTEGER,
        lapName TEXT,
        colorPreset TEXT,
        parent INTEGER,
        path TEXT,
        children TEXT,
        synced INTEGER DEFAULT 0,
        deleted INTEGER DEFAULT 0
      );`,
    );
    console.log("Tables created or already exist");
  });
  return db;
};

export const insertTag = async (item: Omit<TagData, "id">): Promise<number> => {
  const db = await openDatabase();
  const {
    title,
    type,
    productive,
    lapName,
    colorPreset,
    parent: parentId,
    children,
  } = item;
  const childrenString = JSON.stringify(children); // Serialize children array

  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      tx.executeSql(
        `INSERT INTO dataIndex (title, type, productive, lapName, colorPreset, parent, children) 
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          title,
          type,
          productive ? 1 : 0,
          lapName,
          colorPreset,
          parentId,
          childrenString,
        ],
        (_tx, result) => {
          console.log(`InsertId: ${result.insertId}`);
          resolve(result.insertId);
        },
        (_tx, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

const getTag = async (id: number): Promise<TagData | null> => {
  const db = await openDatabase();

  try {
    const [results] = await db.executeSql(
      "SELECT * FROM dataIndex WHERE id = ? LIMIT 1;",
      [id],
    );

    if (results.rows.length > 0) {
      const row = results.rows.item(0);
      if (row.deleted === 1) return null; // Tag is marked as deleted

      return {
        id: row.id,
        title: row.title,
        type: row.type,
        productive: row.productive === 1,
        lapName: row.lapName,
        colorPreset: row.colorPreset,
        parent: row.parent,
        children: JSON.parse(row.children || "[]"),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching tag:", error);
    throw error;
  }
};

// Update an existing DataIndexItem
const updateTag = async (id: number, updates: Partial<TagData>) => {
  const db = await openDatabase();
  const { title, type, productive, lapName, colorPreset, parent, children } =
    updates;
  await db.transaction((tx) => {
    tx.executeSql(
      `UPDATE dataIndex
       SET title = ?, type = ?, productive = ?, lapName = ?, colorPreset = ?, parent = ?, children = ?, synced = 0
       WHERE id = ?;`,
      [
        title,
        type,
        productive ? 1 : 0,
        lapName,
        colorPreset,
        parent,
        JSON.stringify(children),
        id,
      ],
    );
  });
};

// Delete a DataIndexItem
const deleteTag = async (id: number): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Step 1: Fetch the children of the current tag
      tx.executeSql(
        "SELECT id FROM dataIndex WHERE parent = ?;",
        [id],
        async (_tx, results) => {
          const childIds: number[] = [];
          const rows = results.rows;

          for (let i = 0; i < rows.length; i++) {
            childIds.push(rows.item(i).id);
          }

          // Step 2: Recursively delete each child
          try {
            for (const childId of childIds) {
              await deleteTag(childId); // Recursive call
            }

            // Step 3: Delete the current tag after all children are deleted
            tx.executeSql(
              "UPDATE dataIndex SET deleted = 1, synced = 0 WHERE id = ?;",
              [id],
              () => {
                console.log(`Tag with ID ${id} deleted successfully`);
                resolve(); // Resolve the promise
              },
              (_tx, error) => {
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                console.error(
                  `Failed to delete tag with ID ${id}:`,
                  errorMessage,
                );
                reject(new Error(errorMessage)); // Reject with proper error
              },
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error(
              `Failed to delete children of tag with ID ${id}:`,
              errorMessage,
            );
            reject(new Error(errorMessage)); // Reject with proper error
          }
        },
        (_tx, error) => {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            `Failed to fetch children for tag with ID ${id}:`,
            errorMessage,
          );
          reject(new Error(errorMessage)); // Reject with proper error
        },
      );
    });
  });
};

const syncUnsyncedRows = async () => {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      // Fetch all unsynced rows (including deleted ones)
      tx.executeSql(
        "SELECT * FROM dataIndex WHERE synced = 0;",
        [],
        async (_tx, results) => {
          const rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }

          try {
            // Send rows to the backend
            const response = await fetch("https://your-backend-url.com/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(rows),
            });

            if (response.ok) {
              // Mark rows as synced
              tx.executeSql(
                "UPDATE dataIndex SET synced = 1 WHERE synced = 0;",
                [],
                () => {
                  console.log("All unsynced rows marked as synced");
                  resolve();
                },
                (_tx, error) => reject(error),
              );
            } else {
              reject(new Error("Failed to sync with backend"));
            }
          } catch (error) {
            reject(error);
          }
        },
        (_tx, error) => reject(error),
      );
    });
  });
};

const cleanupDeletedRows = async () => {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM dataIndex WHERE deleted = 1 AND synced = 1;", // Only delete rows synced with the backend
        [],
        () => {
          console.log("Deleted rows cleaned up");
          resolve();
        },
        (_tx, error) => {
          console.error("Failed to clean up deleted rows:", error);
          reject(error);
        },
      );
    });
  });
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
