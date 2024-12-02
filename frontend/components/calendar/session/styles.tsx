import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@/constants/interfaces";

export default function useStyles(colorPallete: Color) {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      backgroundColor: theme.color.white,
      borderRadius: theme.borderRadius.large,
      ...theme.shadow,
    },
    tagContainer: {
      flexDirection: "row",
      gap: 10,
    },
    header: {
      flexDirection: "row",
      height: 40,
      width: "100%",
    },
    workTime: {
      backgroundColor: colorPallete.veryLight,
      height: "100%",
      borderTopLeftRadius: theme.borderRadius.large,
      borderWidth: 2.7,
      borderRightWidth: 0,
      borderColor: colorPallete.medium,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: 14,
    },
    workTimeText: {
      fontFamily: theme.font.bold,
      fontSize: theme.fontSize.mediumSmall,
      color: colorPallete.dark,
    },
    breakTime: {
      flex: 1,
      borderWidth: 2.7,
      borderColor: colorPallete.medium,
      borderStyle: "dashed",
      position: "relative",
      borderTopRightRadius: theme.borderRadius.large,
      justifyContent: "center",
      alignItems: "center",
    },
    leftMask: {
      height: "100%",
      width: 3,
      backgroundColor: theme.color.white,
      position: "absolute",
      top: 0,
      left: -3,
    },
    breakTimeText: {
      fontFamily: theme.font.bold,
      fontSize: theme.fontSize.mediumSmall,
      color: colorPallete.medium,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      alignItems: "center",
    },
    textFooter: {
      color: theme.color.darkerDarkGrey,
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.mediumSmall,
    },
    rightFooter: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
    },
  });
}
