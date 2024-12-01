import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@interfaces";
import type { Session } from "@/utils/dateTimeSession";
import { dataIndex } from "@/constants/exampleData";
import { TagsFromId } from "@/utils/getComponentsFromTag";
import type { ActivityData } from "@interfaces";

export default function SessionElement({
  style = {},
  session,
}: {
  style?: object;
  session: Session;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  const activityItem: ActivityData | null =
    session.getAssociatedActivityItem(dataIndex);

  const colorPallete: Color = activityItem
    ? theme.color.presets[activityItem.colorPreset]
    : theme.color.presets.green;

  return (
    <View style={styles.outer}>
      <Text>Session</Text>
      <View style={styles.tagContainer}>
        {activityItem && (
          <TagsFromId
            tagId={activityItem.id}
            desiredHeight={29}
            fontSize={theme.fontSize.small}
          />
        )}
      </View>
    </View>
  );
}
