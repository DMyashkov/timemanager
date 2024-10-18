import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated, // Import Animated from React Native
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStyles from "./styles";
import MagnifyingGlass from "@assets/icons/magnifying-glass.svg";
import XMark from "@assets/icons/xmark.svg";
import { useTheme } from "@context/ThemeContext";
import { useRef, useState } from "react";

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

const Header: React.FC<HeaderProps> = ({
  title,
  buttons = [],
  showSearchBar = false,
}) => {
  const styles = useStyles(); // Retrieve styles using the custom hook
  const { theme } = useTheme(); // Access the current theme from context
  const [searchText, setSearchText] = useState(""); // State for managing input text
  const [isExpanded, setIsExpanded] = useState(false); // State for header expansion
  const [selectedOption, setSelectedOption] = useState("Activities"); // "Activities" or "Projects"

  // Initialize the animated value
  const expandAnim = useRef(new Animated.Value(0)).current;

  const handleClearInput = () => {
    setSearchText(""); // Clear the input text
  };

  const expandHeader = () => {
    Animated.timing(expandAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false, // Must be false when animating height
    }).start();
  };

  const collapseHeader = () => {
    Animated.timing(expandAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const handleBarsPress = () => {
    if (!isExpanded) {
      expandHeader();
    } else {
      collapseHeader();
    }
    setIsExpanded(!isExpanded);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    collapseHeader(); // Collapse the header after selection
    setIsExpanded(false);
  };

  const modifiedButtons = buttons.map((button) => {
    if (button.id === "bars") {
      return {
        ...button,
        onPress: handleBarsPress, // Override onPress for the bars icon
      };
    }
    return button;
  });

  // Define the max height of the options container
  const optionsContainerHeight = 100; // Adjust this to the actual height

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.header}>
        <SafeAreaView style={styles.headerContentContainer}>
          <View style={styles.headerFirstRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.buttonContainer}>
              {/* Render buttons or search bar if needed */}
              {modifiedButtons.map((button) => (
                <TouchableOpacity key={button.id} onPress={button.onPress}>
                  {button.iconElement}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Animated options container */}
          <Animated.View
            style={{
              overflow: "hidden",
              height: expandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, optionsContainerHeight], // From 0 to max height
              }),
              marginTop: -styles.headerContentContainer.gap / 2,
              marginBottom: -styles.headerContentContainer.gap / 2,
            }}
          >
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === "Activities" && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect("Activities")}
              >
                <Text style={styles.optionText}>Activities</Text>
              </TouchableOpacity>
              <TouchableOpacity
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
              {searchText.length > 0 && ( // Show the clear button if there's text
                <TouchableOpacity
                  style={styles.xmark}
                  onPress={handleClearInput}
                >
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
};

export default Header;
