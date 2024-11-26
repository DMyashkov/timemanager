import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const HIT_SLOP_TEXT_INPUT = 10;
  const SEND_BUTTON_SIZE = 34;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 15,
    },
  });
}
