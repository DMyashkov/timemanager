import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      backgroundColor: theme.color.white,
      padding: 14,
      borderRadius: theme.borderRadius.large,
      ...theme.shadow,
    },
    tagContainer: {
      flexDirection: "row",
      gap: 10,
    },
  });
}
