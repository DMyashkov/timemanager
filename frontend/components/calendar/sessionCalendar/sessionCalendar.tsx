import { View, Text, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
  
export default function SessionCalendar({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.outer, style]}>
      <Text>SessionCalendar</Text>
    </ScrollView>
  );
}
