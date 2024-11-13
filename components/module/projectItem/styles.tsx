import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    collapsedProject: {
      height: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 7,
      paddingRight: 7,
    },
    leftButtonTag: {
      aspectRatio: 1,
      height: "100%",
    },
    leftButtonUnfocus: {
      aspectRatio: 1,
      height: "100%",
    },
    leftButtonContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 8,
      paddingBottom: 7,
      paddingRight: 3,
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
      borderColor: theme.color.presets.green.medium,
      borderWidth: 0.18,
      shadowColor: "#000", // Black shadow
      backgroundColor: "#fff",
      width: "100%",
      shadowOpacity: 0.1, // 25% opacity
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 13,
    },
    buttonContainer: {
      height: 42,
      flexDirection: "row",
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,
      backgroundColor: "#0000",
      overflow: "hidden",
      borderBottomWidth: 3,
      borderBottomColor: theme.color.presets.green.medium,
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
    collapsedProjectLeft: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 7,
    },
    hoursText: {
      fontFamily: theme.font.semibold,
      color: theme.color.presets.green.medium,
      fontSize: theme.fontSize.medium,
    },
  });
}
