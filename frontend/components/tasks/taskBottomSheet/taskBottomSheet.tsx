import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStyles from "./styles";
import { useCallback, useRef, useState } from "react";
import Paragraph from "@assets/icons/paragraph.svg";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import TwoArrows from "@assets/icons/two-arrows.svg";
import type { SvgProps } from "react-native-svg";
import ArrowUp from "@assets/icons/arrow-up.svg";
import CalendarIcon from "@assets/icons/calendar.svg";
import FlagIconFull from "@assets/icons/flag-full.svg";
import FlagIconHollow from "@assets/icons/flag.svg";
import Checkmark from "@assets/icons/checkmark.svg";
import WorkplaceIcon from "@assets/icons/workplace.svg";
import { priorityEnum } from "@/constants/interfaces";
import { dataIndex } from "@/constants/exampleData";
import Tag from "@/components/tag/tagComponent";
import { moduleType } from "@/constants/interfaces";
import ActionSheet from "@/components/basic/actionSheet/actionSheet";

export default function TaskBottomSheet({
  title = "asksak",
  setTitle = (s: string) => {},
  description = "",
  setDescription = (s: string) => {},
  bottomSheetRef,
  checkMark,
  setCheckMark,
  priority,
  tagId,
}: {
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  checkMark: boolean;
  setCheckMark: (s: boolean) => void;
  priority: number;
  tagId: string;
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
  interface ColorCheckmarkStyles {
    backgroundColor: string;
    borderColor: string;
  }

  let colorCheckmarkStyles: ColorCheckmarkStyles;
  switch (priority) {
    case priorityEnum.low:
      colorCheckmarkStyles = {
        backgroundColor: theme.color.presets.blue.light,
        borderColor: theme.color.presets.blue.dark,
      };
      break;
    case priorityEnum.medium:
      colorCheckmarkStyles = {
        backgroundColor: theme.color.presets.yellow.light,
        borderColor: theme.color.presets.yellow.dark,
      };
      break;
    case priorityEnum.high:
      colorCheckmarkStyles = {
        backgroundColor: theme.color.veryLightRed,
        borderColor: theme.color.darkRed,
      };
      break;
    default:
      colorCheckmarkStyles = {
        borderColor: theme.color.darkerDarkGrey,
        backgroundColor: theme.color.warmGrey,
      };
  }
  const isTagProject = dataIndex[tagId].item.type === moduleType.project;

  const parentId = dataIndex[tagId].path.at(-1);
  const itemActivity = isTagProject
    ? parentId
      ? dataIndex[parentId].item
      : null
    : dataIndex[tagId].item;
  const itemProject = isTagProject ? dataIndex[tagId].item : null;

  const actionItems = [
    {
      id: 1,
      label: "Action Item 1",
      onPress: () => {},
    },
    {
      id: 2,
      label: "Action Item 2",
      onPress: () => {},
    },
    {
      id: 3,
      label: "Action Item 3",
      onPress: () => {},
    },
    {
      id: 4,
      label: "Action Item 4",
      onPress: () => {},
    },
  ];
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
      snapPoints={["50%", "90%"]}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
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
            <View style={styles.firstRow}>
              <TouchableOpacity
                onPress={() => {
                  setCheckMark(!checkMark);
                }}
                activeOpacity={1}
              >
                {!checkMark ? (
                  <View style={[styles.checkMark, colorCheckmarkStyles]} />
                ) : (
                  <Checkmark
                    fill={theme.color.darkGrey}
                    height={22.3}
                    width={22.3}
                  />
                )}
              </TouchableOpacity>
              <BottomSheetTextInput
                placeholder="Task Name"
                style={[styles.titleInput]}
                placeholderTextColor={theme.color.darkGrey}
                selectionColor={theme.color.red}
                keyboardType="default"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.iconOuter}>
                <Paragraph
                  fill={theme.color.darkerDarkGrey}
                  height={20}
                  width={20}
                />
              </View>
              <View style={styles.wrapDescription}>
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
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View style={styles.iconOuter}>
                <CalendarIcon
                  fill={theme.color.darkRed}
                  height={20}
                  width={20}
                />
              </View>
              <Text style={styles.dateText}>27 Nov</Text>
            </View>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.row}
              onPress={() => setActionSheet(true)}
            >
              <View style={styles.iconOuter}>
                {priority === priorityEnum.none ? (
                  <FlagIconHollow
                    fill={theme.color.darkerDarkGrey}
                    height={20}
                    width={20}
                  />
                ) : (
                  <FlagIconFull
                    fill={colorCheckmarkStyles.borderColor}
                    height={20}
                    width={20}
                  />
                )}
              </View>
              <Text style={styles.dateText}>Priority 1</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View
                style={[
                  styles.iconOuter,
                  {
                    marginTop: 5,
                  },
                ]}
              >
                <WorkplaceIcon
                  fill={
                    theme.color.presets[dataIndex[tagId].item.colorPreset]
                      .medium
                  }
                  height={24}
                  width={24}
                />
              </View>
              <View style={styles.tagContainer}>
                {itemActivity && (
                  <Tag
                    text={itemActivity.title}
                    desiredHeight={31}
                    textSize={theme.fontSize.small}
                    colorPallete={theme.color.presets[itemActivity.colorPreset]}
                  />
                )}
                {itemProject && (
                  <Tag
                    text={itemProject.title}
                    isProject={true}
                    desiredHeight={31}
                    textSize={theme.fontSize.small}
                    colorPallete={theme.color.presets[itemProject.colorPreset]}
                  />
                )}
              </View>
            </View>
            <ButtonInsideFooterComponent
              Icon={TwoArrows}
              text="Change Activity / Project"
              color={theme.color.darkGrey}
              style={{
                marginTop: 12,
              }}
            />
            <View style={styles.bigSeparator} />
          </BottomSheetView>
        </BottomSheetScrollView>
      </View>
      <Modal
        visible={actionSheet}
        animationType="slide" // This enables the slide-in animation
        transparent={true} // Ensures background is transparent
        onRequestClose={closeActionSheet} // Handles back button press on Android
        style={{
          margin: 0,
          justifyContent: "flex-end",
        }}
      >
        <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
      </Modal>
    </BottomSheet>
  );
}

function ButtonInsideFooterComponent({
  Icon,
  text,
  color,
  marginBottomIcon = 0,
  style,
}: {
  Icon: React.FC<SvgProps>;
  text: string;
  color: string;
  marginBottomIcon?: number;
  style?: object;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={[styles.changeActivityButton, style]}>
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
