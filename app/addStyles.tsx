import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const PADDING_HORIZONTAL = 22;

  return StyleSheet.create({
    addScreen: {
      backgroundColor: theme.color.coldGrey,
      flex: 1,
    },
    innerAddScreen: {
      paddingTop: 11,
      paddingHorizontal: 0,
      flex: 1,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      gap: 16,
      paddingTop: 16,
      paddingBottom: 110,
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
    innerView: {
      flexDirection: "row",
      width: "200%",
      justifyContent: "space-between",
      marginLeft: "-50%",
    },
    switchOuter: {
      paddingHorizontal: PADDING_HORIZONTAL,
    },
  });
}
