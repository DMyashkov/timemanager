import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      borderRadius: 5,
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
    },
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
      marginTop: 6,
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
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 3,
      marginBottom: -3,
      gap: 5,
      flexShrink: 1,
    },
  });
}

