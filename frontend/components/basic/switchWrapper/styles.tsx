import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: "column",
    },
    main: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "200%",
      marginLeft: -200,
    },
  });
}
