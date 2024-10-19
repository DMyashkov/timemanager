import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    collapsedActivity: {
      height: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 7,
    },
    leftButtonTag: {
      aspectRatio: 23 / 26,
      height: "100%",
    },
    leftButtonUnfocus: {
      aspectRatio: 1,
      height: "100%",
    },
    leftButtonContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 7,
      paddingBottom: 7,
      paddingLeft: 11,
    },
    chevronContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 11,
      paddingBottom: 11,
      paddingRight: 11,
    },
    textContiner: {
      justifyContent: "flex-start",
      flexDirection: "row",
      flex: 1,
    },
    text: {
      flex: 1,
      fontSize: theme.fontSize.medium,
      fontFamily: theme.font.regular,
      color: theme.color.black,
    },
    chevron: {
      aspectRatio: 1,
      height: "100%",
    },
    activity: {
      borderRadius: 10,
      borderColor: theme.color.borderMedium,
      borderWidth: 0.18,
      shadowColor: "#000", // Black shadow
      backgroundColor: "#fff",
      shadowOpacity: 0.1, // 25% opacity
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 13,
    },
    buttonContainer: {
      height: 41.5,
      flexDirection: "row",
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,
      backgroundColor: "#0000",
      overflow: "hidden",
    },
    button: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: theme.fontSize.medium,
      fontFamily: theme.font.regular,
      color: theme.color.black,
    },
  });
}
