import { View, Text, Animated, type LayoutChangeEvent } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import ActivityItem from "@components/module/activityItem/activityItem";
import { useEffect, useRef, useState } from "react";
import { useFocus } from "@/context/FocusContext";

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
  activityData?: ActivityData;
  focusedLevel?: number;
  level?: number;
};

export default function Activity({
  activityData = data,
  level = 0,
}: ActivityProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { focusedLevel, setFocusedLevel } = useFocus();
  const [activityItemHeight, setActivityItemHeight] = useState<number>(0);
  const [isActivityItemHeightCalculated, setIsActivityItemHeightCalculated] =
    useState<boolean>(false); // State to track height calculation

  const shrinkAnim = useRef(new Animated.Value(35)).current; // Original width
  const shouldShrink = level < focusedLevel;
  useEffect(() => {
    console.log("Should shrink: ", shouldShrink);
    Animated.timing(shrinkAnim, {
      toValue: shouldShrink ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setIsActivityItemHeightCalculated(false);
      }
    });
  }, [shouldShrink, shrinkAnim]);

  return (
    <View>
      <ActivityItem
        activityName={activityData.title}
        onExpand={() => {
          setIsExpanded(!isExpanded);
        }}
        onFocus={() => {
          setIsFocused(true);
          setFocusedLevel(level);
          console.log("Focused level: ", level);
          console.log("Actual focused level: ", focusedLevel);
        }}
        onUnfocus={() => {
          setIsFocused(false);
          setFocusedLevel(0);
        }}
        isExpanded={isExpanded}
        isFocused={isFocused}
        hasChildren={!!activityData.activities?.length}
        style={[styles.activityItem, {}]}
        onLayout={(event: LayoutChangeEvent) => {
          if (!isActivityItemHeightCalculated) {
            setActivityItemHeight(event.nativeEvent.layout.height);
            setIsActivityItemHeightCalculated(true);
            console.log(
              "Activity item height: ",
              event.nativeEvent.layout.height,
            );
          }
        }}
      />
      {activityData.activities?.length && isExpanded && (
        <View style={styles.childrenContainer}>
          <Animated.View
            style={[
              styles.lineContainer,
              {
                width: shrinkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 35],
                }),
              },
            ]}
          >
            <Animated.View style={[styles.line, { opacity: shrinkAnim }]} />
          </Animated.View>
          <View style={[styles.list]}>
            {activityData.activities?.map((activity) => (
              <Activity
                key={activity.id}
                activityData={activity}
                focusedLevel={focusedLevel}
                level={level + 1}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
