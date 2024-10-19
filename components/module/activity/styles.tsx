import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    activity: {
      height: 39,
      backgroundColor: "red",
      marginTop: 0,
    },
  });
}
