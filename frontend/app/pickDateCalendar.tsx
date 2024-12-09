import { View, Text } from "react-native";
import useStyles from "./styles/pickDateCalendarStyles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpandedCalendar from "@components/calendar/expandedCalendar/expandedCalendar";
import CalendarIcon from "@assets/icons/calendar.svg";
import Sun from "@assets/icons/sun.svg";
import BanIcon from "@assets/icons/ban.svg";

export default function PickDateCalendar() {
  const styles = useStyles();
  const { theme } = useTheme();
  const ICON_SIZE = 22;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <CalendarIcon
              fill={theme.color.darkRed}
              height={ICON_SIZE}
              width={ICON_SIZE}
            />
          </View>
          <View style={styles.rightRow}>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.dayNameRight}>Sun</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Sun
              fill={theme.color.presets.yellow.dark}
              height={ICON_SIZE}
              width={ICON_SIZE}
            />
          </View>
          <View style={styles.rightRow}>
            <Text style={styles.title}>Tommorow</Text>
            <Text style={styles.dayNameRight}>Sun</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.icon}>
            <BanIcon
              fill={theme.color.darkGrey}
              height={ICON_SIZE}
              width={ICON_SIZE}
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </View>
          <View style={styles.rightRow}>
            <Text style={styles.title}>No Date</Text>
            <Text style={styles.dayNameRight}></Text>
          </View>
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <ExpandedCalendar />
      </View>
    </SafeAreaView>
  );
}
