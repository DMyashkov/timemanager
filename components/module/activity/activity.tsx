import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

export default function Activity() {
  const styles = useStyles();
  const { theme } = useTheme();

  return <View style={styles.activity}></View>;
}
