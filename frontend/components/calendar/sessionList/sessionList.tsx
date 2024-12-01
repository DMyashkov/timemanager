import React from "react";
import { View, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SessionElement from "../session/session";
import { exampleSessions } from "@constants/exampleSessions";
import { FlatList } from "react-native-gesture-handler";

export default function SessionList({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <FlatList
        style={styles.outer}
        data={exampleSessions}
        renderItem={({ item }) => <SessionElement session={item} />}
        keyExtractor={(item) => item.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}
