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
  useSharedValue,
} from "react-native-reanimated";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Tag from "@assets/icons/tag.svg";
import ChevronDown from "@assets/icons/chevron-down.svg";
import ChevronLeft from "@assets/icons/chevron-left.svg";
import Unfocus from "@assets/icons/unfocus.svg";
import { useMemo } from "react";

export interface ButtonActivityInfo {
  text: string;
  color: string;
  onPress: () => void;
}

interface ActivityProps {
  activityName?: string;
  activityColor?: string;
  isFocused?: boolean;
  isExpanded?: boolean;
  buttons?: ButtonActivityInfo[];
  onExpand?: () => void;
  onFocus?: () => void;
  onUnfocus?: () => void;
  hasChildren?: boolean;
  style?: object;
  onLayout?: (event: LayoutChangeEvent) => void;
  expandAnim?: Animated.SharedValue<number>;
  focusAnim?: Animated.SharedValue<number>;
  visibleAnim?: Animated.SharedValue<number>;
}

export default function Activity({
  activityName = "Activity",
  activityColor = "",
  isFocused = false,
  isExpanded = false,
  onExpand = () => {},
  onFocus = () => {},
  onUnfocus = () => {},
  hasChildren = false,
  buttons = [],
  style = {},
  onLayout,
  expandAnim = useSharedValue(0),
  focusAnim = useSharedValue(0),
  visibleAnim = useSharedValue(1),
}: ActivityProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  activityColor = activityColor || theme.color.presets.green.medium;

  const mergedButtons = useMemo(() => {
    const defaultButtons: ButtonActivityInfo[] = [
      {
        text: "Start timer",
        color: theme.color.lightGrey, // Use theme color as default
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

  const animStyles = {
    chevron: useAnimatedStyle(() => ({
      transform: [
        {
          rotate: `${interpolate(expandAnim.value, [0, 1], [1, 0]) * 90}deg`,
        },
      ],
    })),
    activityItem: useAnimatedStyle(() => ({
      height:
        visibleAnim.value * interpolate(focusAnim.value, [0, 1], [40, 82.2]),
      borderWidth: interpolate(visibleAnim.value, [0, 0.1, 1], [0, 0.18, 0.18]),
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
    <Animated.View
      style={[styles.activity, style, animStyles.activityItem]}
      onLayout={onLayout}
    >
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
          style={styles.collapsedActivity}
          onPress={handleFocus}
        >
          {isFocused ? (
            <TouchableOpacity
              style={styles.leftButtonContainer}
              onPress={handleFocus}
            >
              <Unfocus style={styles.leftButtonUnfocus} fill={activityColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.leftButtonContainer}>
              <Tag
                style={styles.leftButtonTag}
                fill={activityColor}
                width={23}
                height={26}
              />
            </View>
          )}
          <View style={styles.textContiner}>
            <Text style={styles.text}>{activityName}</Text>
          </View>

          {hasChildren && (
            <TouchableOpacity
              style={styles.chevronContainer}
              onPress={onExpand}
            >
              <Animated.View
                style={[styles.chevronInnerContainer, animStyles.chevron]}
              >
                <ChevronDown style={styles.chevron} fill={activityColor} />
              </Animated.View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
