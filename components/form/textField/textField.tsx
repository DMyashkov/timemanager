import { View, Text, TextInput, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Xmark from "@assets/icons/xmark.svg";
import Eye from "@assets/icons/eye.svg";
import EyeSlash from "@assets/icons/eye-slash.svg";

export default function TextField({
  autoFocus = false,
  placeholder = "Activity Name",
  setModuleName = (text: string) => {},
  rightHint = false,
  defaultText = "",
  topHint = "",
  hideOption = false,
}: {
  placeholder?: string;
  setModuleName?: (text: string) => void;
  rightHint?: boolean;
  defaultText?: string;
  topHint?: string;
  hideOption?: boolean;
  autoFocus?: boolean;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const onChangeText = (text: string) => {
    setText(text);
    setModuleName(text);
  };
  const [rightHintWidth, setRightHintWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [buttonContainerWidth, setButtonContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [isHidden, setIsHidden] = useState(hideOption);

  const opacity = useSharedValue(0);
  const prevCalculationCondition = useRef(false);

  const calculationCondition =
    containerWidth -
      2 * styles.container.paddingLeft -
      textWidth -
      rightHintWidth -
      buttonContainerWidth -
      11 >
    0;

  const shouldShowHint =
    defaultText === "" ? rightHint && text !== "" : rightHint;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (prevCalculationCondition.current !== calculationCondition) {
      // Animate opacity when calculation condition changes
      opacity.value = withTiming(calculationCondition ? 1 : 0, {
        duration: 200,
      });
    } else {
      // Immediate change when other conditions change
      opacity.value = calculationCondition ? 1 : 0;
    }

    prevCalculationCondition.current = calculationCondition;
  }, [calculationCondition, opacity]);

  const handleClearInput = () => {
    setText(""); // Clear the input text
  };

  return (
    <View style={styles.outerContainer}>
      {topHint && <Text style={styles.topHint}>{topHint}</Text>}
      <View
        style={styles.container}
        onLayout={({
          nativeEvent: {
            layout: { width },
          },
        }) => setContainerWidth(width)}
      >
        <View style={styles.containerInner}>
          {shouldShowHint && (
            <Animated.Text
              style={[
                styles.hintText,
                animatedStyle,
                {
                  right: buttonContainerWidth + 12 + 11,
                },
              ]}
              onLayout={({
                nativeEvent: {
                  layout: { width },
                },
              }) => setRightHintWidth(width)}
            >
              {placeholder}
            </Animated.Text>
          )}
          <TextInput
            style={[styles.textInput]}
            placeholder={defaultText || placeholder}
            placeholderTextColor={theme.color.darkerLightGrey}
            onChangeText={onChangeText}
            hitSlop={{ left: 12 }}
            value={text}
            secureTextEntry={isHidden}
            autoFocus={autoFocus}
          />
          <View
            style={styles.buttonsContainer}
            onLayout={({
              nativeEvent: {
                layout: { width },
              },
            }) => setButtonContainerWidth(width)}
          >
            {text.length > 0 && (
              <TouchableOpacity
                onPress={handleClearInput}
                hitSlop={{ top: 20, bottom: 15, left: 15, right: 15 }}
                style={{ marginTop: 1.5 }}
              >
                <Xmark height={20} width={20} fill={theme.color.darkGrey} />
              </TouchableOpacity>
            )}
            {hideOption && (
              <TouchableOpacity
                onPress={() => {
                  setIsHidden(!isHidden);
                }}
                hitSlop={{ top: 20, bottom: 15, left: 7, right: 15 }}
              >
                {!isHidden ? (
                  <EyeSlash
                    height={24}
                    width={24}
                    fill={theme.color.darkGrey}
                  />
                ) : (
                  <Eye height={24} width={24} fill={theme.color.darkGrey} />
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text
            style={styles.hiddenText}
            onLayout={({
              nativeEvent: {
                layout: { width },
              },
            }) => setTextWidth(width)}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
}
