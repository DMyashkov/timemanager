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
  totalWorkTime: int("total_work_time"),
  totalBreakTime: int("total_break_time"),
  intervals: text("intervals"),
  laps: text("laps"),
  synced: int("synced").default(0),
  deleted: int("deleted").default(0),
});

export const schema = {
  tags,
  sessions,
};
