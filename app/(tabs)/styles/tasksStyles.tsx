import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const HIT_SLOP_TEXT_INPUT = 10;
  const SEND_BUTTON_SIZE = 34;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "grey",
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 22,
    },
    titleInput: {
      fontSize: theme.fontSize.largeSmall,
      fontFamily: theme.font.regular,
      color: theme.color.black,
      width: "100%",
      paddingTop: HIT_SLOP_TEXT_INPUT,
      paddingBottom: HIT_SLOP_TEXT_INPUT,
    },
    titleContainer: {
      flexDirection: "column",
      width: "100%",
      marginTop: -HIT_SLOP_TEXT_INPUT,
      marginBottom: -HIT_SLOP_TEXT_INPUT,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    description: {
      fontSize: theme.fontSize.mediumSmall,
      fontFamily: theme.font.regular,
      color: theme.color.black,
      width: "100%",
      paddingTop: HIT_SLOP_TEXT_INPUT / 2,
      paddingBottom: HIT_SLOP_TEXT_INPUT,
      marginTop: -HIT_SLOP_TEXT_INPUT / 2,
      marginBottom: HIT_SLOP_TEXT_INPUT,
      minHeight: 72,
    },
    footer: {
      height: 55,
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 22,
      borderTopWidth: 0.5,
      borderColor: theme.color.lightGrey,
      justifyContent: "space-between",
    },
    outer: {
      flex: 1,
      gap: 10,
    },
    changeActivityButton: {
      borderRadius: theme.borderRadius.medium,
      borderWidth: 0.5,
      borderColor: theme.color.extraLightGrey,
      height: 35,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      gap: 5,
    },
    textInsideChangeActivityButton: {
      fontSize: theme.fontSize.small,
      fontFamily: theme.font.regular,
    },
    sendButton: {
      width: SEND_BUTTON_SIZE,
      aspectRatio: 1,
      backgroundColor: theme.color.red,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: SEND_BUTTON_SIZE / 2,
    },
    contentInner: {},
    buttonView: {
      flexDirection: "row",
      gap: 11,
    },
  });
}
