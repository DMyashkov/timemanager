export interface Color {
  light: string;
  medium: string;
  dark: string;
}

export type DataIndexItem = {
  item: Omit<ActivityData, "activities">; // Item without `activities`
  children: string[]; // IDs of direct children
  path: string[]; // Parent IDs
  colorPreset: ColorPresets; // Assigned color preset
};

export type DataIndex = {
  [key: string]: DataIndexItem;
};

export enum ColorPresets {
  GREEN = "green",
  ORANGE = "orange",
  // Add more presets here as needed
}
