import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  const PADDING_TOP_HEADER = 3;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
      paddingBottom: 30,
    },
    headerButtonContainer: {
      paddingHorizontal: 15,
      paddingTop: PADDING_TOP_HEADER,
      paddingBottom: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    calendarContainer: {},
    row: {
      flexDirection: "row",
      height: 50,
      gap: 10,
      alignItems: "center",
    },
    icon: {
      alignItems: "center",
      justifyContent: "center",
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: theme.color.lightGrey,
    },

    content: {
      paddingHorizontal: 15,
    },
    rightRow: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    title: {
      fontFamily: theme.font.semibold,
      color: theme.color.black,
      fontSize: theme.fontSize.mediumSmall,
    },
    dayNameRight: {
      fontFamily: theme.font.medium,
      color: theme.color.darkGrey,
      fontSize: theme.fontSize.mediumSmall,
    },
    titleHeader: {
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.medium,
      color: theme.color.black,
    },
    innerButtonsHeader: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    titleView: {
      position: "absolute",
      top: PADDING_TOP_HEADER,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      flexDirection: "row",
    },
  });
}
