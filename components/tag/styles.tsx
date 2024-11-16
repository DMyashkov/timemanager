import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

import type { Color } from "@constants/interfaces";

export default function useStyles(colorPallete: Color, isProject = false) {
  const { theme } = useTheme();
  const borderWidthProject = 2.2;

  return !isProject
    ? StyleSheet.create({
        container: {
          backgroundColor: colorPallete.light,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          padding: 6.5,
          borderRadius: theme.borderRadius.medium,
          paddingRight: 7,
          paddingLeft: 7,
        },
        text: {
          color: colorPallete.dark,
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
          backgroundColor: theme.color.white,
          borderColor: colorPallete.medium,
          borderWidth: borderWidthProject,
          flexDirection: "row",
          gap: 3,
          alignItems: "center",
          padding: 6.5 - borderWidthProject,
          borderRadius: theme.borderRadius.medium,
          paddingRight: 7 - borderWidthProject,
          paddingLeft: 7 - borderWidthProject,
        },
        text: {
          color: colorPallete.medium,
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
