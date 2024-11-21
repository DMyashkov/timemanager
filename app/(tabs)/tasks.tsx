import { View, Text } from "react-native";
import useStyles from "./styles/tasksStyles";
import { useTheme } from "@context/ThemeContext";

export default function TasksView() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.screen}>
      <Text>TasksView</Text>
    </View>
  );
}
