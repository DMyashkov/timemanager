import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import useStyles from "./addStyles";
import { useTheme } from "@context/ThemeContext";
import Switch from "@components/basic/switch/switch";
import TextField from "@/components/form/textField/textField";
import Picker from "@/components/form/picker/picker";
import ColorPicker from "@/components/form/colorPicker/colorPicker";
import { useState } from "react";

export default function AddScreen() {
  const styles = useStyles();
  const { theme } = useTheme();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const colorArray = [
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
    theme.color.presets.orange,
    theme.color.presets.green,
  ];

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={[styles.addScreen, { backgroundColor: "yellow" }]}
    >
      <View style={styles.innerAddScreen}>
        <Switch
          buttons={[
            {
              text: "Activity",
              onPress: () => {},
            },
            {
              text: "Project",
              onPress: () => {},
            },
          ]}
        />
        <ScrollView>
          <View style={styles.content}>
            <TextField />
            <Picker
              buttons={[
                {
                  text: "Productive",
                  onPress: () => {},
                },
                {
                  text: "Unproductive",
                  onPress: () => {},
                },
              ]}
            />
            <ColorPicker
              colors={colorArray}
              selectedColorIndex={selectedColorIndex}
              setSelectedColorIndex={setSelectedColorIndex}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
