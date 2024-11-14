import { View, Text } from "react-native";
import useStyles from "./addStyles";
import { useTheme } from "@context/ThemeContext";
import Switch from "@/components/basic/switch/switch";

export default function AddScreen() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.addScreen}>
      <View style={styles.innerAddScreen}>
        <Switch
          buttons={[
            {
              text: "Activity",
              onPress: () => console.log("Activity pressed"),
            },
            {
              text: "Project",
              onPress: () => console.log("Project pressed"),
            },
          ]}
        />
      </View>
    </View>
  );
}
