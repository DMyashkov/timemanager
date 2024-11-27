import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Task from "@components/tasks/task/task";

interface TaskProps {
  title: string;
  description: string;
  date: Date;
  projectName: string;
  activityName: string;
}

export default function TaskListComponent({
  rescheduleOption = true,
  date,
  tasks = [],
}: {
  rescheduleOption?: boolean;
  date?: Date;
  tasks: TaskProps[];
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.date}>Overdue</Text>
          <Text style={styles.amount}>1</Text>
        </View>
        <Text
          style={[
            styles.rightText,
            {
              color: rescheduleOption ? theme.color.darkRed : theme.color.black,
            },
          ]}
        >
          Reschedule
        </Text>
      </View>
      <Task
        title="Take a pic"
        description="Take a picture of the sunset"
        date={new Date(new Date().setDate(new Date().getDate() - 1))}
        projectName="Homework 1"
        activityName="Photography"
      />
    </View>
  );
}
