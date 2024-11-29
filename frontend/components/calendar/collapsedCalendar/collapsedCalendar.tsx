import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

export default function CollapsedCalendar({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={[styles.outer, style]}>
      <Text>Sep 23</Text>
    </View>
  );
}
