import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
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
  });
}

