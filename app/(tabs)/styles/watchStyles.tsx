import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    watchScreen: {
      backgroundColor: theme.color.white,
      flex: 1,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 6,
    },
    clock: {
      // backgroundColor: "red",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    time: {
      fontSize: theme.fontSize.extraExtraLarge,
      color: theme.color.black,
    },
    tagContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    bottomClockView: {
      marginTop: -6,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    secondTime: {
      fontSize: theme.fontSize.mediumBig,
      fontFamily: theme.font.regular,
      color: theme.color.lightGrey,
      textDecorationLine: "underline",
    },
    switchButton: {
      position: "relative",
    },
    bottomButtonsContainer: {
      bottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    leftButtonsContainer: {
      flexDirection: "row",
      gap: 9,
    },
    rightButtonContainer: {
      flexDirection: "row",
    },
    filledButton: {
      backgroundColor: theme.color.presets.green.medium,
      aspectRatio: 1,
      height: 75,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    textInsideButton: {
      fontSize: theme.fontSize.largeSmall,
      fontFamily: theme.font.regular,
      color: theme.color.white,
    },
    emptyView: {
      height: 5,
    },
    lapNumberButton: {
      borderWidth: 2,
      justifyContent: "center",
      paddingLeft: 12,
      paddingRight: 12,
      borderRadius: 10,
      borderColor: theme.color.lightGrey,
    },
    lapNumberText: {
      fontSize: theme.fontSize.largeSmall,
      fontFamily: theme.font.regular,
      color: theme.color.lightGrey,
    },
    lapsView: {
      height: "35%",
      paddingLeft: 12,
      paddingRight: 12,
      marginTop: -3,
      overflow: "hidden",
    },
    lapsViewContent: {
      flex: 1,
      borderTopWidth: 1.2,
      borderColor: theme.color.lightGrey,
    },
    lapContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 7,
      paddingBottom: 7,
    },
    lapText: {
      fontSize: theme.fontSize.mediumBig,
      fontFamily: theme.font.regular,
    },
    separator: {
      height: 1.2,
      backgroundColor: theme.color.lightGrey,
    },
  });
  return styles;
}
