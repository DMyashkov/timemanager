import { View, Text } from "react-native";
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
    <View>
      <Text>Header</Text>
    </View>
  );
};

export default Header;
