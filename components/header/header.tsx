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

  const handleClearInput = () => {
    setSearchText(""); // Clear the input text
  };

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
              {buttons.map((button) => (
                <View key={button.id} onTouchEnd={button.onPress}>
                  {button.iconElement}
                </View>
              ))}
            </View>
          </View>
          {showSearchBar && (
            <View style={styles.searchBar}>
              <View style={styles.magnifyingGlassContainer}>
                <MagnifyingGlass
                  height={16}
                  width={16}
                  fill={theme.color.darkGrey}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={theme.color.darkGrey}
                value={searchText}
                onChangeText={setSearchText}
                numberOfLines={1} // Ensures it only takes one line
              />
              {searchText.length > 0 && ( // Show the clear button if there's text
                <TouchableOpacity
                  style={styles.xmark}
                  onPress={handleClearInput}
                >
                  <XMark height={16} width={16} fill={theme.color.darkGrey} />
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
