import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

import type { Color } from "@constants/interfaces";

export default function useStyles(
  colorPallete: Color,
  isProject = false,
  coefficient = 1,
) {
  const { theme } = useTheme();
  const borderWidthProject = 2.2;

  return !isProject
    ? StyleSheet.create({
        container: {
          backgroundColor: colorPallete.light,
          flexDirection: "row",
          gap: coefficient * 4,
          alignItems: "center",
          padding: coefficient * 6.5,
          borderRadius: coefficient * theme.borderRadius.medium,
          paddingRight: coefficient * 7,
          paddingLeft: coefficient * 7,
        },
        text: {
          color: colorPallete.dark,
          fontFamily: theme.font.medium,
          fontSize: coefficient * theme.fontSize.mediumSmall,
        },
        iconOuter: {
          height: coefficient * 22,
          width: coefficient * 22,
          alignItems: "center",
          justifyContent: "center",
        },
      })
    : StyleSheet.create({
        container: {
          backgroundColor: theme.color.white,
          borderColor: colorPallete.medium,
          borderWidth: coefficient * borderWidthProject,
          flexDirection: "row",
          gap: coefficient * 3,
          alignItems: "center",
          padding: coefficient * (6.5 - borderWidthProject),
          borderRadius: coefficient * theme.borderRadius.medium,
          paddingRight: coefficient * (7 - borderWidthProject),
          paddingLeft: coefficient * (7 - borderWidthProject),
        },
        text: {
          color: colorPallete.medium,
          fontFamily: theme.font.medium,
          fontSize: coefficient * theme.fontSize.mediumSmall,
        },
        iconOuter: {
          height: coefficient * 22,
          width: coefficient * 22,
          alignItems: "center",
          justifyContent: "center",
        },
      });
}
