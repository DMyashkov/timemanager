// timemanager/components/header/styles.tsx
import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme(); // Access the current theme from context

  return StyleSheet.create({
    header: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    headerContentContainer: {
      flexDirection: "column",
      gap: 10,
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: theme.fontSize.large, // Use dynamic font size from theme
      fontFamily: theme.font.semibold, // Use dynamic font family from theme
      color: theme.color.black, // Use dynamic color from theme
    },
    headerFirstRow: {
      flexDirection: "row",
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 7,
    },
    searchBar: {
      backgroundColor: theme.color.searchBar.background, // Use dynamic color from theme
      height: 36,
      width: "100%",
      borderRadius: 10,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      paddingLeft: 8,
      paddingRight: 8,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
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
    optionsContainer: {
      height: 82,
      borderRadius: 10,
      overflow: "hidden",
      borderColor: theme.color.borderLight,
      borderWidth: 0.5,
    },
    optionButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.color.lightGrey,
    },
    selectedOption: {
      backgroundColor: theme.color.mediumGrey,
    },
    optionText: {
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.mediumSmall,
    },
  });
}
