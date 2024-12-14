import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Touchable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TaskBottomSheetAdd from "@/components/tasks/addTask/addTaskBottomSheet";
import TaskBottomSheet from "@/components/tasks/taskBottomSheet/taskBottomSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import useStyles from "./styles/tasksStyles";
import Header from "@/components/header/headerBasic/header";
import Plus from "@/assets/icons/plus.svg";
import { useTheme } from "@/context/ThemeContext";
import TaskListComponent from "@/components/tasks/taskListComponent/taskListComponent";
import AddTaskSheet from "@/components/tasks/addTask/addTaskBottomSheet";

export default function TasksScreen() {
  const taskSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet
  const addSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet
  const styles = useStyles();
  const { theme } = useTheme();

  const [title, setTitle] = useState(""); // State for task title
  const [description, setDescription] = useState("");

  const openTaskBottomSheet = () => {
    taskSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

  const openAddBottomSheet = () => {
    addSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
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
            onPress: openAddBottomSheet,
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
        <TaskListComponent tasks={[]} />
        <TaskListComponent />
      </TouchableOpacity>
      <TaskBottomSheet
        bottomSheetRef={taskSheetRef}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        checkMark={false}
        setCheckMark={() => {}}
        priority={1}
        tagId="project-1"
      />
      <AddTaskSheet bottomSheetRef={addSheetRef} />
    </GestureHandlerRootView>
  );
}
