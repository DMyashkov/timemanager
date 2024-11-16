import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import ColorPicker from "./colorPicker";

export default function useStyles() {
  const { theme } = useTheme();
  const SWATCH_SIZE = 40;

  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.white,
      flexDirection: "column",
      padding: 16,
      borderRadius: theme.borderRadius.large,
      gap: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: SWATCH_SIZE,
    },
    colorSwatch: {
      backgroundColor: theme.color.presets.green.medium,
      width: SWATCH_SIZE,
      height: SWATCH_SIZE,
      borderRadius: SWATCH_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    innerContainer: {
      gap: 11,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      flex: 1,
    },
    title: {
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.medium,
    },
  });
}

