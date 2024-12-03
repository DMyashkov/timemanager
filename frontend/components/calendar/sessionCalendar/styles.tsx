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
  });
}
