import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const PADDING = 3;

  return StyleSheet.create({
    container: {
      backgroundColor: theme.color.colderGrey,
      height: 35,
      borderRadius: 7,
      flexDirection: "row",
      alignItems: "center",
      padding: PADDING,
      gap: PADDING,
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 35 - 2 * PADDING,
    },
    main: {
      flex: 1,
      position: "absolute",
      height: 35,
      paddingTop: PADDING,
      paddingBottom: PADDING,
      ...theme.centerShadow,
    },
    mainInner: {
      flex: 1,
      backgroundColor: theme.color.white,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: theme.fontSize.small,
      fontFamily: theme.font.regular,
    },
  });
}
