import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import useStyles from "./addStyles";
import { useTheme } from "@context/ThemeContext";
import Switch from "@components/basic/switch/switch";
import TextField from "@/components/form/textField/textField";
import Picker from "@/components/form/picker/picker";
import ColorPicker from "@/components/form/colorPicker/colorPicker";
import { useState } from "react";
import { dataIndex } from "@/constants/exampleData";
import PathPicker from "@/components/form/pathPicker/pathPicker";
import { ColorPresets } from "@/constants/interfaces";

export default function AddScreen() {
  const styles = useStyles();
  const { theme } = useTheme();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const colorArray = [
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
  ];

  const [parent, setParent] = useState(dataIndex["activity-1-1-1-1-1"]);

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
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{
              marginHorizontal: -styles.innerAddScreen.paddingHorizontal,
              paddingHorizontal: styles.innerAddScreen.paddingHorizontal,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.content}
              onPress={Keyboard.dismiss}
            >
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
                colorPresets={colorArray}
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
              />
              <PathPicker
                parent={parent}
                setParent={setParent}
                moduleColorPallete={colorArray[selectedColorIndex]}
              />
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
