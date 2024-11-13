import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    headerModalText: {
      fontSize: theme.fontSize.medium,
      color: theme.color.sysBlue,
      fontFamily: theme.font.medium,
    },
  });
}

