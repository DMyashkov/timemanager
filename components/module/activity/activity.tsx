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

export default function Activity(activityData: ActivityData = data) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

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
      />
      <View>
        <View style={styles.line} />
        {activityData.activities?.map((activity) => (
          <Activity key={activity.id} {...activity} />
        ))}
      </View>
    </View>
  );
}
