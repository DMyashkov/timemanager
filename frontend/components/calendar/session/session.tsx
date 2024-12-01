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
  const { theme } = useTheme();
  const activityItem: ActivityData | null =
    session.getAssociatedActivityItem(dataIndex);
  const colorPallete: Color = activityItem
    ? theme.color.presets[activityItem.colorPreset]
    : theme.color.presets.green;
  const styles = useStyles(colorPallete);

  return (
    <View style={styles.outer}>
      <View style={styles.header}>
        <View
          style={[
            styles.workTime,
            {
              width: `${session.getWorkToTotalRatio() * 100}%`,
            },
          ]}
        />
        <View />
      </View>
      <View style={styles.content}>
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
    </View>
  );
}
