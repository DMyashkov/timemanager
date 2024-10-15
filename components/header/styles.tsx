// timemanager/components/header/styles.tsx
import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

const useStyles = () => {
  const { theme } = useTheme(); // Access the current theme from context

  return StyleSheet.create({
    header: {
      flex: 1,
      padding: 10,
    },
    headerContentContainer: {
      flexDirection: "column",
      justifyContent: "center",
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
      paddingLeft: 15,
    },
    title: {
      fontSize: theme.fontSize.large, // Use dynamic font size from theme
      fontFamily: theme.fonts.semibold, // Use dynamic font family from theme
    },
    headerFirstRow: {
      margin: 0,
      flexDirection: "row",
    },
    searchBar: {
      padding: 10,
    },
  });
};

export default useStyles;
