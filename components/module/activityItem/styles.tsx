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
      height: 0,
      borderRadius: 10,
      borderColor: theme.color.lightGrey,
      borderWidth: 0.18,
      backgroundColor: "#fff",
      ...theme.shadow,
    },
    buttonContainer: {
      height: 42,
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
    activityInternal: {
      flex: 1,
      overflow: "hidden",
      flexDirection: "column",
      justifyContent: "flex-end",
      borderRadius: 8,
    },
    chevronInnerContainer: {},
  });
}
