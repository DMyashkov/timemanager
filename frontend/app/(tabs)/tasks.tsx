import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Touchable,
} from "react-native";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import TaskBottomSheet from "@/components/tasks/addTask/addTaskBottomSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import useStyles from "./styles/tasksStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/header";
import Plus from "@/assets/icons/plus.svg";
import { useTheme } from "@/context/ThemeContext";
import Task from "@components/tasks/task/task";

export default function TasksScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet
  const styles = useStyles();
  const { theme } = useTheme();

  const [title, setTitle] = useState(""); // State for task title
  const [description, setDescription] = useState(""); // State for task description

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header
        title="Tasks"
        buttons={[
          {
            id: "plus",
            iconElement: (
              <Plus height={25} width={25} fill={theme.color.black} />
            ),
            onPress: openBottomSheet,
          },
        ]}
        showSearchBar={true}
      />
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => {
          Keyboard.dismiss();
        }}
        activeOpacity={1}
      >
        <Task
          title="Take a pic"
          description="Take a picture of the sunset"
          date={new Date(new Date().setDate(new Date().getDate() - 1))}
          projectName="Homework 1"
          activityName="Photography"
        />
      </TouchableOpacity>
      <TaskBottomSheet
        bottomSheetRef={bottomSheetRef}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
    </GestureHandlerRootView>
  );
}
