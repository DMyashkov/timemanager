import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    childrenContainer: {
      flexDirection: "row",
      marginTop: 8,
    },
    lineContainer: {
      borderColor: theme.color.borderMedium,
      width: 35,
      height: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    list: {
      flex: 1,
      flexDirection: "column",
      gap: 8,
    },
    activityItem: {
      marginBottom: 2,
    },
    line: {
      width: 5,
      borderColor: theme.color.borderMedium,
      borderLeftWidth: 1.5,
      borderBottomWidth: 1.5,
      marginRight: 5,
      borderBottomLeftRadius: 3,
    },
  });
}
