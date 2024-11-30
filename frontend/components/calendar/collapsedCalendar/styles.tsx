import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      gap: 5,
      marginTop: 16,
    },
    week: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
    },
    textDay: {
      fontSize: theme.fontSize.mediumSmall,
      fontFamily: theme.font.regular,
      color: theme.color.black,
    },
    outerDateDay: {
      height: 40,
      aspectRatio: 1,
      backgroundColor: theme.color.red,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },
    dayName: {
      width: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    dayNameText: {
      fontSize: theme.fontSize.smaller,
      color: theme.color.darkGrey,
      fontFamily: theme.font.regular,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginBottom: 9,
    },
    leftHeaderText: {
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.medium,
      color: theme.color.black,
    },
    rightHeaderText: {
      fontSize: theme.fontSize.mediumSmall,
      fontFamily: theme.font.medium,
      color: theme.color.black,
    },
    productiveTimeText: {
      color: theme.color.red,
    },
  });
}

