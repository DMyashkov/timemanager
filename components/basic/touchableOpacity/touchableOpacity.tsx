import {
  TouchableOpacity,
  Keyboard,
  GestureResponderEvent,
} from "react-native";
import type { TouchableOpacityProps } from "react-native";

interface CustomTouchableOpacityProps extends TouchableOpacityProps {
  dismissKeyboard?: boolean; // Optional prop to enable/disable keyboard dismissal
}

const CustomTouchableOpacity: React.FC<CustomTouchableOpacityProps> = ({
  dismissKeyboard = true,
  onPress,
  ...props
}) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (dismissKeyboard) {
      Keyboard.dismiss();
    }
    if (onPress) {
      onPress(event);
    }
    console.log("CustomTouchableOpacity");
  };

  return <TouchableOpacity {...props} onPress={handlePress} />;
};

export default CustomTouchableOpacity;
