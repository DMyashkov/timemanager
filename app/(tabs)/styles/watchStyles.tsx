import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    watchScreen: {
      backgroundColor: "#fff",
      flex: 1,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: "blue",
    },
    clock: {
      // backgroundColor: "red",
    },
    time: {
      fontSize: theme.fontSize.extraExtraLarge,
      color: theme.color.black,
    },
  });
  return styles;
}
