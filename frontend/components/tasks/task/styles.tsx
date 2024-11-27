import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles(priority: number) {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.color.white,
      ...theme.shadow,
      paddingVertical: 14,
      paddingHorizontal: 14,
      flexDirection: "row",
      gap: 10,
    },
    title: {
      fontSize: theme.fontSize.mediumBig,
      fontFamily: theme.font.regular,
      color: theme.color.black,
    },
    leftColumn: {},
    checkMark: {
      height: 20,
      aspectRatio: 1,
      backgroundColor: theme.color.veryLightRed,
      borderColor: theme.color.darkRed,
      borderWidth: 2.3,
      borderRadius: 2.5,
      margin: 1,
    },
    priority1Colors: {},
    content: {
      flexDirection: "column",
      gap: 5,
      alignItems: "flex-start", // Ensure items don't stretch
      flex: 1,
    },
    description: {
      fontSize: theme.fontSize.smaller,
      fontFamily: theme.font.regular,
      color: theme.color.darkerDarkGrey,
    },
    date: {
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
      height: "100%",
    },
    dateText: {
      fontSize: theme.fontSize.small,
      fontFamily: theme.font.regular,
      color: theme.color.darkRed,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "flex-start",
      marginTop: 3,
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 3,
      marginBottom: -3,
      rowGap: 7,
      columnGap: 5,
      flexShrink: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
    },
    touchContainer: {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
  });
}

