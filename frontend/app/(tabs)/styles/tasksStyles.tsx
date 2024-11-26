import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

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
