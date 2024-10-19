import { View, Text, TouchableOpacity } from "react-native";
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
  activityName: string;
  activityColor: string;
  isFocused: boolean;
  isExpanded: boolean;
  buttons: ButtonActivityInfo[];
}

export default function Activity({
  activityName = "Activity",
  activityColor = "",
  isFocused = true,
  isExpanded = false,
  buttons = [],
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

  return (
    <View style={styles.activity}>
      {isFocused && (
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
      )}
      <View style={styles.collapsedActivity}>
        <View style={styles.tagContainer}>
          {!isFocused ? (
            <Tag style={styles.tag} fill={activityColor} />
          ) : (
            <Unfocus style={styles.tag} fill={activityColor} />
          )}
        </View>
        <View style={styles.textContiner}>
          <Text style={styles.text}>{activityName}</Text>
        </View>
        <View style={styles.chevronContainer}>
          {isExpanded ? (
            <ChevronDown style={styles.chevron} fill={activityColor} />
          ) : (
            <ChevronLeft style={styles.chevron} fill={activityColor} />
          )}
        </View>
      </View>
    </View>
  );
}
