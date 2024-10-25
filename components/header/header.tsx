import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Easing,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useStyles from "./styles";
import MagnifyingGlass from "@assets/icons/magnifying-glass.svg";
import XMark from "@assets/icons/xmark.svg";
import { useTheme } from "@context/ThemeContext";
import { useEffect, useRef, useState } from "react";

interface Button {
  id: string; // Added id for unique key
  iconElement: JSX.Element;
  onPress: () => void;
}

interface HeaderProps {
  title: string;
  buttons?: Button[];
  showSearchBar?: boolean;
}

export default function Header({
  title,
  buttons = [],
  showSearchBar = false,
}: HeaderProps) {
  const styles = useStyles(); // Retrieve styles using the custom hook
  const { theme } = useTheme(); // Access the current theme from context
  const [searchText, setSearchText] = useState(""); // State for managing input text
  const [isExpanded, setIsExpanded] = useState(false); // State for header expansion
  const [selectedOption, setSelectedOption] = useState("Activities"); // "Activities" or "Projects"

  // Initialize the animated value
  const expandAnim = useSharedValue(0);
  const animStyles = {
    optionsContainerOuter: useAnimatedStyle(() => ({
      height: interpolate(
        expandAnim.value,
        [0, 1],
        [0, styles.optionsContainer.height],
      ),
      marginBottom: interpolate(
        expandAnim.value,
        [0, 1],
        [-styles.headerContentContainer.gap / 2, 0],
      ),
    })),
  };

  const handleClearInput = () => {
    setSearchText(""); // Clear the input text
  };
  useEffect(() => {
    // toggle options
    expandAnim.value = withTiming(Number(!isExpanded), { duration: 250 });
  }, [isExpanded, expandAnim]);

  const handleBarsPress = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsExpanded(false);
  };
  const isThereOptions = buttons.some((button) => button.id === "bars");

  const modifiedButtons = buttons.map((button) => {
    if (button.id === "bars") {
      return {
        ...button,
        onPress: handleBarsPress, // Override onPress for the bars icon
      };
    }
    return button;
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.header}>
        <SafeAreaView
          edges={["right", "top", "left"]}
          style={styles.headerContentContainer}
        >
          <View style={styles.headerFirstRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.buttonContainer}>
              {modifiedButtons.map((button) => (
                <TouchableOpacity key={button.id} onPress={button.onPress}>
                  {button.iconElement}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Animated options container */}
          {isThereOptions && (
            <Animated.View
              style={[
                styles.optionsContainerOuter,
                animStyles.optionsContainerOuter,
              ]}
            >
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.optionButton,
                    selectedOption === "Activities" && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect("Activities")}
                >
                  <Text style={styles.optionText}>Activities</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.optionButton,
                    selectedOption === "Projects" && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect("Projects")}
                >
                  <Text style={styles.optionText}>Projects</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {showSearchBar && (
            <View style={styles.searchBar}>
              <View style={styles.magnifyingGlassContainer}>
                <MagnifyingGlass
                  height={16}
                  width={16}
                  fill={theme.color.searchBar.text}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={theme.color.searchBar.text}
                value={searchText}
                onChangeText={setSearchText}
                numberOfLines={1} // Ensures it only takes one line
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={handleClearInput}>
                  <XMark
                    height={16}
                    width={16}
                    fill={theme.color.searchBar.text}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
