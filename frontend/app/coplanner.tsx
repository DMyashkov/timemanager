import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  SafeAreaView,
  FlatList,
  SectionList,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useRouter } from "expo-router";
import { act, useEffect, useRef, useState } from "react";
import MicrophoneIcon from "@assets/icons/microphone.svg";
import SendIcon from "@assets/icons/arrow-up.svg";
import ResetIcon from "@assets/icons/arrow-rotate-left.svg";
import BrainIcon from "@assets/icons/brain.svg";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  useSharedValue,
  Easing,
  withSpring,
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import PlusIcon from "@assets/icons/plus.svg";
import Task from "@/components/tasks/task/task";
import Tag from "@/components/tag/tagComponent";
import {
  priorityEnum,
  TaskData,
  TagData,
  ColorPresets,
  moduleTypeEnum,
} from "@/constants/interfaces";
import CheckIcon from "@assets/icons/check.svg";
import PathPicker from "@/components/form/pathPicker/pathPicker";
import { useDerivedTags } from "@/hooks/useDerivedTags";
import StopwatchIcon from "@assets/icons/stopwatch.svg";

const suggestions = [
  {
    context: "On Saturday I need to",
    task: "Plan my weekend workout routine and meal prep",
  },
  {
    context: "For my project I should",
    task: "Create a timeline for the next sprint and assign tasks",
  },
  {
    context: "This week I want to",
    task: "Learn a new language and build a small project",
  },
  {
    context: "In the morning I need to",
    task: "Review my emails and prepare for the team meeting",
  },
  {
    context: "Before the deadline I should",
    task: "Complete the documentation and run final tests",
  },
];

// Example data for tasks
const exampleTasks: (TaskData & { selected?: boolean })[] = [
  {
    id: 1,
    title: "Review project documentation",
    description: "Go through the latest updates",
    priority: priorityEnum.medium,
    date: new Date().getTime(),
    completed: 0,
    synced: 0,
    deleted: 0,
    tagId: null,
    selected: true,
  },
  {
    id: 2,
    title: "Team standup meeting",
    description: "Daily sync with the team",
    priority: priorityEnum.high,
    date: new Date().getTime(),
    completed: 0,
    synced: 0,
    deleted: 0,
    tagId: null,
    selected: true,
  },
  {
    id: 3,
    title: "Code review",
    description: "Review PRs from the team",
    priority: priorityEnum.low,
    date: new Date().getTime(),
    completed: 0,
    synced: 0,
    deleted: 0,
    tagId: null,
    selected: true,
  },
];

// Example data for tags
const exampleTags: TagData[] = [
  {
    id: 1,
    title: "Work",
    colorPreset: ColorPresets.GREEN,
    moduleType: moduleTypeEnum.activity,
    productive: true,
    lapName: "Work",
    children: [],
    parent: null,
    deleted: 0,
    synced: 0,
  },
  {
    id: 2,
    title: "Personal",
    colorPreset: ColorPresets.ORANGE,
    moduleType: moduleTypeEnum.activity,
    productive: true,
    lapName: "Personal",
    children: [],
    parent: null,
    deleted: 0,
    synced: 0,
  },
  {
    id: 3,
    title: "Project X",
    colorPreset: ColorPresets.GREEN,
    moduleType: moduleTypeEnum.project,
    productive: true,
    lapName: "Project X",
    children: [],
    parent: null,
    deleted: 0,
    synced: 0,
  },
  {
    id: 4,
    title: "New Tag 1",
    colorPreset: ColorPresets.GREEN,
    moduleType: moduleTypeEnum.activity,
    productive: true,
    lapName: "New Tag 1",
    children: [],
    parent: 19827386,
    deleted: 0,
    synced: 0,
  },
  {
    id: 5,
    title: "New Tag 2",
    colorPreset: ColorPresets.ORANGE,
    moduleType: moduleTypeEnum.activity,
    productive: true,
    lapName: "New Tag 2",
    children: [],
    parent: 19827385,
    deleted: 0,
    synced: 0,
  },
];

interface SectionItem {
  type: "tasks" | "tags" | "focus";
  title: string;
  data:
    | (TaskData & { selected?: boolean })[]
    | (TagData & { selected?: boolean })[]
    | { selected?: boolean }[];
}

