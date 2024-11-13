import {
  View,
  Text,
  TouchableOpacity,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Unfocus from "@assets/icons/unfocus.svg";
import { useMemo, useState } from "react";
import At from "@assets/icons/at.svg";
import Tag from "@components/tag/tagComponent";

export interface ButtonActivityInfo {
  text: string;
  color: string;
  onPress: () => void;
}

interface ActivityProps {
  activityName?: string;
  activityColor?: string;
  isFocused?: boolean;
  buttons?: ButtonActivityInfo[];
  onExpand?: () => void;
  onFocus?: () => void;
  onUnfocus?: () => void;
  style?: object;
  focusAnim?: Animated.SharedValue<number>;
  visibleAnim?: Animated.SharedValue<number>;
  isInHalfFocusedMode?: boolean;
}

export default function Activity({
  activityName = "Activity",
  activityColor = "",
  isFocused = false,
  onFocus = () => {},
  onUnfocus = () => {},
  buttons = [],
  style = {},
  focusAnim = useSharedValue(0),
  visibleAnim = useSharedValue(1),
  isInHalfFocusedMode = false,
}: ActivityProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  activityColor = activityColor || theme.color.presets.green.medium;

  const mergedButtons = useMemo(() => {
    const defaultButtons: ButtonActivityInfo[] = [
      {
        text: "Start timer",
        color: theme.color.veryLightGrey, // Use theme color as default
        onPress: () => {},
      },
      {
        text: "Edit",
        color: theme.color.mediumGrey,
        onPress: () => {},
      },
    ];

    const allButtons = [...defaultButtons];

    // Overwrite any default button with the one provided in `buttons` if present
    buttons.forEach((button, index) => {
      allButtons[index] = {
        ...allButtons[index],
        ...button, // override properties
      };
    });

    // Add additional buttons (beyond the default two)
    if (buttons.length > defaultButtons.length) {
      allButtons.push(...buttons.slice(defaultButtons.length));
    }

    return allButtons;
  }, [buttons, theme]); // Only track necessary dependencies

  const [isUnfocusStarted, setIsUnfocusStarted] = useState<boolean>(false);

  const animStyles = {
    activityItem: useAnimatedStyle(() => ({
      height:
        visibleAnim.value *
        interpolate(
          focusAnim.value,
          [0, 1],
          [
            !isInHalfFocusedMode
              ? styles.collapsedProject.height
              : styles.collapsedProject.height + styles.secondRow.height,
            styles.collapsedProject.height +
              styles.secondRow.height +
              styles.buttonContainer.height,
          ],
        ),
      borderWidth: interpolate(visibleAnim.value, [0, 0.1, 1], [0, 3, 3]),
    })),
    hoursText: useAnimatedStyle(() => ({
      opacity: !isInHalfFocusedMode ? focusAnim.value : 1,
    })),
    secondRow: useAnimatedStyle(() => ({
      height: interpolate(
        focusAnim.value,
        [0, 1],
        [
          !isInHalfFocusedMode ? 0 : styles.secondRow.height,
          styles.secondRow.height,
        ],
      ),
    })),
    tag: useAnimatedStyle(() => ({
      marginBottom: interpolate(
        focusAnim.value,
        [0, 1],
        [
          !isInHalfFocusedMode ? 0 : styles.tag.marginBottom,
          styles.tag.marginBottom,
        ],
      ),
      marginRight: interpolate(
        focusAnim.value,
        [0, 1],
        [
          !isInHalfFocusedMode ? 0 : styles.tag.marginRight,
          styles.tag.marginRight,
        ],
      ),
    })),
  };

  const handleFocus = () => {
    if (isFocused) {
      onUnfocus();
    } else {
      onFocus();
    }
  };

  return (
    <Animated.View style={[styles.activity, style, animStyles.activityItem]}>
      <View style={styles.activityInternal}>
        <View style={styles.buttonContainer}>
          {mergedButtons.map((button) => (
            <TouchableOpacity
              style={[{ backgroundColor: button.color }, styles.button]}
              key={button.text}
              onPress={button.onPress}
              activeOpacity={0.75}
            >
              <Text style={styles.buttonText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            handleFocus();
            setIsUnfocusStarted(isFocused);
          }}
          style={styles.touchableView}
        >
          <Animated.View style={[styles.collapsedProject]}>
            <View style={styles.collapsedProjectLeft}>
              {isFocused ? (
                <View style={styles.leftButtonContainer}>
                  <Unfocus
                    style={styles.leftButtonUnfocus}
                    fill={activityColor}
                    width={23}
                    height={23}
                  />
                </View>
              ) : (
                <View style={styles.leftButtonContainer}>
                  <At
                    style={styles.leftButtonTag}
                    fill={activityColor}
                    width={23}
                    height={23}
                  />
                </View>
              )}
              <View style={styles.textContiner}>
                <Text style={styles.text}>{activityName}</Text>
              </View>
              <Animated.View style={animStyles.hoursText}>
                <Text style={styles.hoursText}>12 hours</Text>
              </Animated.View>
            </View>
          </Animated.View>
          <Animated.View style={[styles.secondRow, animStyles.secondRow]}>
            <View style={styles.innerSecondRow}>
              <Tag style={animStyles.tag} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
