import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.white,
      height: 42,
      borderRadius: theme.borderRadius.large,
      justifyContent: "center",
    },
    textInput: {
      flex: 1,
      paddingLeft: 12,
      color: theme.color.black,
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.medium,
    },
    containerInner: {
      flex: 1,
    },
  });
}
