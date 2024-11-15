import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    collapsedProject: {
      height: 43,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: -4.5,
      paddingTop: 4.5,
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
      borderRadius: theme.borderRadius.large,
      borderColor: theme.color.presets.green.medium,
      borderWidth: 0.18,
      backgroundColor:theme.color.white,
      width: "100%",
      ...theme.shadow,
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
      borderRadius: theme.borderRadius.medium,
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
    secondRow: {
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      height: 45,
    },
    innerSecondRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      flex: 1,
      alignItems: "center",
      marginBottom: 3,
      // marginLeft: 3,
    },
    touchableView: {
      paddingLeft: 7,
      paddingRight: 7,
    },
    tag: {
      marginBottom: 7,
      marginRight: 1,
    },
  });
}
