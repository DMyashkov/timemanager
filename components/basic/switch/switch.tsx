import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface Button {
  text: string;
  onPress: () => void;
}

interface SwitchProps {
  buttons: Button[];
}

export default function Switch({ buttons = [] }: SwitchProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [buttonWidth, setButtonWidth] = useState(0);
  const positionAnim = useSharedValue(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  useEffect(() => {
    positionAnim.value = withTiming(selectedButtonIndex, {
      duration: 225,
      easing: Easing.inOut(Easing.ease),
    });
  }, [selectedButtonIndex, positionAnim]);

  const animStyles = {
    main: useAnimatedStyle(() => ({
      marginLeft:
        positionAnim.value * (buttonWidth + styles.container.gap) +
        styles.container.padding,
    })),
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        const calculatedWidth =
          (width -
            (buttons.length - 1) * styles.container.gap -
            2 * styles.container.padding) /
          buttons.length;
        if (calculatedWidth !== buttonWidth) {
          setButtonWidth(calculatedWidth);
        }
      }}
    >
      <Animated.View
        style={[styles.main, { width: buttonWidth }, animStyles.main]}
      >
        <View style={styles.mainInner} />
      </Animated.View>
      {buttons.map((button, index) => {
        return (
          <TouchableOpacity
            style={styles.button}
            key={button.text}
            onPress={() => {
              setSelectedButtonIndex(index);
              button.onPress();
            }}
          >
            <Text>{button.text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
