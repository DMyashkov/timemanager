import { View, Text, TextInput, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

import MagnifyingGlass from "@assets/icons/magnifying-glass.svg";
import XMark from "@assets/icons/xmark.svg";

export default function SearchBarCustom({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const handleClearInput = () => {
    setSearchText(""); // Clear the input text
  };

  return (
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
          <XMark height={16} width={16} fill={theme.color.searchBar.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}
