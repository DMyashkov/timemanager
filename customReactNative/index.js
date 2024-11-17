// custom-react-native/index.js

// Import everything from the original 'react-native' module
import * as ReactNative from "react-native";

// Import your custom TouchableOpacity
import CustomTouchableOpacity from "../components/basic/touchableOpacity/touchableOpacity";

// Replace the TouchableOpacity export with your custom implementation
const { TouchableOpacity: OriginalTouchableOpacity, ...rest } = ReactNative;

// Re-export everything, but replace TouchableOpacity with your custom one
export const TouchableOpacity = CustomTouchableOpacity;

export default {
  ...rest,
  TouchableOpacity: CustomTouchableOpacity,
};
