import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import Calendar from "@/assets/icons/calendar.svg";
import Tag from "@/components/tag/tagComponent";
import Checkmark from "@/assets/icons/checkmark.svg";

function formatDate(date: Date, today: Date): string {
  const dayInMs = 24 * 60 * 60 * 1000;
  const diff = date.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);

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
  return date.toLocaleDateString(undefined, options);
}

export default function Task({
  title,
  date,
  description,
  activityName = "",
  projectName = "",
  priority = 1,
  showDateIfPassed = true,
  showDateAlways = false,
}: {
  title: string;
  description: string;
  date: Date;
  activityName?: string;
  projectName?: string;
  priority?: number;
  showDateIfPassed?: boolean;
  showDateAlways?: boolean;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [checkMark, setCheckMark] = useState(false);
  const todayDate = new Date();

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <TouchableOpacity
          onPress={() => {
            setCheckMark(!checkMark);
          }}
        >
          {!checkMark ? (
            <View style={styles.checkMark} />
          ) : (
            <Checkmark fill={theme.color.darkGrey} height={22.3} width={22.3} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {showDateAlways ||
            (showDateIfPassed && date < todayDate && (
              <View style={styles.date}>
                <Text style={styles.dateText}>
                  {formatDate(date, todayDate)}
                </Text>
                {/* <Calendar fill={theme.color.darkRed} height={14} width={14} /> */}
              </View>
            ))}
        </View>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.tagContainer}>
            {activityName !== "" && (
              <Tag
                text={activityName}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
              />
            )}
            {projectName !== "" && (
              <Tag
                text={projectName}
                isProject={true}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
