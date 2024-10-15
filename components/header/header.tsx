import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStyles from "./styles";
import { loadIcon } from "@/utils/iconLoader";

interface Button {
  id: string; // Added id for unique key
  icon: string;
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

  return (
    <View style={styles.header}>
      <SafeAreaView style={styles.headerContentContainer}>
        <View style={styles.headerFirstRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View>
            {/* Render buttons or search bar if needed */}
            {buttons.map((button) => (
              <View
                key={button.id}
                onTouchEnd={button.onPress}
                // style={styles.button}
              >
                {loadIcon(button.icon)}
              </View>
            ))}
          </View>
        </View>
        <View>
          {showSearchBar && (
            <Text style={styles.searchBar}>
              Search Bar Placeholder
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;
