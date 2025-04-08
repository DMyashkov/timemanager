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
  title: text("title").notNull(),
  description: text("description"),
  date: int("date").notNull(),
  priority: int("priority").notNull(),
  completed: int("completed", { mode: "boolean" }).notNull(),
  synced: int("synced", { mode: "boolean" }).notNull(),
  deleted: int("deleted", { mode: "boolean" }).notNull(),
  tagId: text("tag_id"),
});

export const schema = {
  tags,
  sessions,
  tasks,
};
