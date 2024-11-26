import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import Calendar from "@/assets/icons/calendar.svg";
import Tag from "@/components/tag/tagComponent";

export default function Task({ title }: { title: string }) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [checkMark, setCheckMark] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={styles.checkMark} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>
          This is the descriptioaossjasoksakasjkaskjsoasoassakasjska
        </Text>
        <View style={styles.footer}>
          <View style={styles.date}>
            <Calendar fill={theme.color.darkRed} height={14} width={14} />
            <Text style={styles.dateText}>Yesterday</Text>
          </View>
          <View style={styles.tagContainer}>
            <Tag text="Homework" isProject={true} desiredHeight={28} />
            <Tag text="Photography" desiredHeight={28} />
          </View>
        </View>
      </View>
    </View>
  );
}
