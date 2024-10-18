import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStyles from "./styles";
import MagnifyingGlass from "@assets/icons/magnifying-glass.svg";
import XMark from "@assets/icons/xmark.svg";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { Animated, Easing } from "react-native";

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
  const [selectedOption, setSelectedOption] = useState("Activities"); // "Tags" or "All"

  const handleClearInput = () => {
    setSearchText(""); // Clear the input text
  };

  const handleBarsPress = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsExpanded(false); // Collapse the header after selection
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
                <View key={button.id} onTouchEnd={button.onPress}>
                  {button.iconElement}
                </View>
              ))}
            </View>
          </View>

          {isExpanded && (
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
