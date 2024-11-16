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
      width: "200%",
      justifyContent: "space-between",
      marginLeft: "-50%",
    },
  });
}

