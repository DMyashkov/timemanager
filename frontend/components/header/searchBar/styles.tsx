import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    searchBar: {
      backgroundColor: theme.color.searchBar.background, // Use dynamic color from theme
      height: 36,
      width: "100%",
      borderRadius: theme.borderRadius.large,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      paddingLeft: 8,
      paddingRight: 8,
    },
    magnifyingGlassContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    textInput: {
      fontFamily: theme.font.regular,
      color: theme.color.black,
      marginLeft: 0,
      flex: 1,
    },
  });
}

