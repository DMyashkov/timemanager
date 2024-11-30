import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@interfaces";

export default function SessionElement({
  style = {},
  colorPallete: Color,
}: {
  style?: object;
  colorPallete: Color;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.outer}>
      <Text>Session</Text>
    </View>
  );
}
