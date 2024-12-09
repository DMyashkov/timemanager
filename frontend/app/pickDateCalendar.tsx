import { View, Text } from "react-native";
import useStyles from "./styles/pickDateCalendarStyles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpandedCalendar from "@components/calendar/expandedCalendar/expandedCalendar";

export default function PickDateCalendar() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ExpandedCalendar />
    </SafeAreaView>
  );
}
