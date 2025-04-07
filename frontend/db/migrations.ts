import { sql } from "drizzle-orm";
import { sessions } from "./schema";

export const migrations = [
  {
    version: 1,
    statements: [
      sql`
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT,
          module_type TEXT,
          productive INTEGER,
          lap_name TEXT,
          color_preset TEXT,
          parent INTEGER,
          children TEXT NOT NULL,
          synced INTEGER DEFAULT 0,
          deleted INTEGER DEFAULT 0
        );
      `,
      sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          tag_id INTEGER,
          start_time INTEGER,
          end_time INTEGER,
          total_work_time INTEGER,
          total_break_time INTEGER,
          intervals TEXT,
          laps TEXT,
          synced INTEGER DEFAULT 0,
          deleted INTEGER DEFAULT 0
        );
      `,
      sql`CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);`,
    ],
  },
  {
    version: 2,
    statements: [
      // Add new columns
      sql`ALTER TABLE sessions ADD COLUMN start_time INTEGER;`,
      sql`ALTER TABLE sessions ADD COLUMN end_time INTEGER;`,

      // Create index on start_time
      sql`CREATE INDEX idx_sessions_start_time ON sessions(start_time);`,

      // Update existing records to set start_time and end_time from intervals
      sql`
        WITH first_intervals AS (
          SELECT 
            id,
            json_extract(
              json_extract(intervals, '$[0]'),
              '$.startTime'
            ) as first_interval_start,
            json_extract(
              json_extract(intervals, '$[-1]'),
              '$.endTime'
            ) as last_interval_end
          FROM sessions
        )
        UPDATE sessions
        SET 
          start_time = CAST(strftime('%s', json_extract(first_interval_start, '$.date')) * 1000 AS INTEGER),
          end_time = CAST(strftime('%s', json_extract(last_interval_end, '$.date')) * 1000 AS INTEGER)
        FROM first_intervals
        WHERE sessions.id = first_intervals.id;
      `,
    ],
  },
];

