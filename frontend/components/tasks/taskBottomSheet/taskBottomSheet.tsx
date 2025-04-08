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
  Touchable,
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
import { priorityEnum, type TaskData } from "@/constants/interfaces";
import Tag from "@/components/tag/tagComponent";
import ActionSheet from "@/components/basic/actionSheet/actionSheet";
import { actionItemsArray } from "@/components/basic/actionSheetPriority/actionSheetPriority";
import PickDateCalendar from "@/components/calendar/pickDateCalendar/pickDateCalendar";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";
import { useTaskContext } from "@/context/TaskContext";

interface TaskBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  task: TaskData;
}

export default function TaskBottomSheet({
  bottomSheetRef,
  task,
}: TaskBottomSheetProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<priorityEnum>(task.priority);
  const [date, setDate] = useState<number>(task.date);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { updateTask } = useTaskContext();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        style={{
          backgroundColor: "#000",
          opacity: 0.4,
          marginTop: -20000,
        }}
      />
    ),
    [],
  );

  const handleUpdateTask = async () => {
    if (!title || !task.id) return;

    try {
      await updateTask(db, task.id, {
        title,
        description,
        date,
        activityId: task.activityId,
        projectId: task.projectId,
        priority,
        completed: task.completed,
      });

      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleToggleComplete = async () => {
    if (!task.id) return;

    try {
      await updateTask(db, task.id, {
        completed: !task.completed,
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const actionSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet

  const openActionSheet = () => {
    actionSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

  const calendarSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet
  const openCalendarSheet = () => {
    calendarSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

  const isSendable = title.length > 0;

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

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        snapPoints={["50%", "90%"]}
        enablePanDownToClose={true}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        enableContentPanningGesture={true}
        handleIndicatorStyle={{ backgroundColor: theme.color.darkGrey }}
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
                  onPress={handleToggleComplete}
                  activeOpacity={1}
                >
                  {task.completed && <Text style={styles.checkmark}>✓</Text>}
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
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  openCalendarSheet();
                }}
              >
                <View style={styles.iconOuter}>
                  <CalendarIcon
                    fill={theme.color.darkRed}
                    height={20}
                    width={20}
                  />
                </View>
                <Text style={styles.dateText}>
                  {new Date(date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity
                style={[styles.row]}
                onPress={() => openActionSheet()}
              >
                <View style={[styles.iconOuter]}>
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
                <Text style={styles.dateText}>Priority {priority}</Text>
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
                    fill={theme.color.darkGrey}
                    height={24}
                    width={24}
                  />
                </View>
                <View style={styles.tagContainer}>
                  {task.activityId && (
                    <Tag
                      text={task.activityId.toString()}
                      desiredHeight={31}
                      textSize={theme.fontSize.small}
                      colorPallete={theme.color.presets.blue}
                    />
                  )}
                  {task.projectId && (
                    <Tag
                      text={task.projectId.toString()}
                      isProject={true}
                      desiredHeight={31}
                      textSize={theme.fontSize.small}
                      colorPallete={theme.color.presets.green}
                    />
                  )}
                </View>
              </View>
              <ButtonInsideFooterComponent
                Icon={TwoArrows}
                text="Change Activity / Project"
                color={theme.color.darkGrey}
                style={{
                  marginTop: -2,
                }}
                onPress={() => {
                  router.push("/pickActivity");
                }}
              />
              <View style={styles.bigSeparator} />
            </BottomSheetView>
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
      <ActionSheet
        actionTextColor={theme.color.black}
        bottomSheetRef={actionSheetRef}
        actionItems={actionItemsArray({
          setPriority: (number: number) => {
            setPriority(number as priorityEnum);
          },
        })}
        cancelTextStyle={{
          fontFamily: theme.font.medium,
          color: theme.color.black,
        }}
      />
      <PickDateCalendar
        bottomSheetRef={calendarSheetRef}
        onPickDate={(date) => {
          if (date) {
            const dateWithTime = new Date(date.year, date.month - 1, date.day);
            dateWithTime.setHours(23, 59, 0, 0);
            setDate(dateWithTime.getTime());
          }
        }}
      />
    </>
  );
}

function ButtonInsideFooterComponent({
  Icon,
  text,
  color,
  marginBottomIcon = 0,
  style,
  onPress,
}: {
  Icon: React.FC<SvgProps>;
  text: string;
  color: string;
  marginBottomIcon?: number;
  style?: object;
  onPress?: () => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.changeActivityButton, style]}
    >
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
    </TouchableOpacity>
  );
}
