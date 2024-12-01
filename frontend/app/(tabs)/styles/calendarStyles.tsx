import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    screen: {
      flex: 1,
      gap: 10,
      backgroundColor: theme.color.white,
    },
    leftScreen: {
      flex: 1,
    },
    rightScreen: {
      flex: 1,
    },
  });
}
