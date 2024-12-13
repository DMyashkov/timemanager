import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  const PADDING_TOP_HEADER = 3;

  return StyleSheet.create({
    headerButtonContainer: {
      paddingHorizontal: 15,
      paddingTop: PADDING_TOP_HEADER,
      flexDirection: "row",
      height: 60,
      justifyContent: "space-between",
      alignItems: "center",
    },
    separator: {
      height: 0.8,
      width: "100%",
      backgroundColor: theme.color.lightGrey,
    },
    innerButtonsHeader: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      zIndex: 2,
    },
    titleView: {
      position: "absolute",
      top: 2,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
    },
    titleHeader: {
      fontFamily: theme.font.semibold,
      fontSize: theme.fontSize.mediumSmall + 2,
      color: theme.color.black,
    },
  });
}
