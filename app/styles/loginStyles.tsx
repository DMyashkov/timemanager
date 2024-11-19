import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    content: {
      backgroundColor: theme.color.warmGrey,
      flex: 1,
      justifyContent: "space-between",
    },
    view: {
      backgroundColor: theme.color.warmGrey,
      flex: 1,
    },
    headerButtonContainer: {
      backgroundColor: theme.color.warmGrey,
      marginTop: 20,
    },
    title: {
      fontFamily: theme.font.bold,
      fontSize: theme.fontSize.largeLarge,
      color: theme.color.black,
    },
    description: {
      color: theme.color.darkGrey,
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.mediumSmall,
    },
    titleContainer: {
      gap: 10,
    },
    button: {
      height: 45,
      backgroundColor: theme.color.red,
      borderRadius: theme.borderRadius.large,
      justifyContent: "center",
      alignSelf: "stretch",
      alignItems: "center",
    },
    buttonText: {
      fontSize: theme.fontSize.medium,
      fontFamily: theme.font.regular,
      color: theme.color.white,
    },
    innerView: {
      paddingHorizontal: 16,
      gap: 15,
      flexDirection: "column",
      flex: 1,
    },
    empty: {
      height: "50%",
    },
    forgotPassword: {
      color: theme.color.darkGrey,
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.mediumSmall,
      textDecorationLine: "underline",
    },
    loginButtonOuter: {
      alignItems: "center",
      gap: 15,
    },
  });
}
