import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStyles from "./styles";
import { useCallback, useRef, useState, useEffect } from "react";
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
import {
  priorityEnum,
  type TaskData,
  TagData,
  moduleTypeEnum,
} from "@/constants/interfaces";
import Tag from "@/components/tag/tagComponent";
import ActionSheet from "@/components/basic/actionSheet/actionSheet";
import { actionItemsArray } from "@/components/basic/actionSheetPriority/actionSheetPriority";
import PickDateCalendar from "@/components/calendar/pickDateCalendar/pickDateCalendar";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";
import { useTaskContext } from "@/context/TaskContext";
import PickActivity from "@/app/pickActivity";
import { useTagContext } from "@/context/TagContext";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { DateStruct } from "@/utils/dateTimeSession";
import { useDerivedTags } from "@/hooks/useDerivedTags";
import { ButtonInsideFooterComponent } from "@components/tasks/addTask/addTaskBottomSheet";
import XMark from "@assets/icons/x.svg";

interface TaskBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  task: TaskData;
  onTaskUpdate?: (task: TaskData) => void;
  onTaskDelete?: (taskId: number) => void;
}

export const TaskBottomSheet: React.FC<TaskBottomSheetProps> = ({
  bottomSheetRef,
  task,
  onTaskUpdate,
  onTaskDelete,
}) => {
  // console.log("TaskbottomSheet task", task);
  const styles = useStyles();
  const { theme } = useTheme();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [date, setDate] = useState<number | null>(task.date);
  const [completed, setCompleted] = useState(task.completed);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { updateTask } = useTaskContext();
  const { getTag } = useTagContext();
  const [selectedDate, setSelectedDate] = useState<DateStruct | null>(null);
  const [selectedTagID, setSelectedTagID] = useState<number | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setDate(task.date);
      setCompleted(task.completed);
      setSelectedTagID(task.tagId);
    }
  }, [task]);

  // useEffect(() => {
  //   // console.log("Selected Tag ID:", selectedTagID);
  // }, [selectedTagID]);

  const { activityNode, projectNode } = useDerivedTags(selectedTagID);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
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

  const handleUpdateTask = useCallback(async () => {
    if (!task.id) return;

    const updatedTask: TaskData = {
      id: task.id,
      title,
      description,
      priority,
      date,
      completed,
      synced: 0,
      deleted: 0,
      tagId: task.tagId,
    };

    try {
      await updateTask(db, task.id, updatedTask);
      onTaskUpdate?.(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
    bottomSheetRef.current?.close();
  }, [
    title,
    description,
    priority,
    date,
    completed,
    task.id,
    task.tagId,
    bottomSheetRef,
    onTaskUpdate,
    updateTask,
    db,
  ]);

  const handleToggleComplete = useCallback(async () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    if (task.id) {
      try {
        await updateTask(db, task.id, { completed: newCompleted });
        onTaskUpdate?.({ ...task, completed: newCompleted });
      } catch (error) {
        console.error("Error updating task completion:", error);
      }
    }
  }, [completed, task, updateTask, db, onTaskUpdate]);

  const handleDateChange = async (date: DateStruct | null) => {
    // Convert DateStruct to Date and set time to 23:59
    if (!task.id) return;
    let newDate: number | null;
    if (date) {
      const selectedDate = new Date(date.year, date.month - 1, date.day);
      selectedDate.setHours(23, 59, 0, 0);
      newDate = selectedDate.getTime();
      setDate(newDate);
    } else {
      newDate = null;
    }
    try {
      console.log("Updating task date:", newDate);
      await updateTask(db, task.id, { date: newDate });
      onTaskUpdate?.({ ...task, date: newDate });
    } catch (error) {
      console.error("Error updating task date:", error);
    }
  };

  const handlePriorityChange = async (newPriority: priorityEnum) => {
    if (!task.id) return;
    setPriority(newPriority);

    try {
      await updateTask(db, task.id, { priority: newPriority });
      onTaskUpdate?.({ ...task, priority: newPriority });
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
  };

  const handleDescriptionChange = async (newDescription: string) => {
    if (!task.id) return;
    setDescription(newDescription);

    try {
      await updateTask(db, task.id, { description: newDescription });
      onTaskUpdate?.({ ...task, description: newDescription });
    } catch (error) {
      console.error("Error updating task description:", error);
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    if (!task.id) return;
    setTitle(newTitle);

    try {
      await updateTask(db, task.id, { title: newTitle });
      onTaskUpdate?.({ ...task, title: newTitle });
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  const handleDelete = useCallback(() => {
    if (!task.id) return;
    onTaskDelete?.(task.id);
    bottomSheetRef.current?.close();
  }, [task.id, bottomSheetRef, onTaskDelete]);

  const actionSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet

  const openActionSheet = () => {
    actionSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

  const calendarSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet
  const openCalendarSheet = () => {
    setSelectedDate(DateStruct.fromDate(date ? new Date(date) : new Date()));
    calendarSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

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
        backgroundColor: theme.color.presets.orange.light,
        borderColor: theme.color.presets.orange.dark,
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

  const [isPickActivityVisible, setIsPickActivityVisible] = useState(false);

  const handleActivitySelected = async (newTag: TagData | null) => {
    if (!task.id) return;

    try {
      await updateTask(db, task.id, { tagId: newTag ? newTag.id : null });
      setSelectedTagID(newTag ? newTag.id : null);
      onTaskUpdate?.({ ...task, tagId: newTag ? newTag.id : null });
    } catch (error) {
      console.error("Error updating task tag:", error);
    }
  };

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
                  {completed && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
                <BottomSheetTextInput
                  placeholder="Task Name"
                  style={[styles.titleInput]}
                  placeholderTextColor={theme.color.darkGrey}
                  selectionColor={theme.color.red}
                  keyboardType="default"
                  value={title}
                  onChangeText={handleTitleChange}
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
                    onChangeText={handleDescriptionChange}
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
                  {date
                    ? new Date(date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : "No Date"}
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
                  {activityNode && (
                    <Tag
                      text={activityNode.title}
                      isProject={
                        activityNode.moduleType === moduleTypeEnum.project
                      }
                      desiredHeight={31}
                      textSize={theme.fontSize.small}
                      colorPallete={
                        theme.color.presets[activityNode.colorPreset]
                      }
                    />
                  )}
                  {projectNode && (
                    <Tag
                      text={projectNode.title}
                      isProject={
                        projectNode.moduleType === moduleTypeEnum.project
                      }
                      desiredHeight={31}
                      textSize={theme.fontSize.small}
                      colorPallete={
                        theme.color.presets[projectNode.colorPreset]
                      }
                    />
                  )}
                  {!(activityNode || projectNode) && (
                    <ButtonInsideFooterComponent
                      Icon={TwoArrows}
                      text="Pick Activity / Project"
                      color={theme.color.darkGrey}
                      style={{
                        marginTop: -2,
                      }}
                      onPress={() => {
                        setIsPickActivityVisible(true);
                      }}
                    />
                  )}
                </View>
              </View>
              {(activityNode || projectNode) && (
                <View style={styles.buttonRowBottom}>
                  <ButtonInsideFooterComponent
                    Icon={TwoArrows}
                    text="Change Activity / Project"
                    color={theme.color.darkGrey}
                    style={{
                      marginTop: -2,
                      marginBottom: 14,
                    }}
                    onPress={() => {
                      setIsPickActivityVisible(true);
                    }}
                  />
                  <ButtonInsideFooterComponent
                    Icon={XMark}
                    text=""
                    color={theme.color.darkGrey}
                    style={{
                      marginTop: -2,
                      marginBottom: 14,
                    }}
                    onPress={() => {
                      handleActivitySelected(null);
                    }}
                  />
                </View>
              )}
              <View style={styles.bigSeparator} />
            </BottomSheetView>
          </BottomSheetScrollView>
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
        initialDate={selectedDate}
      />
      <PickActivity
        visible={isPickActivityVisible}
        onClose={() => {
          setIsPickActivityVisible(false);
        }}
        onActivitySelected={handleActivitySelected}
        pickButtonText={selectedTagID ? "Change" : "Choose"}
      />
    </>
  );
};
