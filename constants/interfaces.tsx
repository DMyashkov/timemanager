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
