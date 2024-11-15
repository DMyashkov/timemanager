import { View, Text, TextInput } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";

export default function TextField() {
  const styles = useStyles();
  const { theme } = useTheme();
  const [text, onChangeText] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.containerInner}>
        <TextInput
          style={styles.textInput}
          placeholder="Activity Name"
          placeholderTextColor={theme.color.darkerLightGrey}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
