import { sql } from "drizzle-orm";
import { sessions } from "./schema";

export const migrations = [
  {
    version: 1,
    statements: [
      sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tag_id INTEGER NOT NULL,
          total_work_time INTEGER NOT NULL DEFAULT 0,
          total_break_time INTEGER NOT NULL DEFAULT 0,
          intervals TEXT NOT NULL DEFAULT '[]',
          laps TEXT NOT NULL DEFAULT '[]',
          synced INTEGER NOT NULL DEFAULT 0,
          deleted INTEGER NOT NULL DEFAULT 0
        );
      `,
    ],
  },
]; 