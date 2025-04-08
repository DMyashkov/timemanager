import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tags = sqliteTable("tags", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  moduleType: text("module_type"),
  productive: int("productive"),
  lapName: text("lap_name"),
  colorPreset: text("color_preset"),
  parent: int("parent"),
  children: text("children"),
  synced: int("synced").default(0),
  deleted: int("deleted").default(0),
});

export const sessions = sqliteTable("sessions", {
  id: int("id").primaryKey({ autoIncrement: true }),
  tagId: int("tag_id"),
  startTime: int("start_time"),
  endTime: int("end_time"),
  totalWorkTime: int("total_work_time"),
  totalBreakTime: int("total_break_time"),
  intervals: text("intervals"),
  laps: text("laps"),
  synced: int("synced").default(0),
  deleted: int("deleted").default(0),
});

export const tasks = sqliteTable("tasks", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  date: int("date"), // Unix timestamp in milliseconds
  activityId: int("activity_id"),
  projectId: int("project_id"),
  priority: int("priority"),
  completed: int("completed").default(0),
  synced: int("synced").default(0),
  deleted: int("deleted").default(0),
  tagId: text("tag_id"),
});

export const schema = {
  tags,
  sessions,
  tasks,
};
