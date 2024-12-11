import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    listView: {
      paddingTop: 15,
      paddingLeft: 15,
      paddingRight: 15,
    },
  });
}
