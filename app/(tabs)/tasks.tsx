import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStyles from "./styles/tasksStyles";
import { useCallback, useRef } from "react";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TextInput } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function Ball() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const styles = useStyles();
  const { theme } = useTheme();

  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        snapPoints={[200]}
        keyboardBehavior="interactive"
      >
        <BottomSheetView style={styles.contentContainer}>
          <BottomSheetView style={styles.titleContainer}>
            <BottomSheetTextInput
              placeholder="Task Name"
              style={styles.titleInput}
              placeholderTextColor={theme.color.darkGrey}
              selectionColor={theme.color.red}
              keyboardType="twitter"
            />
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
