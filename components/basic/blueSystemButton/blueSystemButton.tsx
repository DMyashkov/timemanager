import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

interface buttonProps {
  text: string;
  onPress?: () => void;
  isRed?: boolean;
}

export default function SysButton({
  text,
  onPress = () => {},
  isRed = false,
}: buttonProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      {!isRed ? (
        <Text style={styles.headerModalText}>{text}</Text>
      ) : (
        <Text style={[styles.headerModalText, { color: theme.color.red }]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
