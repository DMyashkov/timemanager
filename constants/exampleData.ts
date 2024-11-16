import { type DataIndex, ColorPresets } from "@constants/interfaces";

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

const dataIndex = createDataIndex(data2);

export default data2;
export { dataIndex };
