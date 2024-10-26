import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useState } from "react";

export default function Test() {
  const styles = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const addAnim = useSharedValue(0);
  const shrinkAnim = useSharedValue(0);

  // Define the animated styles
  const animStyles = {
    container: useAnimatedStyle(() => {
      // Calculate `marginTop` based on `isExpanded` and `addAnim`
      const shouldThereBeMarginTop = isExpanded
        ? shrinkAnim.value
        : interpolate(addAnim.value, [0, 1], [0, 50]);

      // Debug statements to monitor the value of `marginTop`
      console.log("isExpanded", isExpanded ? 1 : 0);
      console.log("shrinkAnim value", shrinkAnim.value);
      console.log("addAnim value", addAnim.value);
      console.log("shouldThereBeMarginTop", shouldThereBeMarginTop);

      return {
        marginTop: shouldThereBeMarginTop,
      };
    }),
  };

  // Toggle expand state
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Handle add animation
  const handleAdd = () => {
    addAnim.value = withTiming(addAnim.value === 0 ? 1 : 0, { duration: 300 });
  };

  return (
    <SafeAreaView style={styles.outer}>
      <View style={styles.innerButtons}>
        <TouchableOpacity style={styles.button} onPress={toggleExpand}>
          <Text>Expand</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.container, animStyles.container]}>
        <Text style={{ textAlign: "center" }}>Animated Content</Text>
      </Animated.View>
    </SafeAreaView>
  );
}
