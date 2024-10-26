import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      flexDirection: "column",
      flex: 1,
    },
    button: {
      flex: 1,
      justifyContent: "center",
      height: 50,
      alignItems: "center",
      backgroundColor: "blue",
    },
    innerButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    },
    container: {
      marginTop: 0,
      height: 50,
      backgroundColor: "red",
    },
  });
}
