import { View, Text, I18nManager } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import TagIcon from "@assets/icons/tag.svg";
import At from "@assets/icons/at.svg";
import Animated, { interpolate } from "react-native-reanimated";
import { isNativePlatformSupported } from "react-native-screens/lib/typescript/core";

import type { Color } from "@constants/interfaces";

interface TagProps {
  text: string;
  isProject?: boolean;
  style?: object;
  colorPallete?: Color;
  desiredHeight?: number;
}

export default function Tag({
  text,
  isProject = false,
  style = {},
  colorPallete,
  desiredHeight = 35,
}: TagProps) {
  const { theme } = useTheme();

  if (!colorPallete) {
    colorPallete = theme.color.presets.green;
  }
  switch (isProject) {
    case false:
      return (
        <TagComponesnt
          style={style}
          colorPallete={colorPallete}
          desiredHeight={desiredHeight}
          text={text}
        />
      );
    case true:
      return (
        <ProjectComponent
          style={style}
          colorPallete={colorPallete}
          desiredHeight={desiredHeight}
          text={text}
        />
      );
  }
}

interface ComponentProps {
  style?: object;
  colorPallete: Color;
  desiredHeight: number;
  text?: string;
}

function TagComponesnt({
  style = {},
  colorPallete,
  desiredHeight,
  text,
}: ComponentProps) {
  const NORMAL_HEIGHT = 35;
  const coefficient = desiredHeight / NORMAL_HEIGHT;
  const styles = useStyles(colorPallete, false, coefficient);
  const { theme } = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.iconOuter}>
        <TagIcon
          fill={colorPallete.dark}
          height={coefficient * 22}
          width={coefficient * 19}
        />
      </View>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

function ProjectComponent({
  style = {},
  colorPallete,
  desiredHeight,
  text,
}: ComponentProps) {
  const NORMAL_HEIGHT = 35;
  const coefficient = desiredHeight / NORMAL_HEIGHT;
  const styles = useStyles(colorPallete, true, coefficient);
  const { theme } = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.iconOuter}>
        <At
          fill={colorPallete.medium}
          height={coefficient * 18}
          width={coefficient * 19}
        />
      </View>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}
