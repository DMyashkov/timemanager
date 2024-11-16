enum moduleType {
  activity = 0,
  project = 1,
}

type ActivityData = {
  id: string;
  title: string;
  type: moduleType;
  activities?: ActivityData[];
  colorPreset?: ColorPresets;
};

import { THEME } from "@/constants/theme";
export enum ColorPresets {
  GREEN = "green",
  ORANGE = "orange",
  // Add more presets here as needed
}
const data2: ActivityData = {
  id: "root",
  title: "Root",
  type: moduleType.activity,
  activities: [
    {
      id: "activity-1",
      title: "Activity 1",
      type: moduleType.activity,
      colorPreset: ColorPresets.ORANGE,
      activities: [
        {
          id: "project-1",
          title: "Project 1",
          type: moduleType.project,
          colorPreset: ColorPresets.ORANGE,
        },
        {
          id: "activity-1-1",
          title: "Activity 1.1",
          type: moduleType.activity,
          colorPreset: ColorPresets.GREEN,
          activities: [
            {
              id: "activity-1-1-1",
              title: "Activity 1.1.1",
              type: moduleType.activity,
              activities: [
                {
                  id: "activity-1-1-1-1",
                  title: "Activity 1.1.1.1",
                  type: moduleType.activity,
                  activities: [
                    {
                      id: "activity-1-1-1-1-1",
                      title: "Activity 1.1.1.1.1",
                      type: moduleType.activity,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "activity-2",
      title: "Activity 2",
      type: moduleType.activity,
      colorPreset: ColorPresets.GREEN,
    },
  ],
};

const colorPresetsKeys = Object.keys(THEME.light.color.presets) as Array<
  keyof typeof ColorPresets
>;

// Function to get a random color preset key
function getRandomColorPreset(): ColorPresets {
  const randomKey =
    colorPresetsKeys[Math.floor(Math.random() * colorPresetsKeys.length)];
  return ColorPresets[randomKey.toUpperCase() as keyof typeof ColorPresets];
}

type DataIndex = {
  [key: string]: {
    item: Omit<ActivityData, "activities">; // Item without `activities`
    children: string[]; // IDs of direct children
    path: string[]; // Parent IDs
    colorPreset: ColorPresets; // Assigned color preset
  };
};

function createDataIndex(
  node: ActivityData,
  index: DataIndex = {},
  path: string[] = [],
): DataIndex {
  index[node.id] = {
    item: {
      id: node.id,
      title: node.title,
      type: node.type,
    },
    children: node.activities ? node.activities.map((child) => child.id) : [],
    path: [...path],
    colorPreset: node.colorPreset || ColorPresets.GREEN, // Default color preset
  };

  if (node.activities) {
    for (const child of node.activities) {
      createDataIndex(child, index, [...path, node.id]);
    }
  }

  return index;
}

// Generate the index
const dataIndex = {
  "activity-1": {
    children: ["project-1", "activity-1-1"],
    colorPreset: "orange",
    item: { id: "activity-1", title: "Activity 1", type: 0 },
    path: ["root"],
  },
  "activity-1-1": {
    children: ["activity-1-1-1"],
    colorPreset: "green",
    item: { id: "activity-1-1", title: "Activity 1.1", type: 0 },
    path: ["root", "activity-1"],
  },
  "activity-1-1-1": {
    children: ["activity-1-1-1-1"],
    colorPreset: "green",
    item: { id: "activity-1-1-1", title: "Activity 1.1.1", type: 0 },
    path: ["root", "activity-1", "activity-1-1"],
  },
  "activity-1-1-1-1": {
    children: ["activity-1-1-1-1-1"],
    colorPreset: "green",
    item: { id: "activity-1-1-1-1", title: "Activity 1.1.1.1", type: 0 },
    path: ["root", "activity-1", "activity-1-1", "activity-1-1-1"],
  },
  "activity-1-1-1-1-1": {
    children: [],
    colorPreset: "green",
    item: { id: "activity-1-1-1-1-1", title: "Activity 1.1.1.1.1", type: 0 },
    path: [
      "root",
      "activity-1",
      "activity-1-1",
      "activity-1-1-1",
      "activity-1-1-1-1",
    ],
  },
  "activity-2": {
    children: [],
    colorPreset: "green",
    item: { id: "activity-2", title: "Activity 2", type: 0 },
    path: ["root"],
  },
  "project-1": {
    children: [],
    colorPreset: "orange",
    item: { id: "project-1", title: "Project 1", type: 1 },
    path: ["root", "activity-1"],
  },
  root: {
    children: ["activity-1", "activity-2"],
    colorPreset: "green",
    item: { id: "root", title: "Root", type: 0 },
    path: [],
  },
};

console.log(dataIndex);

export default data2;
export { dataIndex };
