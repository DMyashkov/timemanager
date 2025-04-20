import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import type { Color } from "@interfaces";
import type { Session, Time } from "@/utils/dateTimeSession";
import { useDerivedTags } from "@/hooks/useDerivedTags";
import { memo } from "react";
import Tag from "@/components/tag/tagComponent";

const SessionElement = memo(function SessionElement({
  style = {},
  session,
}: {
  style?: object;
  session: Session;
}) {
  const { theme } = useTheme();
  const tagId = session.getTagId();
  const { activityNode, projectNode } = useDerivedTags(tagId);

  const colorPallete: Color =
    theme.color.presets[
      activityNode?.colorPreset ?? projectNode?.colorPreset ?? "grey"
    ];
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

  return (
    <View style={[styles.outer, style]}>
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
            {roundedRatioPercentage !== 0 && <View style={styles.leftMask} />}
            <Text style={styles.breakTimeText}>{breakTime.toString()}</Text>
          </View>
        )}
      </View>
      <View
        style={[
          styles.content,
          {
            paddingTop: activityNode || projectNode ? 14 : 2,
          },
        ]}
      >
        {(activityNode || projectNode) && (
          <View style={styles.tagContainer}>
            {activityNode && (
              <Tag
                text={activityNode.title}
                colorPallete={colorPallete}
                desiredHeight={29}
                textSize={theme.fontSize.small}
              />
            )}
            {projectNode && (
              <Tag
                text={projectNode.title}
                colorPallete={colorPallete}
                isProject={true}
                desiredHeight={29}
                textSize={theme.fontSize.small}
              />
            )}
          </View>
        )}
        <View style={[styles.footer]}>
          <View style={styles.rightFooter}>
            <Text style={styles.textFooter}>
              {session.getStartTime().toString()} -{" "}
              {session.getEndTime().toString()}
            </Text>
          </View>
          {session.getLapAmount() > 0 && (
            <Text
              style={styles.textFooter}
            >{`${session.getLapAmount()} x ${projectNode?.lapName ?? activityNode?.lapName ?? "Lap"}`}</Text>
          )}
        </View>
      </View>
    </View>
  );
});

export default SessionElement;
