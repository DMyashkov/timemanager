import { View, Easing } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import useStyles from "./styles";
// import { useTheme } from "@context/ThemeContext";
import ActivityItem from "@components/module/activityItem/activityItem";
import { useEffect, useRef, useState } from "react";
import { useFocus } from "@/context/FocusContext";
import AddItem from "../addItem/addItem";
import type { SharedValue } from "react-native-reanimated/lib/typescript/Animated";
import { useLocalSearchParams } from "expo-router";

const data = {
  id: "root",
  title: "Root",
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
  level?: number;
  style?: object;
  isFirstInList?: boolean;
  isLastInList?: boolean;
  path?: string;
  addScreen?: boolean;
  onClickAddButton?: () => void;
  addAnim?: SharedValue<number>;
  onFocusAdditional?: () => void;
};

export default function Activity({
  activityData = data,
  level = 0,
  isFirstInList = true,
  isLastInList = true,
  path = "/root",
  addScreen = false,
  onClickAddButton = () => {},
  addAnim = useSharedValue(0),
  onFocusAdditional = () => {},
}: ActivityProps) {
  const styles = useStyles();
  // const { theme } = useTheme();

  // const { focusedLevel, setFocusedLevel } = useFocus();
  const { focusedPath, setFocusedPath, popFocusStack } = useFocus();
  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  const shrinkAnim = useSharedValue(0);
  const shouldShrink = !path.startsWith(focusedPath);
  const [isExpanded, setIsExpanded] = useState<boolean>(isRoot);

  useEffect(() => {
    shrinkAnim.value = withTiming(shouldShrink ? 1 : 0, { duration: 300 });
  }, [shouldShrink, shrinkAnim]);

  const focusAnim = useSharedValue(0);
  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused, focusAnim]);

  const animStyles = {
    activityItem: useAnimatedStyle(() => ({
      height:
        interpolate(shrinkAnim.value, [0, 1], [1, 0]) *
        interpolate(focusAnim.value, [0, 1], [40, 82]),
      marginBottom: interpolate(
        shrinkAnim.value,
        [0, 1],
        [styles.activityItem.marginBottom, 0],
      ),
    })),
    listModule: useAnimatedStyle(() => ({
      marginTop: interpolate(
        shrinkAnim.value,
        [0, 1],
        [0, isFirstInList ? 0 : -styles.list.gap / 2],
      ),
      marginBottom: interpolate(
        shrinkAnim.value,
        [0, 1],
        [0, isLastInList ? 0 : -styles.list.gap / 2],
      ),
    })),
    childrenContainer: useAnimatedStyle(() => ({
      marginTop: interpolate(
        shrinkAnim.value,
        [0, 1],
        [!isRoot ? styles.childrenContainer.marginTop : 0, 0],
      ),
    })),
    lineContainer: useAnimatedStyle(() => ({
      width: interpolate(
        shrinkAnim.value,
        [0, 1],
        [!isRoot ? styles.lineContainer.width : 0, 0],
      ),
    })),
    line: useAnimatedStyle(() => ({
      opacity: interpolate(shrinkAnim.value, [0, 1], [!isRoot ? 1 : 0, 0]),
    })),
    addItem: useAnimatedStyle(() => {
      const addShrinkAnim =
        interpolate(shrinkAnim.value, [0, 1], [1, 0]) *
        interpolate(addAnim.value, [0, 1], [0, 1]);
      return {
        marginBottom: interpolate(
          addShrinkAnim,
          [0, 1],
          [0, styles.activityItem.marginBottom],
        ),
        marginTop: interpolate(
          addShrinkAnim,
          [0, 1],
          [-styles.childrenContainer.marginTop, 0],
        ),
        height: interpolate(addShrinkAnim, [0, 1], [0, 40]),
      };
    }),
  };

  return (
    <Animated.View style={animStyles.listModule}>
      {level !== 0 && (
        <ActivityItem
          activityName={activityData.title}
          onExpand={() => {
            setIsExpanded(!isExpanded);
          }}
          onFocus={() => {
            setFocusedPath(path);
            onFocusAdditional();
          }}
          onUnfocus={() => {
            popFocusStack();
            onFocusAdditional();
          }}
          isExpanded={isExpanded}
          isFocused={isFocused}
          hasChildren={!!activityData.activities?.length}
          style={[styles.activityItem, animStyles.activityItem]}
        />
      )}
      {activityData.activities?.length && isExpanded && (
        <Animated.View
          style={[styles.childrenContainer, animStyles.childrenContainer]}
        >
          <Animated.View
            style={[styles.lineContainer, animStyles.lineContainer]}
          >
            <Animated.View style={[styles.line, animStyles.line]} />
          </Animated.View>
          <View style={[styles.list]}>
            <AddItem
              onClickAddButton={onClickAddButton}
              style={animStyles.addItem}
            />
            {activityData.activities?.map((activity, index, array) => (
              <Activity
                key={activity.id}
                activityData={activity}
                level={level + 1}
                isFirstInList={index === 0}
                isLastInList={index === array.length - 1}
                path={`${path}/${activity.id}`}
                addScreen={addScreen}
                onClickAddButton={onClickAddButton}
                addAnim={addAnim}
                onFocusAdditional={onFocusAdditional}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
