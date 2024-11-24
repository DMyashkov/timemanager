import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const PADDING = 0;
  const HEIGHT = 42;

  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.white,
      height: HEIGHT,
      borderRadius: theme.borderRadius.mediumSmall,
      flexDirection: "row",
      alignItems: "center",
      padding: PADDING,
      gap: PADDING,
      overflow: "hidden",
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: HEIGHT - 2 * PADDING,
    },
    main: {
      flex: 1,
      position: "absolute",
      height: HEIGHT,
      paddingTop: PADDING,
      paddingBottom: PADDING,
    },
    mainInner: {
      flex: 1,
      backgroundColor: theme.color.red,
    },
    buttonText: {
      fontSize: theme.fontSize.medium,
      fontFamily: theme.font.regular,
    },
  });
}
