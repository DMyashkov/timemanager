import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStyles from "./styles";
import { useCallback, useRef, useState, useEffect } from "react";
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
  FlatList,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import TwoArrows from "@assets/icons/two-arrows.svg";
import type { SvgProps } from "react-native-svg";
import ArrowUp from "@assets/icons/arrow-up.svg";
import Calendar from "@assets/icons/calendar.svg";
import FlagHollow from "@assets/icons/flag.svg";
import FlagFull from "@assets/icons/flag-full.svg";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";
import { useTaskContext } from "@/context/TaskContext";
import {
  priorityEnum,
  type TaskData,
  moduleTypeEnum,
  type TagData,
} from "@/constants/interfaces";
import ActionSheet from "@/components/basic/actionSheet/actionSheet";
import { actionItemsArray } from "@/components/basic/actionSheetPriority/actionSheetPriority";
import PickDateCalendar from "@/components/calendar/pickDateCalendar/pickDateCalendar";
import { DateStruct } from "@/utils/dateTimeSession";
import Tag from "@/components/tag/tagComponent";
import { useTagContext } from "@/context/TagContext";
import { useDerivedTags } from "@/hooks/useDerivedTags";
import PickActivity from "@/app/pickActivity";

type FlatListItem = TagData | { type: "button" };

export default function AddTaskSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  const taskNameInputRef =
    useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);
  const actionSheetRef = useRef<BottomSheet>(null);
  const calendarSheetRef = useRef<BottomSheet>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<priorityEnum>(priorityEnum.none);
  const [date, setDate] = useState<number>(Date.now());
  const [activityId, setActivityId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isPickActivityVisible, setIsPickActivityVisible] = useState(false);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { createTask } = useTaskContext();
  const { theme } = useTheme();
  const { getTag } = useTagContext();
  const { activityNode, projectNode } = useDerivedTags(selectedTag);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority(priorityEnum.none);
    setDate(Date.now());
    setActivityId(null);
    setProjectId(null);
    setSelectedTag(null);
    setIsPickActivityVisible(false);
  }, []);

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

  const handleActivitySelected = async (newTag: TagData | null) => {
    if (newTag) {
      setSelectedTag(newTag.id);
    } else {
      setSelectedTag(null);
    }
    setIsPickActivityVisible(false);
  };

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
      tagId: selectedTag || undefined,
    };

    try {
      await createTask(db, taskData);
      resetForm();
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

  const getPriorityColor = (priority: priorityEnum): string => {
    switch (priority) {
      case priorityEnum.high:
        return theme.color.darkRed;
      case priorityEnum.medium:
        return theme.color.presets.yellow.dark;
      case priorityEnum.low:
        return theme.color.presets.blue.dark;
      default:
        return theme.color.darkGrey;
    }
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

  const renderTag = ({ item }: { item: FlatListItem }) => {
    if ("type" in item) {
      return null;
    }
    
    const colorPalette = theme.color.presets[item.colorPreset as keyof typeof theme.color.presets];
    const hasMedium = 'medium' in colorPalette;
    
    return (
      <Tag
        text={item.title}
        isProject={item.moduleType === moduleTypeEnum.project}
        desiredHeight={31}
        textSize={theme.fontSize.small}
        colorPallete={{
          light: colorPalette.light,
          medium: hasMedium ? colorPalette.medium : colorPalette.dark,
          dark: colorPalette.dark,
        }}
      />
    );
  };

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
        onClose={resetForm}
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
                Icon={FlagHollow}
                text={
                  priority === priorityEnum.none
                    ? "No Priority"
                    : `Priority ${priority}`
                }
                color={getPriorityColor(priority)}
                marginBottomIcon={2}
                onPress={openActionSheet}
                priority={priority}
              />
            </BottomSheetView>
          </BottomSheetScrollView>
          <View style={styles.footer}>
            <View style={[styles.footer, { flexDirection: "row", alignItems: "center", flex: 1 }]}>
              <FlatList<FlatListItem>
                data={[
                  { type: "button" as const },
                  ...([activityNode, projectNode].filter((item): item is TagData => item !== null && selectedTag !== null)),
                ]}
                renderItem={({ item }) => {
                  if ("type" in item && item.type === "button") {
                    return (
                      <ButtonInsideFooterComponent
                        Icon={TwoArrows}
                        text={!selectedTag ? "Pick Activity" : ""}
                        color={theme.color.darkGrey}
                        onPress={() => setIsPickActivityVisible(true)}
                      />
                    );
                  }
                  return renderTag({ item });
                }}
                keyExtractor={(item) => ("type" in item ? "button" : item.id.toString())}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 8, gap: 8 }}
              />
            </View>
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

      <PickActivity
        visible={isPickActivityVisible}
        onClose={() => setIsPickActivityVisible(false)}
        onActivitySelected={handleActivitySelected}
        pickButtonText={selectedTag ? "Change" : "Choose"}
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
  priority,
}: {
  Icon: React.FC<SvgProps>;
  text: string;
  color: string;
  marginBottomIcon?: number;
  onPress?: () => void;
  priority?: priorityEnum;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.changeActivityButton} onPress={onPress}>
      {text.startsWith("Priority") ? (
        priority === priorityEnum.none ? (
          <FlagHollow
            width={16}
            height={16}
            fill={color}
            style={{
              marginBottom: marginBottomIcon,
            }}
          />
        ) : (
          <FlagFull
            width={16}
            height={16}
            fill={color}
            style={{
              marginBottom: marginBottomIcon,
            }}
          />
        )
      ) : (
        <Icon
          width={16}
          height={16}
          fill={color}
          style={{
            marginBottom: marginBottomIcon,
          }}
        />
      )}
      {text && (
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
      )}
    </TouchableOpacity>
  );
}
