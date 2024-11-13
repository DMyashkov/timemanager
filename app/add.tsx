import { View, Text } from "react-native";
// import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

export default function AddScreen() {
  // const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View>
      <Text>AddScreen</Text>
    </View>
  );
}
