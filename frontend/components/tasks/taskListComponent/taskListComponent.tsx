import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Task from "@components/tasks/task/task";

import type { TaskData } from "@constants/interfaces";

export default function TaskListComponent({
  overdueOption = false,
  date,
  tasks = [],
}: {
  overdueOption?: boolean;
  date?: Date;
  tasks: TaskData[];
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const handleReschedule = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.date}>
            {overdueOption ? "Overdue" : "10 Sep • Tuesday"}
          </Text>
          <Text style={styles.amount}>1</Text>
        </View>
        <TouchableOpacity
          activeOpacity={overdueOption ? 0.2 : 1}
          onPress={() => {
            if (overdueOption) {
              handleReschedule();
            }
          }}
        >
          <Text
            style={[
              styles.rightText,
              {
                color: overdueOption ? theme.color.darkRed : theme.color.black,
              },
            ]}
          >
            {overdueOption ? "Reschedule" : "Today"}
          </Text>
        </TouchableOpacity>
      </View>
      <Task
        title="Take a pic"
        description="Take a picture of the sunset"
        date={new Date(new Date().setDate(new Date().getDate() - 1))}
        projectId="Homework 1"
        activityId="Photography"
        priority={1}
      />
      <Task
        title="Take a pic"
        description="Take a picture of the sunset"
        date={new Date(new Date().setDate(new Date().getDate() - 1))}
        projectId="Homework 1"
        activityId="Photography"
        priority={1}
      />

      <FlatList
        data={tasks}
        renderItem={({ item }) => <Task {...item} showDateIfPassed={true} />}
      />
    </View>
  );
}
