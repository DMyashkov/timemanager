import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { interpolate } from "react-native-reanimated";
import ActivityItem from "@/components/module/activityItem/activityItem";
import { dataIndex } from "@/constants/exampleData";

type Item = {
  id: string;
  title: string;
  type: string; // You can replace `string` with a specific union type like `"activity" | "project"` if known
};

type DataIndexItem = {
  item: Item;
  path: string[];
};

interface ParentPickerProps {
  parent: DataIndexItem;
  setParent: (parent: DataIndexItem) => void;
}

export default function PathPicker() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Path</Text>
        <TouchableOpacity>
          <Text style={styles.rightButton}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pathContainer}>
        <ActivityItem
          clickable={false}
          hasChildren={true}
          isExplicitlyExpanded={true}
        />
        <ActivityItem
          clickable={false}
          hasChildren={true}
          isExplicitlyExpanded={true}
        />
        <ActivityItem />
      </View>
    </View>
  );
}
