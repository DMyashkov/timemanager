import {
  View,
  Text,
  TouchableOpacity,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Tag from "@assets/icons/tag.svg";
import ChevronDown from "@assets/icons/chevron-down.svg";
import ChevronLeft from "@assets/icons/chevron-left.svg";
import Unfocus from "@assets/icons/unfocus.svg";
import { useEffect, useMemo, useRef } from "react";

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
}: ActivityProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  activityColor = activityColor || theme.color.presets.green;

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

  const focusAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFocused, focusAnim]);

  return (
    <Animated.View
      style={[
        styles.activity,
        style,
        {
          height: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 80],
          }),
        },
      ]}
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
        <TouchableOpacity style={styles.collapsedActivity} onPress={onFocus}>
          {isFocused ? (
            <TouchableOpacity
              style={styles.leftButtonContainer}
              onPress={onUnfocus}
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
              {isExpanded ? (
                <ChevronDown style={styles.chevron} fill={activityColor} />
              ) : (
                <ChevronLeft style={styles.chevron} fill={activityColor} />
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
