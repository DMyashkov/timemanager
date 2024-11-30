import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@interfaces";
import type { Session } from "@/utils/dateTimeSession";

export default function SessionElement({
  style = {},
  session,
}: {
  style?: object;
  session: Session;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.outer}>
      <Text>Session</Text>
    </View>
  );
}
