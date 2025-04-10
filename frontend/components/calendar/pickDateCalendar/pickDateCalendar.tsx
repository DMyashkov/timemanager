import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpandedCalendar, {
  ExpandedCalendarRef,
} from "@/components/calendar/expandedCalendar/expandedCalendar";
import CalendarIcon from "@assets/icons/calendar.svg";
import Sun from "@assets/icons/sun.svg";
import BanIcon from "@assets/icons/ban.svg";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useEffect } from "react";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { router } from "expo-router";
import { DateStruct } from "@/utils/dateTimeSession";

export default function PickDateCalendar({
  bottomSheetRef,
  onPickDate,
  initialDate,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onPickDate: (date: DateStruct | null) => void;
  initialDate?: DateStruct | null;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const ICON_SIZE = 22;
  const calendarRef = useRef<ExpandedCalendarRef>(null);

  useEffect(() => {
    if (initialDate && calendarRef.current) {
      calendarRef.current.goToDate(initialDate);
    }
  }, [initialDate]);

  // Custom backdrop with dimmed effect
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // Hides the backdrop when the sheet is closed
        appearsOnIndex={0} // Shows the backdrop when the sheet is opened
        style={{
          backgroundColor: "#000",
          opacity: 0.4,
          marginTop: -20000,
        }}
      />
    ),
    [],
  );

  const handleDone = () => {
    // If you want to get the currently selected date from the calendar
    const selectedDate = calendarRef.current?.getFocusedDate(); // Assuming the ExpandedCalendar has this method
    if (selectedDate) {
      onPickDate(selectedDate);
    } else {
      onPickDate(null); // If no date is selected, return null
    }
    bottomSheetRef.current?.close();
  };

  const handleCancel = () => {
    // onPickDate(null); // Notify parent of cancellation
    bottomSheetRef.current?.close();
  };

  const handlePickDate = (date: DateStruct) => {
    calendarRef.current?.goToDate(date);
    onPickDate(date);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["75%"]}
      enablePanDownToClose={true}
      enableContentPanningGesture={true}
      handleIndicatorStyle={{ backgroundColor: theme.color.darkGrey }}
      backdropComponent={renderBackdrop}
      index={-1} // Bottom sheet is hidden initially
    >
      <BottomSheetView style={styles.container}>
        <View style={[styles.headerButtonContainer]}>
          <View style={styles.innerButtonsHeader}>
            <SysButton
              text="Cancel"
              isRegular={true}
              onPress={() => {
                handleCancel();
              }}
              isRed={true}
            />
            <SysButton
              text="Done"
              onPress={() => {
                handleDone();
              }}
              isRed={true}
            />
          </View>
          <View style={styles.titleView}>
            <Text style={styles.titleHeader}>Schedule</Text>
          </View>
        </View>
        <View style={[styles.separator, {}]} />

        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => {
              const today = DateStruct.fromDate(new Date());
              handlePickDate(today);
              bottomSheetRef.current?.close();
            }}
            style={styles.row}
            hitSlop={{
              left: 15,
              right: 15,
            }}
          >
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
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity
            onPress={() => {
              const tomorrow = DateStruct.fromDate(
                new Date(new Date().setDate(new Date().getDate() + 1)),
              );
              handlePickDate(tomorrow);
              bottomSheetRef.current?.close();
            }}
            style={styles.row}
            hitSlop={{
              left: 15,
              right: 15,
            }}
          >
            <View style={styles.icon}>
              <Sun
                fill={theme.color.presets.orange.medium}
                height={ICON_SIZE}
                width={ICON_SIZE}
              />
            </View>
            <View style={styles.rightRow}>
              <Text style={styles.title}>Tommorow</Text>
              <Text style={styles.dayNameRight}>Sun</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity
            onPress={() => {
              onPickDate(null); // Return null for "No Date"
              bottomSheetRef.current?.close();
            }}
            style={styles.row}
            hitSlop={{
              left: 15,
              right: 15,
            }}
          >
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
              <Text style={styles.dayNameRight} />
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
        <View style={styles.calendarContainer}>
          <ExpandedCalendar ref={calendarRef} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
