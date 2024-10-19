import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    activity: {
      height: 40,
      borderRadius: 10,
      borderColor: theme.color.borderMedium,
      borderWidth: 0.18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 11,
      paddingRight: 11,
      shadowColor: "#000", // Black shadow
      backgroundColor: "#fff",
      shadowOpacity: 0.1, // 25% opacity
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 13,
      gap: 7,
    },
    tag: {
      aspectRatio: 1,
      height: "100%",
    },
    tagContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 7,
      paddingBottom: 7,
    },
    chevronContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 11,
      paddingBottom: 11,
    },
    textContiner: {
      justifyContent: "flex-start",
      flexDirection: "row",
      flex: 1,
    },
    text: {
      flex: 1,
    },
    chevron: {
      aspectRatio: 1,
      height: "100%",
    },
  });
}
