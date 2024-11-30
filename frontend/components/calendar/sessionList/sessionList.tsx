import { View, Text, ScrollView } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SessionElement from "../session/session";

export default function SessionList({ style = {} }: { style?: object }) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.outer, style]}>
      <SessionElement />
    </ScrollView>
  );
}
