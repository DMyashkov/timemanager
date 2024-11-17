import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    screen: {
      backgroundColor: theme.color.white,
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 5,
      paddingTop: 35,
    },
    underlined: {
      textDecorationLine: "underline",
    },
    termsOfService: {
      color: theme.color.darkerGrey,
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.smaller,
      textAlign: "center",
    },
    appTitleContainer: {
      flexDirection: "row",
      gap: 6,
      zIndex: 1,
    },
    title: {
      fontSize: theme.fontSize.largeLarge,
      fontFamily: theme.font.bold,
      color: theme.color.red,
      marginLeft: 8,
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: -9,
    },
    image: {
      height: "106%",
      aspectRatio: 1,
    },
    imageContainer: {
      width: "100%",
      aspectRatio: 1.02,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: -30,
      marginTop: -25,
    },
    slogan: {
      fontSize: theme.fontSize.largeLarge,
      fontFamily: theme.font.bold,
      lineHeight: 31,
      textAlign: "center",
      color: theme.color.black,
    },
    choiceContainer: {
      width: "100%",
      gap: 18,
    },
    option: {
      borderRadius: theme.borderRadius.mediumSmall,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 45,
      borderWidth: 1,
      borderColor: theme.color.defaultGrey,
      gap: 4,
    },
    optionText: {
      fontSize: theme.fontSize.mediumBigBig,
      fontFamily: theme.font.semibold,
      color: theme.color.black,
    },
    iconContainer: {},
  });
}
