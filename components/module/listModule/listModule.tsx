import { View, Easing } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import useStyles from "./styles";
// import { useTheme } from "@context/ThemeContext";
import ActivityItem from "@components/module/activityItem/activityItem";
import { useCallback, useEffect, useRef, useState } from "react";
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
                  activities: [
                    {
                      id: "activity-1-1-1-1-1",
                      title: "Activity 1.1.1.1.1",
                    },
                  ],
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
  const { focusedPath, setFocusedPath, popFocusStack, focusedLevel } =
    useFocus();
  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  const expandAnim = useSharedValue(0);
  const shouldShrink = !path.startsWith(focusedPath);
  // const isExpanded = useSharedValue(isRoot);
  const [expandedState, setExpandedState] = useState(isRoot);

  useEffect(() => {
    expandAnim.value = withTiming(shouldShrink ? 0 : 1, { duration: 300 });
  }, [shouldShrink, expandAnim]);

  const focusAnim = useSharedValue(0);
  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused, focusAnim]);

  const animStyles = {
    activityItem: useAnimatedStyle(() => ({
      height: expandAnim.value * interpolate(focusAnim.value, [0, 1], [40, 82]),
      marginBottom: interpolate(
        expandAnim.value,
        [0, 1],
        [0, styles.activityItem.marginBottom],
      ),
    })),
    listModule: useAnimatedStyle(() => ({
      marginTop: interpolate(
        expandAnim.value,
        [0, 1],
        [isFirstInList ? 0 : -styles.list.gap / 2, 0],
      ),
      marginBottom: interpolate(
        expandAnim.value,
        [0, 1],
        [isLastInList ? 0 : -styles.list.gap / 2, 0],
      ),
    })),
    childrenContainerExpanded: useAnimatedStyle(() => {
      return {
        marginTop: interpolate(
          expandAnim.value,
          [0, 1],
          [0, !isRoot ? styles.childrenContainer.marginTop : 0],
        ),
      };
    }),
    childrenContainerCollapsed: useAnimatedStyle(() => {
      return {
        marginTop: interpolate(
          expandAnim.value * addAnim.value,
          [0, 1],
          [0, !isRoot ? styles.childrenContainer.marginTop : 0],
        ),
      };
    }),
    lineContainer: useAnimatedStyle(() => ({
      width: interpolate(
        expandAnim.value,
        [0, 1],
        [0, !isRoot ? styles.lineContainer.width : 0],
      ),
    })),
    lineExpanded: useAnimatedStyle(() => {
      return {
        opacity: interpolate(expandAnim.value, [0, 1], [0, !isRoot ? 1 : 0]),
      };
    }),
    lineCollapsed: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          expandAnim.value * addAnim.value,
          [0, 1],
          [0, !isRoot ? 1 : 0],
        ),
      };
    }),
    addItem: useAnimatedStyle(() => {
      const addShrinkAnimStrict =
        interpolate(
          interpolate(expandAnim.value, [0, 1], [1, 0]),
          [0, 1],
          [interpolate(expandAnim.value, [0, 1], [1, 0]) > 0 ? 0 : 1, 0],
        ) * interpolate(addAnim.value, [0, 1], [0, 1]);
      const addShrinkAnim =
        expandAnim.value * interpolate(addAnim.value, [0, 1], [0, 1]);

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
        height: interpolate(
          shouldShrink === false ? addShrinkAnimStrict : addShrinkAnim,
          [0, 1],
          [0, 40],
        ),
      };
    }),
  };

  // useEffect(() => {
  //   isExpanded.value = expandedState;
  // }, [expandedState, isExpanded]);

  const handleExpand = useCallback(() => {
    setExpandedState((prev) => !prev);
  }, []);

  return (
    <Animated.View style={animStyles.listModule}>
      {level !== 0 && (
        <ActivityItem
          activityName={activityData.title}
          onExpand={() => {
            handleExpand();
          }}
          onFocus={() => {
            setFocusedPath(path);
            onFocusAdditional();
          }}
          onUnfocus={() => {
            popFocusStack();
            onFocusAdditional();
          }}
          isExpanded={expandedState}
          isFocused={isFocused}
          hasChildren={!!activityData.activities?.length}
          style={[styles.activityItem, animStyles.activityItem]}
        />
      )}
      <Animated.View
        key={`children-container-${expandedState}`}
        style={[
          styles.childrenContainer,
          expandedState
            ? animStyles.childrenContainerExpanded
            : animStyles.childrenContainerCollapsed,
        ]}
      >
        <Animated.View style={[styles.lineContainer, animStyles.lineContainer]}>
          <Animated.View
            style={[
              styles.line,
              expandedState
                ? animStyles.lineExpanded
                : animStyles.lineCollapsed,
            ]}
          />
        </Animated.View>
        <View style={[styles.list]}>
          <AddItem
            onClickAddButton={onClickAddButton}
            style={animStyles.addItem}
          />
          {expandedState &&
            activityData.activities?.map((activity, index, array) => (
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
    </Animated.View>
  );
}
