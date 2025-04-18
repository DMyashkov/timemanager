import { View } from "react-native";
import useStyles from "./styles/calendarStyles";
import { useTheme } from "@context/ThemeContext";
import Header from "@/components/header/headerBasic/header";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";
import SessionCalendar from "@components/calendar/sessionCalendar/sessionCalendar";
import SessionList from "@components/calendar/sessionList/sessionList";
import CollapsedCalendar from "@/components/calendar/collapsedCalendar/collapsedCalendar";
import { useProductivityMetric } from "@/hooks/useProductivityMetric";
import { DateStruct, Time } from "@/utils/dateTimeSession";
import { useState } from "react";

export default function CalendarScreen() {
  const styles = useStyles();
  const { theme } = useTheme();
  const productiveTime = useProductivityMetric();
  const productiveTimeObj = Time.fromSeconds(productiveTime);
  const today = DateStruct.fromDate(new Date());
  const [focusedDate, setFocusedDate] = useState(new DateStruct(today));

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
          <CollapsedCalendar
            style={{ paddingHorizontal: 15 }}
            productiveTime={productiveTimeObj}
            focusedDate={focusedDate}
            setFocusedDate={setFocusedDate}
          />
        )}
      >
        <SessionList style={styles.leftScreen} />
        <SessionCalendar style={styles.rightScreen} />
      </SwitchWrapper>
    </View>
  );
}
