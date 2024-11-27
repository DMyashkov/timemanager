import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStyles from "./styles";
import { useCallback, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TextInput, View, Text, Keyboard } from "react-native";
import { useTheme } from "@context/ThemeContext";
import TwoArrows from "@assets/icons/two-arrows.svg";
import type { SvgProps } from "react-native-svg";
import ArrowUp from "@assets/icons/arrow-up.svg";
import Calendar from "@assets/icons/calendar.svg";
import Flag from "@assets/icons/flag.svg";

export default function AddTaskSheet({
  title = "asksak",
  setTitle = (s: string) => {},
  description = "",
  setDescription = (s: string) => {},
  bottomSheetRef,
}: {
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const styles = useStyles();
  const { theme } = useTheme();

  const isSendable = title.length > 0;

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // Hides the backdrop when the sheet is closed
        appearsOnIndex={0} // Shows the backdrop when the sheet is opened
        style={{
          backgroundColor: "#000",
          opacity: 0.4,
          marginTop: -20000,
        }}
      />
    ),
    [],
  );

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
      snapPoints={["50%", "90%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enableContentPanningGesture={true}
      handleIndicatorStyle={{ backgroundColor: "transparent" }}
      backdropComponent={renderBackdrop}
      index={-1}
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
        {/* <ButtonInsideFooterComponent */}
        {/*   Icon={TwoArrows} */}
        {/*   text="Change Activity" */}
        {/*   color={theme.color.darkGrey} */}
        {/* /> */}
      </View>
    </BottomSheet>
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
