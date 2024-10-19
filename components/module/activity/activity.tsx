import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Tag from "@assets/icons/tag.svg";
import ChevronDown from "@assets/icons/chevron-down.svg";

export default function Activity() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.activity}>
      <View style={styles.tagContainer}>
        <Tag style={styles.tag} fill={theme.color.presets.green} />
      </View>
      <View style={styles.textContiner}>
        <Text style={styles.text}>Activity 1</Text>
      </View>
      <View style={styles.chevronContainer}>
        <ChevronDown style={styles.chevron} fill={theme.color.presets.green} />
      </View>
    </View>
  );
}
