// ActionItem.tsx
import type React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { SvgProps } from "react-native-svg";

interface ActionItemProps {
  Icon: React.FC<SvgProps>; // SVG icon component
  text: string; // The text to display
  textColor: string; // Color of the text
  iconColor: string; // Color of the SVG icon
}
const ActionItemElement: React.FC<ActionItemProps> = ({
  Icon,
  text,
  textColor,
  iconColor,
}) => {
  return (
    <View style={styles.container}>
      <Icon width={20} height={20} fill={iconColor} />
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 12,
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
});

export default ActionItemElement;
