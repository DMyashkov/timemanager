import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import Calendar from "@/assets/icons/calendar.svg";
import Tag from "@/components/tag/tagComponent";

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
  severity = 1,
}: {
  title: string;
  description: string;
  date: Date;
  activityName?: string;
  projectName?: string;
  severity?: number;
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [checkMark, setCheckMark] = useState(false);
  const todayDate = new Date();

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={styles.checkMark} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.date}>
            <Calendar fill={theme.color.darkRed} height={14} width={14} />
            <Text style={styles.dateText}>{formatDate(date, todayDate)}</Text>
          </View>
          <View style={styles.tagContainer}>
            {projectName !== "" && (
              <Tag
                text={projectName}
                isProject={true}
                desiredHeight={28}
                textSize={theme.fontSize.smaller}
              />
            )}
            {activityName !== "" && (
              <Tag
                text={activityName}
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
