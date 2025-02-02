import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
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

  // Construct path by traversing parent references
  const pathIds: number[] = [];
  let currentParent: TagData | undefined = parent;

  while (currentParent) {
    pathIds.push(currentParent.id);
    currentParent = currentParent.parent
      ? dataIndex.get(currentParent.parent)
      : undefined;
  }

  pathIds.reverse(); // Ensure correct order from root to the current node

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
