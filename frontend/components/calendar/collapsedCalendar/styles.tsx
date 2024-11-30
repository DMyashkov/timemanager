import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    outer: {
      gap: 5,
    },
    week: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
    },
    textDay: {
      fontSize: theme.fontSize.mediumSmall,
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
    },
  });
}

