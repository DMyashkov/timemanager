import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();
  const HIT_SLOP_TEXT_INPUT = 10;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "grey",
    },
    contentContainer: {
      flex: 1,
      paddingTop: 15,
      paddingHorizontal: 31,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    titleInput: {
      fontSize: theme.fontSize.largeSmall,
      fontFamily: theme.font.regular,
      color: theme.color.black,
      width: "100%",
      height: "100%",
      paddingTop: HIT_SLOP_TEXT_INPUT,
      paddingBottom: HIT_SLOP_TEXT_INPUT,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      marginTop: -HIT_SLOP_TEXT_INPUT,
      marginBottom: -HIT_SLOP_TEXT_INPUT,
    },
  });
}
