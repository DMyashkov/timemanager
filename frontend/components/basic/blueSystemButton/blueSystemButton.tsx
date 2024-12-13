import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

interface buttonProps {
  text: string;
  onPress?: () => void;
  isRed?: boolean;
  isRegular?: boolean;
}

export default function SysButton({
  text,
  onPress = () => {},
  isRed = false,
  isRegular = false,
}: buttonProps) {
  const styles = useStyles(isRegular);
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={{ zIndex: 1 }}>
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
