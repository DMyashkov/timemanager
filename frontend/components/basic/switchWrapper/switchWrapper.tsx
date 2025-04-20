import { View, Text, DimensionValue, LayoutChangeEvent } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

import type { SwitchProps } from "@/constants/interfaces";
import Switch from "@/components/basic/switch/switch";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Children, ReactNode } from "react";

interface SwitchWrapperProps extends SwitchProps {
  children: ReactNode | [ReactNode, ReactNode]; // Accepts fragment or tuple
  styleSwitch?: object;
  TopElement?: React.FC;
}

export default function SwitchWrapper({
  children,
  buttons = [],
  styleSwitch = {},
  TopElement,
}: SwitchWrapperProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  const positionAnim = useSharedValue(0);

  const animStyles = {
    main: useAnimatedStyle(() => ({
      marginLeft: `-${positionAnim.value * 100}%` as DimensionValue,
    })),
  };

  const [child1, child2] = Children.toArray(children);

  return (
    <View style={styles.container}>
      <View style={styleSwitch}>
        <Switch buttons={buttons} positionAnim={positionAnim} />
      </View>
      {TopElement && <TopElement />}
      <Animated.View style={[styles.main, animStyles.main]}>
        {child1}
        {child2}
      </Animated.View>
    </View>
  );
}
