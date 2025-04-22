import { View, Text, TouchableOpacity, Touchable } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useCallback, useState } from "react";
import Calendar from "@/assets/icons/calendar.svg";
import Tag from "@/components/tag/tagComponent";
import Checkmark from "@/assets/icons/checkmark.svg";
import { priorityEnum } from "@/constants/interfaces";
import { TaskData } from "@/constants/interfaces";
import { useDerivedTags } from "@/hooks/useDerivedTags";
import { useTaskContext } from "@/context/TaskContext";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  completable?: boolean;
}

export default function Task({
  task,
  showDateIfPassed = true,
  showDateAlways = false,
  onPress,
  completable = true,
}: TaskProps) {
  const styles = useStyles(task.priority);
  const { theme } = useTheme();
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const todayDate = new Date();
  const { activityNode, projectNode } = useDerivedTags(
    task.tagId ? Number(task.tagId) : null,
  );
  const { updateTask } = useTaskContext();
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  const handleCheckmarkPress = useCallback(async () => {
    if (!task.id || !completable) return;

    const newCompletedState = !isCompleted ? 1 : 0;
    setIsCompleted(newCompletedState);

    try {
      await updateTask(db, task.id, { completed: newCompletedState });
    } catch (error) {
      console.error("Error updating task completion:", error);
      // Revert the state if the update fails
      setIsCompleted(isCompleted);
    }
  }, [task.id, isCompleted, updateTask, db, completable]);

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
      style={[styles.container, isCompleted === 1 && { opacity: 0.7 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftColumn}>
        <TouchableOpacity 
          onPress={handleCheckmarkPress} 
          activeOpacity={completable ? 1 : 0.5}
        >
          {!isCompleted ? (
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
            (showDateIfPassed &&
              task.date &&
              task.date < todayDate.getTime() && (
                <View style={styles.date}>
                  <Text style={styles.dateText}>
                    {formatDate(task.date, todayDate)}
                  </Text>
                </View>
              ))}
        </View>
        {task.description && (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        )}
        <View
          style={[
            styles.footer,
            {
              marginTop: activityNode || projectNode ? 0 : -5,
            },
          ]}
        >
          <View style={styles.tagContainer}>
            {activityNode && (
              <Tag
                text={activityNode.title}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
                colorPallete={theme.color.presets[activityNode.colorPreset]}
              />
            )}
            {projectNode && (
              <Tag
                text={projectNode.title}
                isProject={true}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
                colorPallete={theme.color.presets[projectNode.colorPreset]}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
