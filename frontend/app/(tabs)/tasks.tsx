import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Touchable,
  FlatList,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TaskBottomSheetAdd from "@/components/tasks/addTask/addTaskBottomSheet";
import { TaskBottomSheet } from "@/components/tasks/taskBottomSheet/taskBottomSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import useStyles from "./styles/tasksStyles";
import Header from "@/components/header/headerBasic/header";
import Plus from "@/assets/icons/plus.svg";
import { useTheme } from "@/context/ThemeContext";
import TaskListComponent from "@/components/tasks/taskListComponent/taskListComponent";
import AddTaskSheet from "@/components/tasks/addTask/addTaskBottomSheet";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema, tasks } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, and, gte, lt } from "drizzle-orm";
import { useTaskContext } from "@/context/TaskContext";
import { priorityEnum, type TaskData } from "@/constants/interfaces";

type TaskGroup = {
  type: "date";
  title: string;
  tasks: TaskData[];
  date: number;
};

type OverdueGroup = {
  type: "overdue";
  title: string;
  tasks: TaskData[];
  onReschedule: () => void;
};

function formatDateTitle(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const dayInMs = 24 * 60 * 60 * 1000;
  const todayStart = new Date(today).setHours(0, 0, 0, 0);
  const dateStart = new Date(date).setHours(0, 0, 0, 0);
  const diff = dateStart - todayStart;

  if (diff === 0) {
    return "Today";
  }
  if (diff === dayInMs) {
    return "Tomorrow";
  }
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  };
  return date.toLocaleDateString("en-GB", options);
}

export default function TasksScreen() {
  const taskSheetRef = useRef<BottomSheet>(null);
  const addSheetRef = useRef<BottomSheet>(null);
  const styles = useStyles();
  const { theme } = useTheme();
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { parseTask } = useTaskContext();

  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  const openTaskBottomSheet = (task: TaskData) => {
    setSelectedTask(task);
    taskSheetRef.current?.snapToIndex(0);
  };

  const openAddBottomSheet = () => {
    addSheetRef.current?.snapToIndex(0);
  };

  // Get today's start and end timestamps
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  // Query all non-deleted tasks
  const taskResults = useLiveQuery(
    db.select().from(tasks).where(eq(tasks.deleted, false)),
    [],
  ).data;

  const allTasks = taskResults
    ?.map((result) => parseTask([result]))
    .filter(Boolean) as TaskData[];

  // Group tasks by date
  const taskGroups = allTasks.reduce(
    (groups, task) => {
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);
      const dateKey = taskDate.getTime();

      // Skip overdue tasks in the regular groups
      if (dateKey < todayStart) {
        return groups;
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
      return groups;
    },
    {} as Record<number, TaskData[]>,
  );

  // Get overdue tasks
  const overdueTasks = allTasks.filter((task) => task.date < todayStart);

  // Sort task groups by date
  const sortedGroups = Object.entries(taskGroups)
    .sort(([dateA], [dateB]) => Number(dateA) - Number(dateB))
    .map(([date, tasks]) => ({
      type: "date" as const,
      title: formatDateTitle(Number(date)),
      tasks,
      date: Number(date),
    }));

  // Prepare data for FlatList
  const listData: (TaskGroup | OverdueGroup)[] = [
    ...(overdueTasks.length > 0
      ? [
          {
            type: "overdue" as const,
            title: "Overdue",
            tasks: overdueTasks,
            onReschedule: () => {
              // TODO: Implement reschedule functionality
            },
          },
        ]
      : []),
    ...sortedGroups,
  ];
  const dummyTask: TaskData = {
    id: 0,
    title: "Dummy",
    description: "",
    date: 0,
    priority: priorityEnum.none,
    completed: false,
    synced: false,
    deleted: false,
    tagId: "",
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
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <TaskListComponent
              title={item.title}
              tasks={item.tasks}
              onReschedule={
                item.type === "overdue" ? item.onReschedule : undefined
              }
              onTaskPress={openTaskBottomSheet}
            />
          )}
          keyExtractor={(item) =>
            item.type === "overdue" ? "overdue" : item.date.toString()
          }
          contentContainerStyle={{ overflow: "visible" }}
          ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
        />
      </TouchableOpacity>
      <TaskBottomSheet
        bottomSheetRef={taskSheetRef}
        task={selectedTask ?? dummyTask}
      />
      {/* {selectedTask && ( */}
      {/* )} */}
      <AddTaskSheet bottomSheetRef={addSheetRef} />
    </GestureHandlerRootView>
  );
}
