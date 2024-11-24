import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStyles from "./styles/tasksStyles";
import { useCallback, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TextInput, View, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import TwoArrows from "@assets/icons/two-arrows.svg";
import type { SvgProps } from "react-native-svg";
import ArrowUp from "@assets/icons/arrow-up.svg";
import Calendar from "@assets/icons/calendar.svg";
import Flag from "@assets/icons/flag.svg";

export default function Ball() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const styles = useStyles();
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const isSendable = title.length > 0;

  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        snapPoints={[225]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enableContentPanningGesture={true}
        handleIndicatorStyle={{ backgroundColor: "transparent" }}
        // backdropComponent={() => (
        //   <View style={{ flex: 1, opacity: 0.1 }}></View>
        // )}
      >
        <View style={styles.outer}>
          <BottomSheetScrollView
            style={styles.contentContainer}
            contentContainerStyle={{
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <BottomSheetView style={styles.titleContainer}>
              <BottomSheetTextInput
                placeholder="Task Name"
                style={[styles.titleInput]}
                placeholderTextColor={theme.color.darkGrey}
                selectionColor={theme.color.red}
                keyboardType="twitter"
                value={title}
                onChangeText={setTitle}
              />
              <BottomSheetTextInput
                placeholder="Description"
                style={styles.description}
                placeholderTextColor={theme.color.darkGrey}
                selectionColor={theme.color.red}
                keyboardType="default"
                multiline={true}
                scrollEnabled={false}
                value={description}
                onChangeText={setDescription}
              />
            </BottomSheetView>
            <BottomSheetView style={styles.buttonView}>
              <ButtonInsideFooterComponent
                Icon={Calendar}
                text={"Today"}
                color={theme.color.red}
                marginBottomIcon={3}
              />
              <ButtonInsideFooterComponent
                Icon={Flag}
                text={"Priority"}
                color={theme.color.darkGrey}
                marginBottomIcon={2}
              />
            </BottomSheetView>
          </BottomSheetScrollView>
          <View style={styles.footer}>
            <ButtonInsideFooterComponent
              Icon={TwoArrows}
              text="Change Activity"
              color={theme.color.darkGrey}
            />
            <View
              style={[
                styles.sendButton,
                {
                  backgroundColor: isSendable ? theme.color.red : "#EDA59E",
                },
              ]}
            >
              <ArrowUp
                width={16}
                height={16}
                fill={isSendable ? theme.color.white : "#F6D2CE"}
              />
            </View>
          </View>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

function ButtonInsideFooterComponent({
  Icon,
  text,
  color,
  marginBottomIcon = 0,
}: {
  Icon: React.FC<SvgProps>;
  text: string;
  color: string;
  marginBottomIcon?: number;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.changeActivityButton}>
      <Icon
        width={16}
        height={16}
        fill={color}
        style={{
          marginBottom: marginBottomIcon,
        }}
      />
      <Text
        style={[
          styles.textInsideChangeActivityButton,
          {
            color: color,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}
