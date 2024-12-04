import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const ENTRY_LINE_HEIGHT = 17;
  const FULL_ENTRY_HEIGHT = 45;

  return StyleSheet.create({
    outer: {},
    line: {
      backgroundColor: theme.color.defaultGrey,
      flex: 1,
      height: 1,
    },
    entryTime: {
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    },
    inner: {
      marginHorizontal: 15,
      flex: 1,
    },
    timeText: {
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.small,
      color: theme.color.black,
    },
    empty: {
      height: FULL_ENTRY_HEIGHT - ENTRY_LINE_HEIGHT,
    },
    session: {
      position: "absolute",
      backgroundColor: "red",
      right: 0,
      width: "77%",
      zIndex: 1,
      borderRadius: theme.borderRadius.mediumSmall,
    },
    content: {
      flexDirection: "column",
      justifyContent: "space-between",
      flex: 1,
      padding: 5,
      paddingHorizontal: 7,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    project: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: 5,
      alignItems: "center",
    },
    textSession: {
      color: theme.color.white,
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.small,
      zIndex: 1,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rightFooter: {
      flexDirection: "row",
      gap: 7,
    },
    lapsContainer: {
      flexDirection: "row",
      gap: 3,
      alignItems: "center",
    },
    tagContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
}
