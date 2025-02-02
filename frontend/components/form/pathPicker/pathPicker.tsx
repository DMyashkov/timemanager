import { View, Text, TouchableOpacity } from "react-native";
import { useMemo } from "react";
import useStyles from "./styles";
import ActivityItem from "@/components/module/activityItem/activityItem";
import ProjectItem from "@/components/module/projectItem/projectItem";
import type { TagData, DataIndexLocal } from "@/constants/interfaces";
import type { ColorPresets } from "@/constants/interfaces";

interface PathPickerProps {
  moduleName?: string;
  isProject?: boolean;
  moduleColorPallete: ColorPresets;
  parent: TagData;
  setParent: (parent: TagData) => void;
  dataIndex: DataIndexLocal;
}

export default function PathPicker({
  moduleName = "New Activity",
  moduleColorPallete,
  parent,
  setParent,
  isProject = false,
  dataIndex,
}: PathPickerProps) {
  const styles = useStyles();

  if (!dataIndex) {
    return <></>;
  }

  // Memoize pathIds to prevent unnecessary recalculations
  const pathIds = useMemo(() => {
    const ids: number[] = [];
    let currentParent: TagData | undefined = parent;

    while (currentParent) {
      ids.push(currentParent.id);
      currentParent = currentParent.parent
        ? dataIndex.get(currentParent.parent)
        : undefined;
    }

    return ids.reverse(); // Reverse once after computing all parents
  }, [parent, dataIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Path</Text>
        <TouchableOpacity>
          <Text style={styles.rightButton}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pathContainer}>
        {pathIds.map((id) => {
          const item = dataIndex.get(id);
          if (!item) {
            console.error("Item not found in dataIndex");
            return <></>;
          }
          return (
            <ActivityItem
              isExplicitlyExpanded={true}
              key={id}
              activityName={item.title}
              activityColor={item.colorPreset}
              clickable={false}
            />
          );
        })}
        {!isProject ? (
          <ActivityItem
            activityName={moduleName}
            activityColor={moduleColorPallete}
            clickable={false}
          />
        ) : (
          <ProjectItem
            activityName={moduleName}
            activityColor={moduleColorPallete}
            clickable={false}
          />
        )}
      </View>
    </View>
  );
}
