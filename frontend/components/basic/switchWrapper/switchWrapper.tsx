import { View, Text, DimensionValue } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

import type { SwitchProps } from "@/constants/interfaces";
import Switch from "@/components/basic/switch/switch";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface SwitchWrapperProps extends SwitchProps {
  children: [React.ReactNode, React.ReactNode];
  styleSwitch?: object;
}

export default function SwitchWrapper({
  children,
  buttons = [],
  styleSwitch = {},
}: SwitchWrapperProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  const positionAnim = useSharedValue(0);
  const animStyles = {
    main: useAnimatedStyle(() => ({
      marginLeft: `-${positionAnim.value * 100}%` as DimensionValue,
    })),
    transform: [{ translateX: `-${positionAnim.value * 100}%` }],
  };
  return (
    <View style={styles.container}>
      <View style={styleSwitch}>
        <Switch buttons={buttons} positionAnim={positionAnim} />
      </View>
      <Animated.View style={[styles.main, animStyles.main]}>
        {children[0]}
        {children[1]}
      </Animated.View>
    </View>
  );
}
