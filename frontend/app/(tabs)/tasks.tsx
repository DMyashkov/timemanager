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
import PickDateCalendar from "@/components/calendar/pickDateCalendar/pickDateCalendar";
import { DateStruct } from "@/utils/dateTimeSession";

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

type NoDateGroup = {
  type: "noDate";
  title: string;
  tasks: TaskData[];
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
  const { parseTask, updateTask, deleteTask } = useTaskContext();

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(db, taskId);
      // Refresh the task list by triggering a re-render
      // The useLiveQuery hook will automatically update the list
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const [rescheduleDate, setRescheduleDate] = useState<number | null>(null);
  const calendarSheetRef = useRef<BottomSheet>(null);
  const openCalendarSheet = () => {
    calendarSheetRef.current?.snapToIndex(0);
  };
  const handleRescheduleDateChange = (date: DateStruct | null) => {
    if (!date) return;
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    selectedDate.setHours(23, 59, 0, 0);
    const newDate = selectedDate.getTime();
    setRescheduleDate(newDate);

    // Update all overdue tasks with the new date
    if (overdueTasks.length > 0) {
      overdueTasks.forEach(async (task) => {
        if (task.id) {
          try {
            await updateTask(db, task.id, { date: newDate });
          } catch (error) {
            console.error("Error rescheduling task:", error);
          }
        }
      });
    }

    setRescheduleDate(null);
    calendarSheetRef.current?.close();
  };

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
    db.select().from(tasks).where(eq(tasks.deleted, 0)),
    [],
  ).data;

  const allTasks = taskResults
    ?.map((result) => parseTask([result]))
    .filter(Boolean) as TaskData[];

  // Group tasks by date
  const taskGroups = allTasks.reduce(
    (groups, task) => {
      if (!task.date) {
        if (!groups.noDate) {
          groups.noDate = [];
        }
        groups.noDate.push(task);
        return groups;
      }

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
    {} as Record<number | "noDate", TaskData[]>,
  );

  // Get overdue tasks
  const overdueTasks = allTasks.filter(
    (task) => task.date && task.date < todayStart,
  );

  // Sort task groups by date
  const sortedGroups = Object.entries(taskGroups)
    .filter(([key]) => key !== "noDate")
    .sort(([dateA], [dateB]) => Number(dateA) - Number(dateB))
    .map(([date, tasks]) => ({
      type: "date" as const,
      title: formatDateTitle(Number(date)),
      tasks,
      date: Number(date),
    }));

  // Prepare data for FlatList
  const listData: (TaskGroup | OverdueGroup | NoDateGroup)[] = [
    ...(overdueTasks.length > 0
      ? [
          {
            type: "overdue" as const,
            title: "Overdue",
            tasks: overdueTasks,
            onReschedule: () => {
              openCalendarSheet();
            },
          },
        ]
      : []),
    ...sortedGroups.filter((group) => group.title === "Today"),
    ...(taskGroups.noDate
      ? [
          {
            type: "noDate" as const,
            title: "No Date",
            tasks: taskGroups.noDate,
          },
        ]
      : []),
    ...sortedGroups.filter((group) => group.title !== "Today"),
  ];
  const dummyTask: TaskData = {
    id: 0,
    title: "Dummy",
    description: "",
    date: 0,
    priority: priorityEnum.none,
    completed: false,
    synced: 0,
    deleted: 0,
    tagId: -1,
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
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={listData}
          renderItem={({ item }) => (
            <TaskListComponent
              title={item.title}
              tasks={item.tasks}
              onReschedule={
                item.type === "overdue" ? item.onReschedule : undefined
              }
              showDateNextToTasks={item.type === "overdue"}
              onTaskPress={openTaskBottomSheet}
            />
          )}
          keyExtractor={(item) =>
            item.type === "overdue"
              ? "overdue"
              : item.type === "noDate"
                ? "noDate"
                : item.date.toString()
          }
          ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
        />
      </TouchableOpacity>
      <TaskBottomSheet
        bottomSheetRef={taskSheetRef}
        task={selectedTask ?? dummyTask}
        onTaskDelete={handleDeleteTask}
      />
      {/* {selectedTask && ( */}
      {/* )} */}
      <AddTaskSheet bottomSheetRef={addSheetRef} />
      <PickDateCalendar
        bottomSheetRef={calendarSheetRef}
        onPickDate={handleRescheduleDateChange}
      />
    </GestureHandlerRootView>
  );
}
