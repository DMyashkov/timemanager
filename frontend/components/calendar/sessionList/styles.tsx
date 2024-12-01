import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      gap: 10,
      paddingHorizontal: 15,
    },
    container: {
      alignSelf: "stretch",
      flex: 1,
      height: "100%",
    },
  });
}
