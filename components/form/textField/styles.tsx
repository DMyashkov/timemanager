import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.white,
      height: 42,
      borderRadius: theme.borderRadius.large,
      justifyContent: "center",
      paddingLeft: 12,
    },
    textInput: {
      flex: 1,
      color: theme.color.black,
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.medium,
      alignSelf: "stretch",
    },
    containerInner: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 12,
    },
    hintText: {
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.medium,
      color: theme.color.darkerLightGrey,
      position: "absolute",
      right: 12,
    },
    hiddenText: {
      position: "absolute",
      color: "transparent",
      fontFamily: theme.font.regular,
      fontSize: theme.fontSize.medium,
    },
  });
}
