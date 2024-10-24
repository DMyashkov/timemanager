import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    additem: {
      height: 40,
      borderColor: theme.color.red,
      borderWidth: 2,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      backgroundColor: "#fff",
    },
    addtext: {
      color: theme.color.red,
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.medium,
    },
    additemOuter: {
      flexDirection: "column",
      justifyContent: "flex-end",
      height: 40,
      overflow: "hidden",
    },
  });
}
