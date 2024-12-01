import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@/constants/interfaces";

export default function useStyles(colorPallete: Color) {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      backgroundColor: theme.color.white,
      borderRadius: theme.borderRadius.large,
      ...theme.shadow,
    },
    tagContainer: {
      flexDirection: "row",
      gap: 10,
    },
    header: {
      flexDirection: "row",
      height: 40,
      width: "100%",
    },
    workTime: {
      backgroundColor: colorPallete.light,
      height: "100%",
    },
    content: {
      padding: 14,
    },
  });
}
