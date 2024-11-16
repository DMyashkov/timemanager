import { View, Text, TextInput } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";

export default function TextField({
  placeholder = "Activity Name",
  setModuleName = () => {},
}: {
  placeholder?: string;
  setModuleName?: (name: string) => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const onChangeText = (text: string) => {
    setText(text);
    setModuleName(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInner}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={theme.color.darkerLightGrey}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
