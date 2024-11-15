import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    addScreen: {
      backgroundColor: theme.color.coldGrey,
      flex: 1,
    },
    innerAddScreen: {
      paddingTop: 11,
      paddingLeft: 22,
      paddingRight: 22,
      flex: 1,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      gap: 16,
      paddingTop: 16,
    },
  });
}
