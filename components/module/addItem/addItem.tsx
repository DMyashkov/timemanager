import { Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import useStyles from "./styles";
// import { useTheme } from "@context/ThemeContext";

// Add props
interface AddItemProps {
  style?: object;
  onClickAddButton?: () => void;
}

export default function AddItem({
  style = {},
  onClickAddButton,
}: AddItemProps) {
  const styles = useStyles();
  // const { theme } = useTheme();

  return (
    <Animated.View style={[styles.additemOuter, style]}>
      <TouchableOpacity style={[styles.additem]} onPress={onClickAddButton}>
        <Text style={styles.addtext}>Add</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
