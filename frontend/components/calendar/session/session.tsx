import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@interfaces";
import type { Session, Time } from "@/utils/dateTimeSession";
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
  const workTime: Time = session.getWorkTime();
  const breakTime: Time = session.getBreakTime();

  const workTimeRatioPercentage: number = session.getWorkToTotalRatio() * 100;
  const roundedRatioPercentage: number = (() => {
    if (workTimeRatioPercentage >= 97 && workTimeRatioPercentage <= 100) {
      return workTimeRatioPercentage >= 98.5 ? 100 : 97;
    }
    if (workTimeRatioPercentage >= 0 && workTimeRatioPercentage <= 3) {
      return workTimeRatioPercentage <= 1.5 ? 0 : 3;
    }
    return workTimeRatioPercentage;
  })();
  console.log("roundedRatioPercentage", roundedRatioPercentage);

  return (
    <View style={styles.outer}>
      <View style={styles.header}>
        {roundedRatioPercentage !== 0 && (
          <View
            style={[
              styles.workTime,
              {
                width: `${roundedRatioPercentage}%`,
              },
              roundedRatioPercentage === 100 && {
                borderTopRightRadius: theme.borderRadius.large,
                borderRightWidth: 2.7,
              },
            ]}
          >
            <Text style={styles.workTimeText}>{workTime.toString()}</Text>
          </View>
        )}
        {roundedRatioPercentage !== 100 && (
          <View
            style={[
              styles.breakTime,
              roundedRatioPercentage === 0 && {
                borderTopLeftRadius: theme.borderRadius.large,
              },
            ]}
          >
            {/* Mask to hide the left border */}
            {roundedRatioPercentage !== 0 && <View style={styles.leftMask} />}
            <Text style={styles.breakTimeText}>{breakTime.toString()}</Text>
          </View>
        )}
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
