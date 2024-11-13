import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

interface buttonProps {
  text: string;
  onPress?: () => void;
}

export default function SysButton({ text, onPress = () => {} }: buttonProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.headerModalText}>{text}</Text>
    </TouchableOpacity>
  );
}
