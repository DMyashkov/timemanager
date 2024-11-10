import { View, Easing, FlatList } from "react-native";
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
  isLastInList?: boolean;
  setIsVisibleAnimZero?: (value: boolean) => void;
};

export default function ListModule(props: ActivityProps) {
  const [existState, setExistState] = useState(true);
  const [isVisibleAnimZero, setIsVisibleAnimZero] = useState(false);
  const { focusedPath } = useFocus();
  const shouldBeVisible = props.path
    ? props.path.startsWith(focusedPath)
    : false;

  const isPartOfFocusGroup =
    props.path?.startsWith(focusedPath) ||
    focusedPath.startsWith(props.path || "/");

  useEffect(() => {
    if (shouldBeVisible) {
      setExistState(true);
    }
  }, [shouldBeVisible]);

  useEffect(() => {
    if (isVisibleAnimZero && !isPartOfFocusGroup) {
      setExistState(false);
    }
  }, [isVisibleAnimZero, isPartOfFocusGroup]);

  // Early return if `existState` is false, avoiding the render of the heavy logic component
  if (!existState) {
    return null;
  }

  return (
    <ListModuleInner {...props} setIsVisibleAnimZero={setIsVisibleAnimZero} />
  );
}

function ListModuleInner({
  activityData = data,
  level = 0,
  path = "/root",
  addScreen = false,
  onClickAddButton = () => {},
  addAnim = useSharedValue(0),
  onFocusAdditional = () => {},
  expandAnimOfParent = useSharedValue(1),
  isLastInList = true,
  setIsVisibleAnimZero = () => {},
}: ActivityProps) {
  const { focusedPath, setFocusedPath, popFocusStack, focusedLevel } =
    useFocus();

  const styles = useStyles();
  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  const expandAnim = useSharedValue(0);
  const shouldBeVisible = path.startsWith(focusedPath);
  const shouldBeVisibleAnim = useSharedValue(0);
  const [isExpandAnimGreaterThanZero, setIsExpandAnimGreaterThanZero] =
    useState(false);

  useEffect(() => {
    if (shouldBeVisible) {
      setIsVisibleAnimZero(false);
    }
    shouldBeVisibleAnim.value = withTiming(
      shouldBeVisible ? 1 : 0,
      {
        duration: 300,
      },
      (isFinished) => {
        if (isFinished && !shouldBeVisible) {
          runOnJS(setIsVisibleAnimZero)(true);
        }
      },
    );
  }, [shouldBeVisible, shouldBeVisibleAnim, setIsVisibleAnimZero]);

  const visibleAnim = useDerivedValue(() => {
    return shouldBeVisibleAnim.value * expandAnimOfParent.value;
  });

  const [expandedState, setExpandedStateLocal] = useState(isRoot);
  const hasChildren = !!activityData.activities?.length;

  const setExpandedState = useCallback(
    (value: boolean) => {
      if (!hasChildren) {
        return;
      }
      setExpandedStateLocal(value);
      if (value) {
        setIsExpandAnimGreaterThanZero(true);
      }
    },
    [hasChildren],
  );

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
    return addAnim.value < 1 &&
      shouldBeVisibleAnim.value > 0 &&
      shouldBeVisibleAnim.value < 1 &&
      shouldBeVisible
      ? 0
      : visibleAnim.value * addAnim.value;
  });

  const animStyles = {
    listModule: useAnimatedStyle(() => ({
      marginBottom: interpolate(
        visibleAnim.value,
        [0, 1],
        [0, !isLastInList ? styles.childrenContainer.marginTop : 0],
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
          addVisiblity.value * expandAnim.value,
          [0, 1],
          [0, styles.childrenContainer.marginTop],
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
          style={[styles.activityItem]}
          expandAnim={expandAnim}
          focusAnim={focusAnim}
          visibleAnim={visibleAnim}
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
          />
          {isExpandAnimGreaterThanZero && (
            <FlatList
              data={activityData.activities}
              contentContainerStyle={{
                gap: 0,
                paddingBottom: 0,
                paddingTop: 0,
              }}
              keyExtractor={(activity) => activity.id.toString()}
              renderItem={({ item: activity }) => (
                <ListModule
                  key={activity.id}
                  activityData={activity}
                  level={level + 1}
                  isLastInList={
                    activity.id === activityData.activities?.slice(-1)[0].id
                  }
                  path={`${path}/${activity.id}`}
                  addScreen={addScreen}
                  onClickAddButton={onClickAddButton}
                  addAnim={addAnim}
                  onFocusAdditional={onFocusAdditional}
                  expandAnimOfParent={multipliedExpandAnim}
                />
              )}
              style={{ overflow: "visible" }}
              extraData={{
                level,
                path,
                addScreen,
                addAnim,
                onFocusAdditional,
                multipliedExpandAnim,
              }}
            />
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}
