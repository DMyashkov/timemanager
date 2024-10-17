// timemanager/components/header/styles.tsx
import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

const useStyles = () => {
  const { theme } = useTheme(); // Access the current theme from context

  return StyleSheet.create({
    header: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
    },
    headerContentContainer: {
      flexDirection: "column",
      justifyContent: "center",
      gap: 15,
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: theme.fontSize.large, // Use dynamic font size from theme
      fontFamily: theme.font.semibold, // Use dynamic font family from theme
    },
    headerFirstRow: {
      flexDirection: "row",
      paddingLeft: 10,
      paddingRight: 10,
    },
    searchBar: {
      backgroundColor: theme.color.lightGrey, // Use dynamic color from theme
      height: 36,
      width: "100%",
      borderRadius: 10,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      paddingLeft: 8,
      paddingRight: 8,
    },
    button: {
      color: "red",
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
    xmark: {},
  });
};

export default useStyles;
