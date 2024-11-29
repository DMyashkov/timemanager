export interface Color {
  light: string;
  medium: string;
  dark: string;
}

export type ActivityData = {
  id: string;
  title: string;
  type: moduleType;
  activities?: ActivityData[];
  colorPreset: ColorPresets;
  productive: boolean;
  lapName: string;
};

export type DataIndexItem = {
  item: Omit<ActivityData, "activities">; // Item without `activities`
  children: string[]; // IDs of direct children
  path: string[]; // Parent IDs
};

export type DataIndex = {
  [key: string]: DataIndexItem;
};

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
  activity = 0,
  project = 1,
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
