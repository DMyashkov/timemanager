import { View, Text, I18nManager } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import TagIcon from "@assets/icons/tag.svg";
import At from "@assets/icons/at.svg";
import Animated, { interpolate } from "react-native-reanimated";
import { isNativePlatformSupported } from "react-native-screens/lib/typescript/core";

interface Color {
  light: string;
  medium: string;
  dark: string;
}

interface TagProps {
  isProject?: boolean;
  style?: object;
  colorPallete?: Color;
}

export default function Tag({
  isProject = false,
  style = {},
  colorPallete,
}: TagProps) {
  const { theme } = useTheme();

  if (!colorPallete) {
    colorPallete = theme.color.presets.green;
  }
  switch (isProject) {
    case false:
      return <TagComponesnt style={style} colorPallete={colorPallete} />;
    case true:
      return <ProjectComponent style={style} colorPallete={colorPallete} />;
  }
}

interface ComponentProps {
  style?: object;
  colorPallete: Color;
}

function TagComponesnt({ style = {}, colorPallete }: ComponentProps) {
  const styles = useStyles(colorPallete, false);
  const { theme } = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.iconOuter}>
        <TagIcon fill={colorPallete.dark} height={22} width={19} />
      </View>
      <Text style={styles.text}>Photography</Text>
    </Animated.View>
  );
}

function ProjectComponent({ style = {}, colorPallete }: ComponentProps) {
  const styles = useStyles(colorPallete, true);
  const { theme } = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.iconOuter}>
        <At fill={colorPallete.medium} height={18} width={19} />
      </View>
      <Text style={styles.text}>Photography</Text>
    </Animated.View>
  );
}
