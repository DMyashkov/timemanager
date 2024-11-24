import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.white,
      flexDirection: "column",
      borderRadius: theme.borderRadius.large,
      paddingVertical: 15,
      paddingHorizontal: 9,
      gap: 15,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
      paddingHorizontal: 11,
    },
    title: {
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.medium,
    },
    pathContainer: {
      gap: 15,
    },
    rightButton: {
      color: theme.color.sysBlue,
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.mediumSmall,
    },
  });
}
