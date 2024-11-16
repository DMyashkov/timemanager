import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { interpolate } from "react-native-reanimated";
import ActivityItem from "@/components/module/activityItem/activityItem";
import { dataIndex } from "@/constants/exampleData";
import Activity from "@/components/module/activityItem/activityItem";

type Item = {
  id: string;
  title: string;
  type: string; // You can replace `string` with a specific union type like `"activity" | "project"` if known
};

type DataIndexItem = {
  item: Item;
  path: string[];
};

interface PathPickerProps {
  parent: DataIndexItem;
  setParent: (parent: DataIndexItem) => void;
}

export default function PathPicker({ parent, setParent }: PathPickerProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  console.log(parent);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Path</Text>
        <TouchableOpacity>
          <Text style={styles.rightButton}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pathContainer}>
        {parent.path.map((id, index) => {
          const item = dataIndex[id as keyof typeof dataIndex];
          const name = item.item.title;
          return (
            <ActivityItem
              isExplicitlyExpanded={true}
              key={id}
              activityName={name}
            />
          );
        })}
      </View>
    </View>
  );
}
