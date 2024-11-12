import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function useStyles(isProject = false) {
  const { theme } = useTheme();
  const borderWidthProject = 2.2;

  return !isProject
    ? StyleSheet.create({
        container: {
          backgroundColor: theme.color.presets.green.light,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          padding: 6.5,
          borderRadius: 8,
          paddingRight: 7,
          paddingLeft: 7,
        },
        text: {
          color: theme.color.presets.green.dark,
          fontFamily: theme.font.medium,
          fontSize: theme.fontSize.mediumSmall,
        },
        iconOuter: {
          height: 22,
          width: 22,
          alignItems: "center",
          justifyContent: "center",
        },
      })
    : StyleSheet.create({
        container: {
          backgroundColor: "#fff",
          borderColor: theme.color.presets.green.medium,
          borderWidth: borderWidthProject,
          flexDirection: "row",
          gap: 3,
          alignItems: "center",
          padding: 6.5 - borderWidthProject,
          borderRadius: 8,
          paddingRight: 7 - borderWidthProject,
          paddingLeft: 7 - borderWidthProject,
        },
        text: {
          color: theme.color.presets.green.medium,
          fontFamily: theme.font.medium,
          fontSize: theme.fontSize.mediumSmall,
        },
        iconOuter: {
          height: 22,
          width: 22,
          alignItems: "center",
          justifyContent: "center",
        },
      });
}
