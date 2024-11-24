import {
  type DataIndex,
  ColorPresets,
  type ActivityData,
  moduleType,
} from "@constants/interfaces";

const data2: ActivityData = {
  id: "root",
  title: "Root",
  type: moduleType.activity,
  productive: true,
  lapName: "Lap",
  colorPreset: ColorPresets.GREEN,

  activities: [
    {
      id: "activity-1",
      title: "Activity 1",
      type: moduleType.activity,
      colorPreset: ColorPresets.ORANGE,
      productive: true,
      lapName: "Lap",

      activities: [
        {
          id: "project-1",
          title: "Project 1",
          type: moduleType.project,
          colorPreset: ColorPresets.ORANGE,
          productive: true,
          lapName: "Lap",
        },
        {
          id: "activity-1-1",
          title: "Activity 1.1",
          type: moduleType.activity,
          colorPreset: ColorPresets.GREEN,
          productive: true,
          lapName: "Lap",

          activities: [
            {
              id: "activity-1-1-1",
              title: "Activity 1.1.1",
              type: moduleType.activity,
              productive: true,
              lapName: "Lap",
              colorPreset: ColorPresets.GREEN,

              activities: [
                {
                  id: "activity-1-1-1-1",
                  title: "Activity 1.1.1.1",
                  type: moduleType.activity,
                  productive: true,
                  colorPreset: ColorPresets.GREEN,

                  lapName: "Lap",
                  activities: [
                    {
                      id: "activity-1-1-1-1-1",
                      title: "Activity 1.1.1.1.1",
                      type: moduleType.activity,
                      productive: true,
                      colorPreset: ColorPresets.ORANGE,
                      lapName: "Exercise",
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
      productive: true,
      lapName: "Lap",
    },
  ],
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
      productive: node.productive,
      lapName: node.lapName,
      colorPreset: node.colorPreset, // Default color preset
    },
    children: node.activities ? node.activities.map((child) => child.id) : [],
    path: [...path],
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
