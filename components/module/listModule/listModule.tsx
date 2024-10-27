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
  isLastInList?: boolean;
  path?: string;
  addScreen?: boolean;
  onClickAddButton?: () => void;
  addAnim?: SharedValue<number>;
  onFocusAdditional?: () => void;
  expandAnimProp?: SharedValue<number>;
};

export default function Activity({
  activityData = data,
  level = 0,
  isLastInList = true,
  path = "/root",
  addScreen = false,
  onClickAddButton = () => {},
  addAnim = useSharedValue(0),
  onFocusAdditional = () => {},
  expandAnimProp = useSharedValue(1),
}: ActivityProps) {
  const styles = useStyles();
  // const { theme } = useTheme();

  // const { focusedLevel, setFocusedLevel } = useFocus();
  const { focusedPath, setFocusedPath, popFocusStack, focusedLevel } =
    useFocus();
  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  const focusAnim = useSharedValue(0);
  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused, focusAnim]);

  const localExpandAnim = useSharedValue(isRoot ? 1 : 0);

  const expandAnim = useDerivedValue(() => {
    return focusAnim.value > 0
      ? 1
      : expandAnimProp.value * localExpandAnim.value;
  });

  const expandAnimChild = useSharedValue(0);

  const childVisibilityAnim = useDerivedValue(() => {
    return expandAnim.value * expandAnimChild.value;
  });

  const isInFocusGroup = path.startsWith(focusedPath);
  const [expandedState, setExpandedState] = useState(isRoot);

  useEffect(() => {
    localExpandAnim.value = withTiming(isInFocusGroup ? 1 : 0, {
      duration: 300,
    });
  }, [isInFocusGroup, localExpandAnim]);

  useEffect(() => {
    expandAnimChild.value = withTiming(expandedState ? 1 : 0, {
      duration: 300,
    });
  }, [expandedState, expandAnimChild]);

  const animStyles = {
    activityItem: useAnimatedStyle(() => ({
      height: expandAnim.value * interpolate(focusAnim.value, [0, 1], [40, 82]),
      marginBottom: interpolate(expandAnim.value, [0, 1], [0, 2]),
    })),
    listModule: useAnimatedStyle(() => ({
      marginTop: interpolate(
        expandAnim.value,
        [0, 1],
        [-styles.list.gap / 2, 0],
      ),
      marginBottom: interpolate(
        expandAnim.value,
        [0, 1],
        [isLastInList ? 0 : -styles.list.gap / 2, 0],
      ),
    })),
    childrenContainer: useAnimatedStyle(() => {
      return {
        marginTop: interpolate(
          interpolate(
            childVisibilityAnim.value,
            [0, 1],
            [addAnim.value * expandAnim.value, childVisibilityAnim.value],
          ),
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
    line: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          interpolate(
            childVisibilityAnim.value,
            [0, 1],
            [addAnim.value * expandAnim.value, childVisibilityAnim.value],
          ),
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
          [
            0,
            activityData.activities &&
            activityData.activities.length > 0 &&
            !expandedState
              ? // something is wrong here this can be applied better
                styles.activityItem.marginBottom - styles.list.gap / 2
              : styles.activityItem.marginBottom,
          ],
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

  // useEffect(() => {
  //   isExpanded.value = expandedState;
  // }, [expandedState, isExpanded]);

  const handleExpand = useCallback(() => {
    setExpandedState((prev) => !prev);
  }, []);

  return (
    <Animated.View
      style={animStyles.listModule}
      // key={`${expandAnim.value}${activityData.title}`}
    >
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
        style={[styles.childrenContainer, animStyles.childrenContainer]}
      >
        <Animated.View style={[styles.lineContainer, animStyles.lineContainer]}>
          <Animated.View style={[styles.line, animStyles.line]} />
        </Animated.View>
        <View style={[styles.list]}>
          <AddItem
            onClickAddButton={onClickAddButton}
            style={animStyles.addItem}
            key={`${expandedState}${activityData.title}`}
          />
          {activityData.activities?.map((activity, index, array) => (
            <Activity
              key={activity.id}
              activityData={activity}
              level={level + 1}
              isLastInList={index === array.length - 1}
              path={`${path}/${activity.id}`}
              addScreen={addScreen}
              onClickAddButton={onClickAddButton}
              addAnim={addAnim}
              onFocusAdditional={onFocusAdditional}
              expandAnimProp={childVisibilityAnim}
            />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}
