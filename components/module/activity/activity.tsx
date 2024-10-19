import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import ActivityItem from "@components/module/activityItem/activityItem";
import { useState } from "react";

const data = {
  id: "root",
  title: "Main Activity",
  activities: [
    {
      id: "activity-1",
      title: "Activity 1",
      activities: [
        {
          id: "activity-1-1",
          title: "Activity 1.1",
          activities: [
            {
              id: "activity-1-1-1",
              title: "Activity 1.1.1",
              activities: [
                {
                  id: "activity-1-1-1-1",
                  title: "Activity 1.1.1.1",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "activity-2",
      title: "Activity 2",
    },
  ],
};

type ActivityData = {
  id: string;
  title: string;
  activities?: ActivityData[];
};

type ActivityProps = {
  activityData: ActivityData;
};

export default function Activity({ activityData = data }: ActivityProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  console.log(activityData);

  return (
    <View>
      <ActivityItem
        activityName={activityData.title}
        onExpand={() => {
          setIsExpanded(!isExpanded);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onUnfocus={() => {
          setIsFocused(false);
        }}
        isExpanded={isExpanded}
        isFocused={isFocused}
        hasChildren={!!activityData.activities?.length}
        style={styles.activityItem}
      />
      {activityData.activities?.length && isExpanded && (
        <View style={styles.childrenContainer}>
          <View style={styles.lineContainer} />
          <View style={styles.list}>
            {activityData.activities?.map((activity) => (
              <Activity key={activity.id} activityData={activity} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
