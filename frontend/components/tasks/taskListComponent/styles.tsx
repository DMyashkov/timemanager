import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: 15,
    },
    leftHeader: {
      flexDirection: "row",
      gap: 3,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    date: {
      fontFamily: theme.font.medium,
      fontSize: theme.fontSize.medium,
      color: theme.color.black,
    },
    amount: {
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.mediumSmall,
      color: theme.color.darkGrey,
    },
    rightText: {
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.medium,
    },
  });
}

