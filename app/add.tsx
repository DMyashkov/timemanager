import { View, Text } from "react-native";
import useStyles from "./addStyles";
import { useTheme } from "@context/ThemeContext";

export default function AddScreen() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.addScreen}>
      <Text>AddScreen</Text>
    </View>
  );
}
