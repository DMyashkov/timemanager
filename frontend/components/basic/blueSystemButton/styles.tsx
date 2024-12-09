import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles(isRegular: boolean) {
  const { theme } = useTheme();

  return StyleSheet.create({
    headerModalText: {
      fontSize: theme.fontSize.medium,
      color: theme.color.sysBlue,
      fontFamily: isRegular ? theme.font.regular : theme.font.medium,
    },
  });
}
