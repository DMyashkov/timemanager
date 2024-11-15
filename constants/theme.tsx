// timemanager/constants/theme.tsx
import { FONTS } from "@/constants/fonts";

export const THEME = {
  light: {
    font: FONTS,
    fontSize: {
      extraExtraLarge: 80,
      largeLarge: 25,
      largeSmall: 20,
      mediumBig: 18,
      medium: 17,
      mediumSmall: 15,
      small: 14,
    },
    color: {
      presets: {
        green: {
          light: "#97BB78A6",
          medium: "#97BB78",
          dark: "#688153",
        },
      },
      searchBar: {
        background: "#EFEFF0",
        text: "#848488",
      },
      veryLightGrey: "#FBFBFB",
      red: "#FF4E4E",
      mediumGrey: "#EEEEEE",
      coldGrey: "#F2F3F5",
      colderGrey: "#ECEDEE",
      borderLight: "#EBEBEB",
      lightGrey: "#D3D3D3",
      darkerLightGrey: "#C5C5C7",
      black: "#373737",
      darkGrey: "#8B8C90",
      sysBlue: "#007AFF",
      white: "#FFFFFF",
    },
    shadow: {
      shadowColor: "#000", // Black shadow
      shadowOpacity: 0.1, // 25% opacity
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 13,
    },
    centerShadow: {
      shadowColor: "#000", // Black shadow
      shadowOpacity: 0.15, // 25% opacity
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 10,
    },
    borderRadius: {
      small: 5,
      mediumSmall: 7,
      medium: 8,
      large: 10,
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
