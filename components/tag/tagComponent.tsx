import { View, Text, I18nManager } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import TagIcon from "@assets/icons/tag.svg";
import At from "@assets/icons/at.svg";
import Animated, { interpolate } from "react-native-reanimated";
import { isNativePlatformSupported } from "react-native-screens/lib/typescript/core";

interface TagProps {
  isProject?: boolean;
  style?: object;
}

export default function Tag({ isProject = false, style = {} }: TagProps) {
  switch (isProject) {
    case false:
      return <TagComponesnt style={style} />;
    case true:
      return <ProjectComponent style={style} />;
  }
}

function TagComponesnt({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.iconOuter}>
        <TagIcon fill={theme.color.presets.green.dark} height={22} width={19} />
      </View>
      <Text style={styles.text}>Photography</Text>
    </Animated.View>
  );
}

function ProjectComponent({ style = {} }: { style?: object }) {
  const styles = useStyles(true);
  const { theme } = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.iconOuter}>
        <At fill={theme.color.presets.green.medium} height={18} width={19} />
      </View>
      <Text style={styles.text}>Photography</Text>
    </Animated.View>
  );
}
