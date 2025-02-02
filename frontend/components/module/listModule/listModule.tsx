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
import { router, useLocalSearchParams } from "expo-router";

import Project from "../projectItem/projectItem";
import ProjectItem from "../projectItem/projectItem";
import { useNavigation } from "expo-router";
import exampleData from "@/constants/exampleData";
import { useTheme } from "@context/ThemeContext";

import { moduleType } from "@/constants/interfaces";
import type { TagData } from "@/constants/interfaces";
import type { DataIndexLocal } from "@/constants/interfaces";

type ActivityProps = {
  level?: number;
  style?: object;
  path?: string;
  addScreen?: boolean;
  onClickAddButton?: (parentId: string) => void;
  addAnim?: SharedValue<number>;
  onFocusAdditional?: () => void;
  expandAnimOfParent?: SharedValue<number>;
  isLastInList?: boolean;
  setIsVisibleAnimZero?: (value: boolean) => void;
  typeOfModule?: moduleType;
  activityData: TagData;
  dataIndex: DataIndexLocal;
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
  // if (!existState) {
  //   return null;
  // }

  return (
    <ListModuleInner
      {...props}
      setIsVisibleAnimZero={setIsVisibleAnimZero}
      activityData={props.activityData}
    />
  );
}

function ListModuleInner({
  activityData,
  level = 0,
  path = "/root",
  addScreen = false,
  addAnim = useSharedValue(0),
  onFocusAdditional = () => {},
  expandAnimOfParent = useSharedValue(1),
  isLastInList = true,
  setIsVisibleAnimZero = () => {},
  typeOfModule = moduleType.activity,
  dataIndex,
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
  const hasChildren = !!activityData.children?.length;

  const handleAddClick = useCallback(() => {
    const parentId = activityData.id;
    router.push({
      pathname: "/add",
      params: {
        parentId,
        dataIndex: JSON.stringify(dataIndex),
        rawIsAddScreen: "true",
      },
    });
  }, [activityData.id, dataIndex]);

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

  // console.log("activityData", JSON.stringify(activityData, null, 2));
  // console.log("exampleData", JSON.stringify(exampleData, null, 2));
  const { theme } = useTheme();

  const buttonsOnTopOfTag = [
    {
      text: "Start timer",
      color: theme.color.veryLightGrey, // Use theme color as default
      onPress: () => {
        console.log("Start timer");
      },
    },
    {
      text: "Edit",
      color: theme.color.mediumGrey,
      onPress: () => {
        router.push({
          pathname: "/add",
          params: {
            parentId: activityData.id,
            dataIndex: JSON.stringify(dataIndex),
            rawIsAddScreen: "false",
          },
        });
      },
    },
  ];

  // console.log(typeOfModule);
  // console.log(typeOfModule === moduleType.activity);
  const currentData = dataIndex.get(activityData.id);
  if (dataIndex === undefined || currentData === undefined) {
    return null;
  }

  return (
    <Animated.View style={[animStyles.listModule]}>
      {level !== 0 &&
        (typeOfModule === moduleType.activity ? (
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
            isFocused={isFocused}
            hasChildren={!!activityData.children?.length}
            style={[styles.activityItem]}
            expandAnimParam={expandAnim}
            focusAnim={focusAnim}
            visibleAnim={visibleAnim}
            activityColor={currentData.colorPreset}
            buttons={buttonsOnTopOfTag}
          />
        ) : (
          <ProjectItem
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
            isFocused={isFocused}
            style={[styles.activityItem]}
            focusAnim={focusAnim}
            visibleAnim={visibleAnim}
            activityColor={currentData.colorPreset}
            buttons={buttonsOnTopOfTag}
          />
        ))}
      {typeOfModule === moduleType.activity && (
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
              onClickAddButton={handleAddClick}
              style={animStyles.addItem}
            />
            {isExpandAnimGreaterThanZero && (
              <FlatList
                data={activityData.children}
                keyExtractor={(activity) => activity.toString()}
                renderItem={({ item: activityId }) => {
                  const activityItem = dataIndex.get(activityId);
                  if (activityItem === undefined) {
                    return null;
                  }
                  return (
                    <ListModule
                      // key={activity.id}
                      activityData={activityItem}
                      level={level + 1}
                      isLastInList={activityId === activityData.parent}
                      path={`${path}/${activityId}`}
                      addScreen={addScreen}
                      addAnim={addAnim}
                      onFocusAdditional={onFocusAdditional}
                      expandAnimOfParent={multipliedExpandAnim}
                      typeOfModule={activityData.type}
                      dataIndex={dataIndex}
                    />
                  );
                }}
                style={{ overflow: "visible" }}
              />
            )}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
