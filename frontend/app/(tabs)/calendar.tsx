import { View, Text } from "react-native";
import useStyles from "./styles/calendarStyles";
import { useTheme } from "@context/ThemeContext";
import Header from "@components/header/header";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";
import SessionCalendar from "@components/calendar/sessionCalendar/sessionCalendar";
import SessionList from "@components/calendar/sessionList/sessionList";
import CollapsedCalendar from "@/components/calendar/collapsedCalendar/collapsedCalendar";

export default function CalendarScreen() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.screen}>
      <Header title="Calendar" />
      <SwitchWrapper
        buttons={[
          { text: "List", onPress: () => {} },
          { text: "Calendar", onPress: () => {} },
        ]}
        styleSwitch={{ paddingHorizontal: 13 }}
        TopElement={() => (
          <CollapsedCalendar style={{ paddingHorizontal: 15 }} />
        )}
      >
        <SessionList style={styles.rightScreen} />
        <SessionCalendar style={styles.leftScreen} />
      </SwitchWrapper>
    </View>
  );
}
