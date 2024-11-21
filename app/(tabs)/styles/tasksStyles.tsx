import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "grey",
    },
    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: "center",
    },
  });
}
