import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
  });
}

