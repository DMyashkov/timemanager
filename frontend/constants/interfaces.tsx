export interface Color {
  veryLight: string;
  light: string;
  medium: string;
  dark: string;
}

export type TagData = {
  id: number;
  title: string;
  moduleType: moduleTypeEnum;
  colorPreset: ColorPresets;
  productive: boolean;
  lapName: string;
  children: number[];
  parent: number | null;
};

export type DataIndexLocal = Map<number, TagData>;

export enum ColorPresets {
  GREEN = "green",
  ORANGE = "orange",
}

export interface SwitchButton {
  text: string;
  onPress: () => void;
}

export interface SwitchProps {
  buttons: SwitchButton[];
}

export enum moduleTypeEnum {
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
