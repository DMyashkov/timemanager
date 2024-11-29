import { View, Text, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

export default function SessionList({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <ScrollView style={styles.outer}>
      <Text>SessionList</Text>
    </ScrollView>
  );
}
