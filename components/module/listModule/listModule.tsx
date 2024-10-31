import { View, Easing } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
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

import data from "./exampleData";
type ActivityData = {
  id: string;
  title: string;
  activities?: ActivityData[];
};

type ActivityProps = {
  activityData?: ActivityData;
  level?: number;
  style?: object;
  path?: string;
  addScreen?: boolean;
  onClickAddButton?: () => void;
  addAnim?: SharedValue<number>;
  onFocusAdditional?: () => void;
  expandAnimOfParent?: SharedValue<number>;
};

export default function Activity({
  activityData = data,
  level = 0,
  path = "/root",
  addScreen = false,
  onClickAddButton = () => {},
  addAnim = useSharedValue(0),
  onFocusAdditional = () => {},
  expandAnimOfParent = useSharedValue(1),
}: ActivityProps) {
  const styles = useStyles();
  const { focusedPath, setFocusedPath, popFocusStack, focusedLevel } =
    useFocus();
  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  const expandAnim = useSharedValue(0);
  const shouldBeVisible = path.startsWith(focusedPath);
  const shouldBeVisibleAnim = useSharedValue(shouldBeVisible ? 1 : 0);
  const hasChildren = !!activityData.activities?.length;
  const [isExpandAnimGreaterThanZero, setIsExpandAnimGreaterThanZero] =
    useState(false);

  useEffect(() => {
    shouldBeVisibleAnim.value = withTiming(
      shouldBeVisible ? 1 : 0,
      {
        duration: 300,
      },
      () => {},
    );
  }, [shouldBeVisible, shouldBeVisibleAnim]);

  const visibleAnim = useDerivedValue(() => {
    return shouldBeVisibleAnim.value * expandAnimOfParent.value;
  });

  const [expandedState, setExpandedStateLocal] = useState(isRoot);

  const setExpandedState = useCallback((value: boolean) => {
    setExpandedStateLocal(value);
    if (value) {
      setIsExpandAnimGreaterThanZero(true);
    }
  }, []);

  const maxOfAddAndExpandAnim = useDerivedValue(() => {
    return Math.max(addAnim.value, expandAnim.value);
  });

  const focusAnim = useSharedValue(0);
  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    if (isFocused) {
      setExpandedState(true);
    }
  }, [isFocused, focusAnim, setExpandedState]);

  const addVisiblity = useDerivedValue(() => {
    return shouldBeVisibleAnim.value > 0 &&
      shouldBeVisibleAnim.value < 1 &&
      shouldBeVisible
      ? 0
      : visibleAnim.value * addAnim.value;
  });

  const animStyles = {
    activityItem: useAnimatedStyle(() => ({
      height:
        visibleAnim.value * interpolate(focusAnim.value, [0, 1], [40, 82.2]),
      borderWidth: interpolate(visibleAnim.value, [0, 0.1, 1], [0, 0.18, 0.18]),
      marginBottom: interpolate(
        visibleAnim.value * maxOfAddAndExpandAnim.value,
        [0, 1],
        [0, 0],
      ),
    })),
    listModule: useAnimatedStyle(() => ({
      marginTop: interpolate(
        visibleAnim.value,
        [0, 1],
        [-styles.list.gap / 2, 0],
      ),
      marginBottom: interpolate(
        visibleAnim.value,
        [0, 1],
        [-styles.list.gap / 2, 0],
      ),
    })),
    emptyViewTop: useAnimatedStyle(() => ({
      marginBottom: interpolate(
        visibleAnim.value,
        [0, 1],
        [-styles.list.gap / 2, -styles.list.gap],
      ),
    })),
    emptyViewBottom: useAnimatedStyle(() => ({
      marginTop: interpolate(
        visibleAnim.value,
        [0, 1],
        [-styles.list.gap / 2, -styles.list.gap],
      ),
    })),

    childrenContainer: useAnimatedStyle(() => {
      return {
        marginTop: interpolate(
          visibleAnim.value * maxOfAddAndExpandAnim.value,
          [0, 1],
          [0, !isRoot ? styles.childrenContainer.marginTop : 0],
        ),
      };
    }),
    lineContainer: useAnimatedStyle(() => ({
      width: interpolate(
        visibleAnim.value,
        [0, 1],
        [0, !isRoot ? styles.lineContainer.width : 0],
      ),
    })),
    line: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          visibleAnim.value * maxOfAddAndExpandAnim.value,
          [0, 1],
          [0, 1],
        ),
        borderLeftWidth: interpolate(
          visibleAnim.value * maxOfAddAndExpandAnim.value,
          [0, 0.1, 1],
          [0, isRoot ? 0 : 1.5, isRoot ? 0 : 1.5],
        ),
        borderBottomWidth: interpolate(
          visibleAnim.value * maxOfAddAndExpandAnim.value,
          [0, 1],
          [0, isRoot ? 0 : 1.5],
        ),
      };
    }),
    addItem: useAnimatedStyle(() => {
      return {
        marginBottom: interpolate(
          addVisiblity.value,
          [0, 1],
          [-styles.list.gap / 2, styles.activityItem.marginBottom],
        ),
        marginTop: interpolate(
          addVisiblity.value,
          [0, 1],
          [-styles.list.gap / 2, 0],
        ),
        height: interpolate(addVisiblity.value, [0, 1], [0, 40]),
      };
    }, [shouldBeVisible]),
  };

  const handleExpand = useCallback(() => {
    if (
      !expandedState &&
      level >= focusedLevel + 3 + (focusedLevel === 0 ? 1 : 0)
    ) {
      setFocusedPath(path.split("/").slice(0, -2).join("/"));
    }
    setExpandedState(!expandedState);
  }, [
    expandedState,
    level,
    focusedLevel,
    path,
    setFocusedPath,
    setExpandedState,
  ]);

  useEffect(() => {
    if (level >= focusedLevel + 3) {
      setExpandedState(false);
    }
  }, [level, focusedLevel, setExpandedState]);

  useEffect(() => {
    expandAnim.value = withTiming(
      expandedState ? 1 : 0,
      { duration: 300 },
      (isFinished) => {
        if (isFinished && !expandedState) {
          runOnJS(setIsExpandAnimGreaterThanZero)(false);
        }
      },
    );
  }, [expandedState, expandAnim]);

  const multipliedExpandAnim = useDerivedValue(() => {
    return expandAnim.value * expandAnimOfParent.value;
  });

  return (
    <Animated.View style={[animStyles.listModule]}>
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
          expandAnim={expandAnim}
        />
      )}
      <Animated.View
        style={[styles.childrenContainer, animStyles.childrenContainer]}
      >
        <Animated.View style={[styles.lineContainer, animStyles.lineContainer]}>
          <Animated.View style={[styles.line, animStyles.line]} />
        </Animated.View>
        <View style={[styles.list]}>
          <Animated.View style={[styles.emptyView, animStyles.emptyViewTop]} />
          <AddItem
            onClickAddButton={onClickAddButton}
            style={animStyles.addItem}
          />
          {isExpandAnimGreaterThanZero && (
            <View style={{ gap: 8 }}>
              {activityData.activities?.map((activity, index, array) => (
                <Activity
                  key={activity.id}
                  activityData={activity}
                  level={level + 1}
                  path={`${path}/${activity.id}`}
                  addScreen={addScreen}
                  onClickAddButton={onClickAddButton}
                  addAnim={addAnim}
                  onFocusAdditional={onFocusAdditional}
                  expandAnimOfParent={multipliedExpandAnim}
                />
              ))}
            </View>
          )}
          <Animated.View
            style={[styles.emptyView, animStyles.emptyViewBottom]}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
