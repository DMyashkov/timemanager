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
import TextField from "@components/form/textField";

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
              onPress: () => console.log("Activity pressed"),
            },
            {
              text: "Project",
              onPress: () => console.log("Project pressed"),
            },
          ]}
        />
        <ScrollView style={styles.scrollView}>
          <TextField />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
