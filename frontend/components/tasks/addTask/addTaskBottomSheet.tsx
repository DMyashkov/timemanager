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
import {
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import TwoArrows from "@assets/icons/two-arrows.svg";
import type { SvgProps } from "react-native-svg";
import ArrowUp from "@assets/icons/arrow-up.svg";
import Calendar from "@assets/icons/calendar.svg";
import Flag from "@assets/icons/flag.svg";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";
import { useTaskContext } from "@/context/TaskContext";
import { priorityEnum, type TaskData } from "@/constants/interfaces";
import ActionSheet from "@/components/basic/actionSheet/actionSheet";
import { actionItemsArray } from "@/components/basic/actionSheetPriority/actionSheetPriority";
import PickDateCalendar from "@/components/calendar/pickDateCalendar/pickDateCalendar";
import { DateStruct } from "@/utils/dateTimeSession";

export default function AddTaskSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  const taskNameInputRef = useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);
  const actionSheetRef = useRef<BottomSheet>(null);
  const calendarSheetRef = useRef<BottomSheet>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<priorityEnum>(priorityEnum.none);
  const [date, setDate] = useState<number>(Date.now());
  const [activityId, setActivityId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { createTask } = useTaskContext();
  const { theme } = useTheme();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index >= 0) {
      taskNameInputRef.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  }, []);

  const styles = useStyles();

  const isSendable = title.length > 0;

  const handleCreateTask = async () => {
    if (!isSendable) return;

    const taskData: TaskData = {
      title,
      description,
      date,
      priority,
      completed: false,
      synced: 0,
      deleted: 0,
      tagId: projectId || activityId || undefined,
    };

    console.log("Attempting to create task with data:", taskData);

    try {
      const taskId = await createTask(db, taskData);
      console.log("Task created successfully with ID:", taskId);

      // Reset form
      setTitle("");
      setDescription("");
      setPriority(priorityEnum.none);
      setDate(Date.now());
      setActivityId(null);
      setProjectId(null);

      // Close the sheet
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const openActionSheet = () => {
    actionSheetRef.current?.snapToIndex(0);
  };

  const openCalendarSheet = () => {
    calendarSheetRef.current?.snapToIndex(0);
  };

  const handleDateChange = (date: DateStruct | null) => {
    if (!date) return;
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    selectedDate.setHours(23, 59, 0, 0);
    setDate(selectedDate.getTime());
    calendarSheetRef.current?.close();
  };

  const handlePriorityChange = (newPriority: priorityEnum) => {
    setPriority(newPriority);
    actionSheetRef.current?.close();
  };

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

  // renders
  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        snapPoints={[225]}
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
                ref={taskNameInputRef}
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
                text={new Date(date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
                color={theme.color.red}
                marginBottomIcon={3}
                onPress={openCalendarSheet}
              />
              <ButtonInsideFooterComponent
                Icon={Flag}
                text={`Priority ${priority}`}
                color={priority === priorityEnum.none ? theme.color.darkGrey : theme.color.red}
                marginBottomIcon={2}
                onPress={openActionSheet}
              />
            </BottomSheetView>
          </BottomSheetScrollView>
          <View style={styles.footer}>
            <ButtonInsideFooterComponent
              Icon={TwoArrows}
              text="Change Activity"
              color={theme.color.darkGrey}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: isSendable ? theme.color.red : "#EDA59E",
                },
              ]}
              onPress={handleCreateTask}
              disabled={!isSendable}
            >
              <ArrowUp
                width={16}
                height={16}
                fill={isSendable ? theme.color.white : "#F6D2CE"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      <ActionSheet
        actionTextColor={theme.color.black}
        bottomSheetRef={actionSheetRef}
        actionItems={actionItemsArray({
          setPriority: handlePriorityChange,
        })}
        cancelTextStyle={{
          fontFamily: theme.font.medium,
          color: theme.color.black,
        }}
      />

      <PickDateCalendar
        bottomSheetRef={calendarSheetRef}
        onPickDate={handleDateChange}
      />
    </>
  );
}

function ButtonInsideFooterComponent({
  Icon,
  text,
  color,
  marginBottomIcon = 0,
  onPress,
}: {
  Icon: React.FC<SvgProps>;
  text: string;
  color: string;
  marginBottomIcon?: number;
  onPress?: () => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.changeActivityButton} onPress={onPress}>
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
