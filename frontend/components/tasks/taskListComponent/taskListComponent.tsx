import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Task from "@components/tasks/task/task";
import type { TaskData } from "@/constants/interfaces";

function formatDate(timestamp: number): string {
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
  if (diff === -dayInMs) {
    return "Yesterday";
  }
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  };
  return date.toLocaleDateString("en-GB", options);
}

export default function TaskListComponent({
  title,
  tasks,
  onReschedule,
  onTaskPress,
}: {
  title: string;
  tasks: TaskData[];
  onReschedule?: () => void;
  onTaskPress: (task: TaskData) => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const TaskSeparator = () => <View style={{ height: 12 }} />;

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.date}>{title}</Text>
          <Text style={styles.amount}>{tasks.length}</Text>
        </View>
        {onReschedule && (
          <TouchableOpacity activeOpacity={0.2} onPress={onReschedule}>
            <Text
              style={[
                styles.rightText,
                {
                  color: theme.color.darkRed,
                },
              ]}
            >
              Reschedule
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Task
            task={item}
            showDateIfPassed={false}
            onPress={() => onTaskPress(item)}
          />
        )}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        ItemSeparatorComponent={TaskSeparator}
        contentContainerStyle={{ paddingVertical: 12, overflow: "visible" }}
        style={{ overflow: "visible" }}
      />
    </TouchableOpacity>
  );
}
