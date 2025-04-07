import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import type { Color, TagData } from "@interfaces";
import type { Session, Time } from "@/utils/dateTimeSession";
import { dataIndex } from "@/constants/exampleData";
import { TagsFromId } from "@/utils/getComponentsFromTag";
import { useEffect, useState } from "react";

import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useTagContext } from "@/context/TagContext";
import Tag from "@/components/tag/tagComponent";
import { useDerivedTags } from "@/hooks/useDerivedTags";

export default function SessionElement({
  style = {},
  session,
}: {
  style?: object;
  session: Session;
}) {
  const { theme } = useTheme();
  const tagId = session.getTagId();
  const { activityNode, projectNode } = useDerivedTags(tagId);
  console.log(
    "tagId in sessionElement:",
    tagId,
  );
  console.log(
    "activityNode and projectNode in sessionElement:",
    activityNode,
    projectNode,
  );

  const colorPallete: Color =
    theme.color.presets[
      activityNode?.colorPreset ?? projectNode?.colorPreset ?? "green"
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
        <View style={styles.footer}>
          <Text
            style={styles.textFooter}
          >{`${session.getLapAmount()} x ${projectNode?.lapName ?? activityNode?.lapName ?? "Lap"}`}</Text>
          <View style={styles.rightFooter}>
            <Text style={styles.textFooter}>
              {session.getStartTime().toString()} -{" "}
              {session.getEndTime().toString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
