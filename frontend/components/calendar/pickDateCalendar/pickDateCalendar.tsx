import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpandedCalendar from "@/components/calendar/expandedCalendar/expandedCalendar";
import CalendarIcon from "@assets/icons/calendar.svg";
import Sun from "@assets/icons/sun.svg";
import BanIcon from "@assets/icons/ban.svg";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { router } from "expo-router";

export default function PickDateCalendar({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const ICON_SIZE = 22;

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
  return (
    <BottomSheet
      ref={bottomSheetRef}
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
                bottomSheetRef.current?.close();
              }}
              isRed={true}
            />
            <SysButton
              text="Done"
              onPress={() => {
                bottomSheetRef.current?.close();
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
          <View style={styles.separator} />

          <View style={styles.row}>
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
          </View>
          <View style={styles.separator} />

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
              <Text style={styles.dayNameRight} />
            </View>
          </View>
          <View style={styles.separator} />
        </View>
        <View style={styles.calendarContainer}>
          <ExpandedCalendar />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
