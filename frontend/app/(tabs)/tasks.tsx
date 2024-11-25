import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TaskBottomSheet from "@components/tasks/addTaskBottomSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import useStyles from "./styles/tasksStyles";

export default function TasksScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null); // Correct ref type for BottomSheet
  const styles = useStyles();

  const [title, setTitle] = useState(""); // State for task title
  const [description, setDescription] = useState(""); // State for task description

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0); // Properly trigger bottom sheet open
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={openBottomSheet}>
          <Text>Add Task</Text>
        </TouchableOpacity>
      </View>
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
