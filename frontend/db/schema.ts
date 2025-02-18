import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dataIndex = sqliteTable("dataIndex", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  type: text("module_type"),
  productive: int("productive"),
  lapName: text("lap_name"),
  colorPreset: text("color_preset"),
  parent: int("parent"),
  path: text("path"),
  children: text("children"),
  synced: int("synced").default(0),
  deleted: int("deleted").default(0),
});

export const schema = {
  dataIndex,
};
