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
      paddingHorizontal: 22,
      flex: 1,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      gap: 16,
      paddingTop: 16,
      paddingBottom: 70,
    },
    button: {
      height: 45,
      backgroundColor: theme.color.red,
      borderRadius: theme.borderRadius.large,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: theme.fontSize.medium,
      fontFamily: theme.font.regular,
      color: theme.color.white,
    },
  });
}
