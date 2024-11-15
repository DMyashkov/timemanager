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

export default function AddScreen() {
  const styles = useStyles();
  const { theme } = useTheme();

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
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