interface CoplannerProps {
  visible: boolean;
  onClose: () => void;
}

interface SelectButtonProps {
  isSelected: boolean;
  onPress: () => void;
}

const SelectButton = ({ isSelected, onPress }: SelectButtonProps) => {
  const { theme } = useTheme();
  const buttonAnim = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    buttonAnim.value = withTiming(isSelected ? 1 : 0, { duration: 300 });
  }, [isSelected]);

  const buttonAnimStyles = {
    selectedButton: useAnimatedStyle(() => ({
      opacity: buttonAnim.value,
      position: "absolute",
      width: "100%",
      transform: [{ scale: 0.8 + buttonAnim.value * 0.2 }],
    })),
    unselectedButton: useAnimatedStyle(() => ({
      opacity: 1 - buttonAnim.value,
      position: "absolute",
      width: "100%",
      transform: [{ scale: 1 - buttonAnim.value * 0.2 }],
    })),
  };

  const buttonStyles = StyleSheet.create({
    addButton: {
      width: 25,
      marginLeft: 10,
      aspectRatio: 1,
    },
    selectButton: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 18,
      aspectRatio: 1,
      flex: 1,
    },
  });

  return (
    <TouchableOpacity
      style={buttonStyles.addButton}
      onPress={onPress}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          buttonStyles.selectButton,
          buttonAnimStyles.selectedButton,
          {
            backgroundColor: "#31bb3b",
            borderColor: "#31bb3b",
          },
        ]}
      >
        <CheckIcon height={13} width={16} fill={theme.color.white} />
      </Animated.View>
      <Animated.View
        style={[
          buttonStyles.selectButton,
          buttonAnimStyles.unselectedButton,
          {
            borderColor: theme.color.black,
            borderWidth: 2,
          },
        ]}
      >
        <PlusIcon height={16} width={20} fill={theme.color.black} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function Coplanner({ visible, onClose }: CoplannerProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [tasks, setTasks] =
    useState<(TaskData & { selected?: boolean })[]>(exampleTasks);
  const [tags, setTags] = useState<(TagData & { selected?: boolean })[]>(
    exampleTags.slice(3).map((tag) => ({ ...tag, selected: false })),
  );
  const [focusSessions, setFocusSessions] = useState<{ selected?: boolean }[]>([
    { selected: false },
  ]);
  const { activityNode, projectNode } = useDerivedTags(19827382);
  const textInputRef = useRef<TextInput>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const borderRadius = useSharedValue(0.5);
  const perspective = useSharedValue(1000);

  // Add new shared values for button animations
  const buttonAnim = useSharedValue(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // Small delay to ensure the modal is fully rendered before focusing
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Start continuous clockwise rotation
      rotation.value = withRepeat(
        withTiming(360, { duration: 20000, easing: Easing.linear }),
        -1,
        false,
      );

      // Constant scale animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.9, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      );

      // Constant opacity
      opacity.value = withTiming(1, { duration: 500 });
    }
  }, [visible, text]);

  const animatedBlobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleSuggestionPress = (suggestion: string) => {
    setText(suggestion);
    // Keep keyboard focused
    textInputRef.current?.focus();
  };

  const handleReset = () => {
    setText("");
  };

  const handleSend = () => {
    Keyboard.dismiss();
    setIsTransitioning(true);
    setThinkingStep(0);

    // Show "Thinking of names..." for 1 second
    setTimeout(() => {
      setThinkingStep(1);
      // Show "Building tasks and tags..." for 1 second
      setTimeout(() => {
        setShowResultScreen(true);
        setIsTransitioning(false);
      }, 1000);
    }, 1000);
  };

  const handleTryAgain = () => {
    setShowResultScreen(false);
    setText("");
    textInputRef.current?.focus();
  };

  const handleApplyChanges = () => {
    // TODO: Implement apply changes functionality
    console.log("Applying changes");
  };

  const handleTaskSelect = (taskId: number) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((t) =>
        t.id === taskId ? { ...t, selected: !t.selected } : t,
      );
      const isSelected = newTasks.find((t) => t.id === taskId)?.selected;

      // Animate the transition
      buttonAnim.value = withTiming(isSelected ? 1 : 0, { duration: 300 });

      return newTasks;
    });
  };

  const handleTagSelect = (tagId: number) => {
    setTags((prevTags) => {
      const newTags = prevTags.map((t) =>
        t.id === tagId ? { ...t, selected: !t.selected } : t,
      );
      return newTags;
    });
  };

  const handleFocusSelect = (index: number) => {
    setFocusSessions((prevSessions) => {
      const newSessions = [...prevSessions];
      newSessions[index] = {
        ...newSessions[index],
        selected: !newSessions[index].selected,
      };
      return newSessions;
    });
  };

  const buttonAnimStyles = {
    selectedButton: useAnimatedStyle(() => ({
      opacity: buttonAnim.value,
      position: "absolute",
      width: "100%",
      transform: [{ scale: 0.8 + buttonAnim.value * 0.2 }],
    })),
    unselectedButton: useAnimatedStyle(() => ({
      opacity: 1 - buttonAnim.value,
      position: "absolute",
      width: "100%",
      transform: [{ scale: 1 - buttonAnim.value * 0.2 }],
    })),
  };

  const SUGGESTION_HEIGHT = 85;
  const SUGGESTION_WIDTH = screenWidth * 0.7;

  const BACKGROUND_FOR_SUGGESTIONS = "#F6F5F3";

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    contentContainer: {
      flex: 1,
      padding: 15,
      paddingBottom: Platform.OS === "ios" ? 60 : 40,
      justifyContent: "flex-end",
    },
    suggestionsWrapper: {
      height: SUGGESTION_HEIGHT,
      marginBottom: 20,
    },
    suggestionsContainer: {
      height: SUGGESTION_HEIGHT,
    },
    suggestionItem: {
      width: SUGGESTION_WIDTH,
      height: SUGGESTION_HEIGHT,
      paddingHorizontal: 15,
      marginRight: 10,
      backgroundColor: BACKGROUND_FOR_SUGGESTIONS,
      borderRadius: 8,
      justifyContent: "flex-start",
      padding: 10,
    },
    suggestionText: {
      color: theme.color.black,
      fontSize: theme.fontSize.medium,
      flexWrap: "wrap",
      textAlign: "left",
    },
    suggestionContext: {
      fontFamily: theme.font.semibold,
      marginBottom: 4,
    },
    suggestionTask: {
      fontFamily: theme.font.regular,
      color: theme.color.darkGrey,
    },
    inputContainer: {
      borderRadius: 12,
      padding: 15,
      paddingVertical: 8,
      paddingBottom: 12,
      marginBottom: 30,
      backgroundColor: BACKGROUND_FOR_SUGGESTIONS,
      minHeight: 100,
    },
    textInput: {
      color: theme.color.black,
      fontSize: theme.fontSize.medium,
      textAlignVertical: "top",
      fontFamily: theme.font.regular,
      lineHeight: 22,
      paddingBottom: 10,
    },
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 10,
    },
    button: {
      backgroundColor: theme.color.black,
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonIcon: {
      opacity: 1,
    },
    animatedBlobWrapper: {
      position: "absolute",
      width: screenWidth * 0.4,
      height: screenWidth * 0.4,
      alignSelf: "center",
      top: keyboardHeight > 0 ? screenHeight * 0.1 : screenHeight * 0.3,
    },
    animatedBlob: {
      width: "100%",
      height: "100%",
      borderRadius: (screenWidth * 0.4) / 2,
      overflow: "hidden",
      borderWidth: 5,
      borderColor: theme.color.lightGrey,
    },
    gradient: {
      width: "100%",
      height: "100%",
    },
    resultContainer: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    promptHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: theme.color.white,
      borderRadius: 12,
      margin: 15,
      shadowColor: theme.color.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    emoji: {
      fontSize: 24,
    },
    promptText: {
      flex: 1,
      marginLeft: 10,
      fontSize: theme.fontSize.medium,
      color: theme.color.black,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      position: "absolute",
      bottom: 50,
      left: 0,
      right: 0,
      backgroundColor: theme.color.red,
      zIndex: 3,
    },
    smallButton: {
      flex: 1,
      height: 50,
      backgroundColor: theme.color.lightGrey,
      borderRadius: 34,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      borderColor: theme.color.darkGrey,
    },
    largeButton: {
      flex: 3,
      height: 50,
      backgroundColor: theme.color.black,
      borderRadius: 34,
      justifyContent: "space-between",
      paddingHorizontal: 20,
      alignItems: "center",
      flexDirection: "row",
    },
    buttonText: {
      color: theme.color.white,
      fontSize: theme.fontSize.medium,
      fontFamily: theme.font.semibold,
      marginRight: 8,
    },
    thinkingContainer: {
      position: "absolute",
      top:
        keyboardHeight > 0 ? screenHeight * 0.1 - 100 : screenHeight * 0.3 - 60,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    thinkingText: {
      fontSize: theme.fontSize.mediumBig,
      color: theme.color.black,
      fontFamily: theme.font.semibold,
      textAlign: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    handleContainer: {
      width: "100%",
      alignItems: "center",
      paddingTop: 10 + (Platform.OS === "ios" ? 0 : 8),
    },
    handle: {
      width: 36,
      height: 5,
      backgroundColor: theme.color.darkGrey,
      borderRadius: 2.5,
      marginBottom: Platform.OS === "ios" ? 0 : 8,
    },
    section: {
      paddingHorizontal: 15,
      marginBottom: 8,
    },
    sectionTitleContainer: {
      backgroundColor: theme.color.white,
      paddingVertical: 10,
      position: "sticky",
      top: 0,
      zIndex: 1,
      marginHorizontal: -15,
      paddingHorizontal: 30,
    },
    sectionTitle: {
      fontSize: theme.fontSize.mediumBig,
      fontFamily: theme.font.semibold,
      color: theme.color.black,
    },
    taskRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      justifyContent: "space-between",
    },
    addButton: {
      width: 36,
      marginLeft: 10,
      aspectRatio: 1,
    },
    addButtonCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.color.white,
      borderWidth: 2,
      borderColor: theme.color.darkGrey,
      justifyContent: "center",
      alignItems: "center",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    selectButton: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 18,
      aspectRatio: 1,
      flex: 1,
    },
    coverView: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: -400,
      backgroundColor: theme.color.white,
      zIndex: -1,
    },
    focusSessionContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: theme.color.white,
      borderRadius: 8,
      padding: 12,
      ...theme.shadow,
    },
    tagsScrollView: {
      flex: 1,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {!showResultScreen ? (
            <>
              {(text.length > 0 || isTransitioning) && (
                <Animated.View
                  style={[styles.animatedBlobWrapper]}
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <Animated.View
                    style={[styles.animatedBlob, animatedBlobStyle]}
                  >
                    <LinearGradient
                      colors={[theme.color.darkRed, theme.color.lightRed]}
                      style={styles.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  </Animated.View>
                </Animated.View>
              )}
              {isTransitioning && (
                <View style={styles.thinkingContainer}>
                  <Text style={styles.thinkingText}>
                    {thinkingStep === 0
                      ? "Thinking of names..."
                      : "Building tasks and tags..."}
                  </Text>
                </View>
              )}
              {!isTransitioning && (
                <View style={styles.contentContainer}>
                  <View style={styles.suggestionsWrapper}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.suggestionsContainer}
                    >
                      {suggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() =>
                            handleSuggestionPress(
                              `${suggestion.context} ${suggestion.task}`,
                            )
                          }
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.suggestionText,
                              styles.suggestionContext,
                            ]}
                          >
                            {suggestion.context}
                          </Text>
                          <Text
                            style={[
                              styles.suggestionText,
                              styles.suggestionTask,
                            ]}
                          >
                            {suggestion.task}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={textInputRef}
                      style={styles.textInput}
                      multiline
                      value={text}
                      onChangeText={setText}
                      placeholder="Type or speak your task..."
                      placeholderTextColor={theme.color.darkGrey}
                      blurOnSubmit={false}
                      returnKeyType="none"
                    />
                    <View style={styles.buttonsRow}>
                      {text ? (
                        <>
                          <TouchableOpacity
                            style={[
                              styles.button,
                              { backgroundColor: "#E5E0DA" },
                            ]}
                            onPress={handleReset}
                          >
                            <ResetIcon
                              height={20}
                              width={20}
                              fill={theme.color.black}
                              style={styles.buttonIcon}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={handleSend}
                          >
                            <SendIcon
                              height={20}
                              width={20}
                              fill={theme.color.white}
                              style={styles.buttonIcon}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => setIsRecording(!isRecording)}
                        >
                          <MicrophoneIcon
                            height={20}
                            width={20}
                            fill={theme.color.white}
                            style={styles.buttonIcon}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.resultContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.emoji}>🧠</Text>
                <Text style={styles.promptText}>{text}</Text>
              </View>
              <SectionList<SectionItem["data"][number]>
                sections={[
                  {
                    type: "focus",
                    title: "Start focus session",
                    data: focusSessions,
                  },
                  {
                    type: "tasks",
                    title: "Pick tasks for your schedule",
                    data: tasks,
                  },
                  {
                    type: "tags",
                    title: "Pick tags for your workplace",
                    data: tags,
                  },
                ]}
                keyExtractor={(item, index) => {
                  if ("id" in item) {
                    return item.id?.toString() ?? `item-${index}`;
                  }
                  return `item-${index}`;
                }}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={[styles.sectionTitleContainer]}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                  </View>
                )}
                renderItem={({ item, section, index }) => {
                  if (section.type === "tasks") {
                    const taskItem = item as TaskData & { selected?: boolean };
                    return (
                      <View style={styles.taskRow}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <Task task={taskItem} completable={false} />
                        </View>
                        <SelectButton
                          isSelected={taskItem.selected ?? false}
                          onPress={() =>
                            taskItem.id && handleTaskSelect(taskItem.id)
                          }
                        />
                      </View>
                    );
                  } else if (section.type === "tags") {
                    const tagItem = item as TagData & { selected?: boolean };
                    return (
                      <View style={styles.taskRow}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <PathPicker
                            withShadow={true}
                            pathHeaderFlag={false}
                            key={tagItem.id}
                            parent={tagItem.parent}
                            setParent={() => {}}
                            shouldDisplayNew={true}
                            moduleColorPallete={tagItem.colorPreset}
                            moduleName={tagItem.title}
                            isProject={
                              tagItem.moduleType === moduleTypeEnum.project
                            }
                          />
                        </View>
                        <SelectButton
                          isSelected={tagItem.selected ?? false}
                          onPress={() =>
                            tagItem.id && handleTagSelect(tagItem.id)
                          }
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View style={styles.taskRow}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <View style={styles.focusSessionContainer}>
                            <StopwatchIcon
                              height={28}
                              width={28}
                              fill={
                                theme.color.presets[
                                  activityNode?.colorPreset ?? "grey"
                                ].light
                              }
                            />
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              style={styles.tagsScrollView}
                            >
                              {activityNode && (
                                <Tag
                                  text={activityNode.title}
                                  isProject={
                                    activityNode.moduleType ===
                                    moduleTypeEnum.project
                                  }
                                  colorPallete={
                                    theme.color.presets[
                                      activityNode.colorPreset
                                    ]
                                  }
                                  style={{ marginRight: 10 }}
                                />
                              )}
                              {projectNode && (
                                <Tag
                                  text={projectNode.title}
                                  isProject={
                                    projectNode.moduleType ===
                                    moduleTypeEnum.project
                                  }
                                  colorPallete={
                                    theme.color.presets[projectNode.colorPreset]
                                  }
                                  style={{ marginRight: 10 }}
                                />
                              )}
                            </ScrollView>
                          </View>
                        </View>
                        <SelectButton
                          isSelected={item.selected ?? false}
                          onPress={() => handleFocusSelect(index)}
                        />
                      </View>
                    );
                  }
                }}
                contentContainerStyle={{
                  paddingBottom: 200,
                  paddingHorizontal: 15,
                }}
                SectionSeparatorComponent={() => (
                  <View style={styles.section} />
                )}
              />

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={handleTryAgain}
                >
                  <ResetIcon height={24} width={24} fill={theme.color.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.largeButton}
                  onPress={handleApplyChanges}
                >
                  <Text style={styles.buttonText}>Apply changes (3)</Text>
                  <SendIcon height={20} width={20} fill={theme.color.white} />
                </TouchableOpacity>
                <View style={styles.coverView} />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
