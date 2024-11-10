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
import At from "@assets/icons/at.svg";

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

  activityColor = activityColor || theme.color.presets.green;

  const animStyles = {
    activityItem: useAnimatedStyle(() => ({
      height: visibleAnim.value * 40,
      borderWidth: interpolate(visibleAnim.value, [0, 0.1, 1], [0, 3, 3]),
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
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
