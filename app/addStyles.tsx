import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    addScreen: {
      backgroundColor: "#fff",
      flex: 1,
    },
  });
}

