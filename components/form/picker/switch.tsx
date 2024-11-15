import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
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
  const scaleAnim = useSharedValue(1);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  const colorAnims = buttons.map(() => useSharedValue(0)); // Create individual color animations for each button

  useEffect(() => {
    // Update positionAnim and colorAnims when the selected index changes
    positionAnim.value = withTiming(selectedButtonIndex, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });

    colorAnims.forEach((anim, index) => {
      anim.value = withTiming(index === selectedButtonIndex ? 1 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      });
    });
  }, [selectedButtonIndex, positionAnim, colorAnims]);

  const animStyles = {
    main: useAnimatedStyle(() => ({
      marginLeft:
        positionAnim.value * (buttonWidth + styles.container.gap) +
        styles.container.padding,
      transform: [{ scale: scaleAnim.value }],
    })),
  };

  const handleButtonPress = (index: number, onPress: () => void) => {
    if (index === selectedButtonIndex) {
      // Apply bounce effect if the same button is pressed again
      scaleAnim.value = withSequence(
        withTiming(0.95, { duration: 100, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 100, easing: Easing.out(Easing.ease) }),
      );
    } else {
      setSelectedButtonIndex(index);
    }
    onPress();
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
        const buttonAnimStyle = useAnimatedStyle(() => ({
          transform: [
            { scale: index === selectedButtonIndex ? scaleAnim.value : 1 },
          ],
        }));

        const textColorStyle = useAnimatedStyle(() => ({
          color: interpolateColor(
            colorAnims[index].value,
            [0, 1],
            [theme.color.black, theme.color.white],
          ),
        }));

        return (
          <TouchableOpacity
            style={[styles.button]}
            key={button.text}
            onPress={() => handleButtonPress(index, button.onPress)}
            activeOpacity={index === selectedButtonIndex ? 1 : 1}
          >
            <Animated.View style={buttonAnimStyle}>
              <Animated.Text style={[styles.buttonText, textColorStyle]}>
                {button.text}
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
