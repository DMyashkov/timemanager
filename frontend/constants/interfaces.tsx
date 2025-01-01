export interface Color {
  veryLight: string;
  light: string;
  medium: string;
  dark: string;
}

export type ActivityData = {
  id: number;
  title: string;
  type: moduleType;
  children?: ActivityData[];
  colorPreset: ColorPresets;
  productive: boolean;
  lapName: string;
};

export type DataIndexItem = {
  item: Omit<ActivityData, "children">;
  children: number[];
  path: number[];
};

export type DataIndexLocal = Map<number, DataIndexItem>;

export enum ColorPresets {
  GREEN = "green",
  ORANGE = "orange",
  // Add more presets here as needed
}

export interface SwitchButton {
  text: string;
  onPress: () => void;
}

export interface SwitchProps {
  buttons: SwitchButton[];
}

export enum moduleType {
  activity = "activity",
  project = "project",
}

export enum priorityEnum {
  high = 1,
  medium = 2,
  low = 3,
  none = 4,
}

export interface TaskProps {
  title: string;
  description: string;
  date: Date;
  projectName: string;
  activityName: string;
  priority: priorityEnum;
}

export function getDaysInMonth(month: number, year: number): number {
  // Validate the month range
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  // Use Date object to calculate days in the given month
  return new Date(year, month, 0).getDate();
}

export interface TagPayload {
  title: string;
  type: moduleType; // "activity" | "project"
  parent: string | null; // string ID
  colorPreset: ColorPresets;
  lapName: string;
  productive: boolean;
  createdAt?: string; // Optional for creation
  updatedAt?: string; // Optional for creation or update
}

// export interface ActivityData {
//   id: string;
//   title: string;
//   type: moduleType;
//   productive: boolean;
//   lapName: string;
//   colorPreset: ColorPresets;
//   children?: ActivityData[]; // Recursive children
// }
