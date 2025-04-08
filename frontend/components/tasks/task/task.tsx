import { View, Text, TouchableOpacity, Touchable } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import Calendar from "@/assets/icons/calendar.svg";
import Tag from "@/components/tag/tagComponent";
import Checkmark from "@/assets/icons/checkmark.svg";
import { priorityEnum } from "@/constants/interfaces";
import { TaskData } from "@/constants/interfaces";

function formatDate(timestamp: number, today: Date): string {
  const date = new Date(timestamp);
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

interface TaskProps {
  task: TaskData;
  showDateIfPassed?: boolean;
  showDateAlways?: boolean;
  onPress?: () => void;
}

export default function Task({
  task,
  showDateIfPassed = true,
  showDateAlways = false,
  onPress,
}: TaskProps) {
  const styles = useStyles(task.priority);
  const { theme } = useTheme();
  const [checkMark, setCheckMark] = useState(false);
  const todayDate = new Date();

  let colorCheckmarkStyles: object;
  switch (task.priority) {
    case priorityEnum.low:
      colorCheckmarkStyles = {
        backgroundColor: theme.color.presets.blue.light,
        borderColor: theme.color.presets.blue.dark,
      };
      break;
    case priorityEnum.medium:
      colorCheckmarkStyles = {
        backgroundColor: theme.color.presets.yellow.light,
        borderColor: theme.color.presets.yellow.dark,
      };
      break;
    case priorityEnum.high:
      colorCheckmarkStyles = {
        backgroundColor: theme.color.veryLightRed,
        borderColor: theme.color.darkRed,
      };
      break;
    default:
      colorCheckmarkStyles = {
        borderColor: theme.color.darkerDarkGrey,
        backgroundColor: theme.color.warmGrey,
      };
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftColumn}>
        <TouchableOpacity
          onPress={() => {
            setCheckMark(!checkMark);
          }}
          activeOpacity={1}
        >
          {!checkMark ? (
            <View style={[styles.checkMark, colorCheckmarkStyles]} />
          ) : (
            <Checkmark fill={theme.color.darkGrey} height={22.3} width={22.3} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          {showDateAlways ||
            (showDateIfPassed && task.date < todayDate.getTime() && (
              <View style={styles.date}>
                <Text style={styles.dateText}>
                  {formatDate(task.date, todayDate)}
                </Text>
              </View>
            ))}
        </View>
        <Text style={styles.description} numberOfLines={1}>
          {task.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.tagContainer}>
            {task.activityId && (
              <Tag
                text={task.activityId.toString()}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
              />
            )}
            {task.projectId && (
              <Tag
                text={task.projectId.toString()}
                isProject={true}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
