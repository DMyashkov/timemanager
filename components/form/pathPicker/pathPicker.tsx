import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { interpolate } from "react-native-reanimated";
import ActivityItem from "@/components/module/activityItem/activityItem";
import { dataIndex } from "@/constants/exampleData";
import Activity from "@/components/module/activityItem/activityItem";
import type { DataIndexItem } from "@/constants/interfaces";
import type { ColorPresets } from "@/constants/interfaces";

import type { Color } from "@constants/interfaces";

interface PathPickerProps {
  moduleName?: string;
  isProject?: boolean;
  moduleColorPallete: ColorPresets;
  parent: DataIndexItem;
  setParent: (parent: DataIndexItem) => void;
}

export default function PathPicker({
  moduleName = "New Activity",
  moduleColorPallete,
  parent,
  setParent,
  isProject = false,
}: PathPickerProps) {
  const styles = useStyles();
  // const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Path</Text>
        <TouchableOpacity>
          <Text style={styles.rightButton}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pathContainer}>
        {parent.path.map((id, _) => {
          const item = dataIndex[id as keyof typeof dataIndex];
          const name = item.item.title;
          const color = item.colorPreset;
          return (
            <ActivityItem
              isExplicitlyExpanded={true}
              key={id}
              activityName={name}
              activityColor={color}
              clickable={false}
            />
          );
        })}
        <ActivityItem
          activityName="New Activity"
          activityColor={moduleColorPallete}
          clickable={false}
        />
      </View>
    </View>
  );
}
