import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import styles from "./styles";

interface Button {
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
  return (
    <View style={styles.header}>
      <SafeAreaView style={styles.headerContentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View />
      </SafeAreaView>
    </View>
  );
};

export default Header;
