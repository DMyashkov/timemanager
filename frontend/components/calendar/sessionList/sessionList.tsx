import React, { memo } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
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

const SessionList = memo(function SessionList({
  style = {},
  sessions,
}: {
  style?: object;
  sessions: Session[];
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const EmptyState = () => {
    const emptyStateStyles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      text: {
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
        color: theme.color.darkGrey,
      },
    });

    return (
      <View style={emptyStateStyles.container}>
        <Text style={emptyStateStyles.text}>No sessions recorded for this day</Text>
      </View>
    );
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Session }) => <SessionElement session={item} />,
    [],
  );

  const keyExtractor = React.useCallback(
    (item: Session, index: number) => `session-${index}-${item.getTagId()}`,
    [],
  );

  const ItemSeparator = React.useCallback(
    () => <View style={{ height: 20 }} />,
    [],
  );

  const ListHeader = React.useCallback(
    () => <View style={{ height: 10 }} />,
    [],
  );

  const ListFooter = React.useCallback(
    () => <View style={{ height: 10 }} />,
    [],
  );

  return (
    <View style={[styles.container, style]}>
      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          style={styles.outer}
          data={sessions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
});

export default SessionList;
