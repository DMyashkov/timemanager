import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {},
    week: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
    },
    textDay: {
      fontSize: theme.fontSize.mediumSmall,
      color: theme.color.black,
    },
  });
}

