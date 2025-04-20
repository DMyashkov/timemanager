import React from "react";
import { View, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SessionElement from "../session/session";
import { FlatList } from "react-native-gesture-handler";
import { useRelevantSessions } from "@/hooks/useRelevantSessions";
import {
  Session,
  Interval,
  DateTime,
  Time,
  IntervalType,
  DateStruct,
} from "@/utils/dateTimeSession";
import { SessionData } from "@/constants/interfaces";
import { useFocusedDate } from "@/context/focusedDateContext";

export default function SessionList({
  style = {},
  sessions,
}: {
  style?: object;
  sessions: Session[];
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  console.log(sessions);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        style={styles.outer}
        data={sessions}
        renderItem={({ item }) => <SessionElement session={item} />}
        keyExtractor={(item, index) => `session-${index}-${item.getTagId()}`}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}
