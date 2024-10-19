import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    childrenContainer: {
      flexDirection: "row",
      backgroundColor: "green",
      marginTop: 8,
    },
    lineContainer: {
      borderColor: theme.color.borderMedium,
      backgroundColor: "red",
      width: 35,
      height: "100%",
    },
    list: {
      flex: 1,
      flexDirection: "column",
      gap: 8,
    },
    activityItem: {
      marginBottom: 2,
    },
  });
}
