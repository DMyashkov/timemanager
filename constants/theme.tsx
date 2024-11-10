// timemanager/constants/theme.tsx
import { FONTS } from "@/constants/fonts";

export const THEME = {
  light: {
    font: FONTS,
    fontSize: {
      large: 25,
      mediumBig: 18,
      medium: 17,
      small: 14,
    },
    color: {
      presets: {
        green: "#97BB78",
      },
      searchBar: {
        background: "#EFEFF0",
        text: "#848488",
      },
      lightGrey: "#FBFBFB",
      red: "#FF4E4E",
      mediumGrey: "#EEEEEE",
      borderLight: "#EBEBEB",
      borderMedium: "#D3D3D3",
      black: "#373737",
      darkGrey: "#8B8C90",
    },
  },
  dark: {
    font: FONTS,
    fontSize: {
      large: 25,
      medium: 18,
      mediumSmall: 20,
      small: 14,
    },
    color: {
      searchBar: {
        background: "#EFEFF0",
        text: "#848488",
      },
      lightGrey: "#FBFBFB",
      mediumGrey: "#EEEEEE",
      black: "#373737",
      red: "#FF0000",
    },
  },
};
