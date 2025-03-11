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
import ActivityItem from "@components/module/activityItem/activityItem";
import { useCallback, useEffect, useState } from "react";
import { useFocus } from "@/context/FocusContext";
import AddItem from "../addItem/addItem";
import { router } from "expo-router";
import ProjectItem from "../projectItem/projectItem";
import { moduleTypeEnum, type TagData } from "@/constants/interfaces";
import { useTheme } from "@context/ThemeContext";

// IMPORTANT: Import your TagContext for getTag, if needed.
import { useTagContext } from "@/context/TagContext";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ListModuleProps {
  level?: number;
  style?: object;
  path?: string;
  onClickAddButton?: (parentId: string) => void;
  addAnim?: Animated.SharedValue<number>;
  onFocusAdditional?: () => void;
  expandAnimOfParent?: Animated.SharedValue<number>;
  isLastInList?: boolean;
  setIsVisibleAnimZero?: (value: boolean) => void;
  moduleID: number; // We rely fully on this TagData for rendering
}

export default function ListModule(props: ListModuleProps) {
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

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  useEffect(() => {
    if (isVisibleAnimZero && !isPartOfFocusGroup) {
      setExistState(false);
    }
  }, [isVisibleAnimZero, isPartOfFocusGroup]);

  const { data: moduleData } = useLiveQuery(
    db.select().from(tags).where(eq(tags.id, props.moduleID)),
  );

  const [moduleNode, setModuleNode] = useState<TagData | null>(null);

  const { parseTag } = useTagContext();

  useEffect(() => {
    try {
      if (moduleData) {
        console.log("moduleData", moduleData);
        setModuleNode(parseTag(moduleData));
      }
    } catch (error) {
      console.error("Error fetching root node:", error);
    }
  }, [parseTag, moduleData]);

  // If not "existing" in the visible list, render nothing
  if (!existState || !moduleNode) {
    return null;
  }

  // Otherwise, render the internal logic
  return (
    <ListModuleInner
      {...{ ...props, moduleID: undefined }} // Removes moduleID from props
      setIsVisibleAnimZero={setIsVisibleAnimZero}
      moduleData={moduleNode}
    />
  );
}

function ListModuleInner({
  level = 0,
  path = "/root",
  addAnim = useSharedValue(0),
  onFocusAdditional = () => {},
  expandAnimOfParent = useSharedValue(1),
  isLastInList = true,
  setIsVisibleAnimZero = () => {},
  moduleData: activityData, // New required field
}: Omit<ListModuleProps, "moduleID"> & { moduleData: TagData }) {
  const { focusedPath, setFocusedPath, popFocusStack, focusedLevel } =
    useFocus();
  const styles = useStyles();
  const { theme } = useTheme();

  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  // Animation that controls this node's expand/collapse
  const expandAnim = useSharedValue(isRoot ? 1 : 0);

  // Whether this node should be visible based on focus path
  const shouldBeVisible = path.startsWith(focusedPath);
  const shouldBeVisibleAnim = useSharedValue(shouldBeVisible ? 1 : 0);

  const [isExpandAnimGreaterThanZero, setIsExpandAnimGreaterThanZero] =
    useState(isRoot);

  const hasChildren = activityData.children && activityData.children.length > 0;

  const [expandedState, setExpandedStateLocal] = useState<boolean>(isRoot);

  const setExpandedState = useCallback(
    (value: boolean) => {
      if (!hasChildren) return;
      setExpandedStateLocal(value);
      if (value) setIsExpandAnimGreaterThanZero(true);
    },
    [hasChildren],
  );

  const handleExpand = useCallback(() => {
    // If attempting to expand deeper than the focus boundary, adjust the path
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

  // Whenever "isFocused" changes, we animate focus
  const focusAnim = useSharedValue(isFocused ? 1 : 0);
  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    if (isFocused) {
      setExpandedState(true);
    }
  }, [isFocused, focusAnim, setExpandedState]);

  // Expand/collapse animation
  useEffect(() => {
    expandAnim.value = withTiming(
      expandedState ? 1 : 0,
      { duration: 300 },
      (fin) => {
        if (fin && !expandedState) {
          runOnJS(setIsExpandAnimGreaterThanZero)(false);
        }
      },
    );
  }, [expandedState, expandAnim]);

  // If the user is focusing a different node, close deeper expansions
  useEffect(() => {
    if (level >= focusedLevel + 3) {
      setExpandedState(false);
    }
  }, [level, focusedLevel, setExpandedState]);

  // "Visibility" animation for removing from the tree
  useEffect(() => {
    shouldBeVisibleAnim.value = withTiming(
      shouldBeVisible ? 1 : 0,
      { duration: 300 },
      (isFinished) => {
        if (isFinished && !shouldBeVisible) {
          runOnJS(setIsVisibleAnimZero)(true);
        }
      },
    );
  }, [shouldBeVisible, shouldBeVisibleAnim, setIsVisibleAnimZero]);

  // Derived values for controlling the combined visibility
  const visibleAnim = useDerivedValue(() => {
    // Combine parent's expandAnim and our own shouldBeVisibleAnim
    return shouldBeVisibleAnim.value * expandAnimOfParent.value;
  });
  const maxOfAddAndExpandAnim = useDerivedValue(() =>
    Math.max(addAnim.value, expandAnim.value),
  );

  // This is used for the "AddItem" row
  const addVisiblity = useDerivedValue(() => {
    // If we want "AddItem" hidden while the node is transitioning,
    // we can condition logic below. This is the same logic you had, just minus dataIndex.
    return visibleAnim.value * addAnim.value;
  });

  // Animated styles
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
          [0, isRoot ? 0 : styles.childrenContainer.marginTop],
        ),
      };
    }),
    lineContainer: useAnimatedStyle(() => ({
      width: interpolate(
        visibleAnim.value,
        [0, 1],
        [0, isRoot ? 0 : styles.lineContainer.width],
      ),
    })),
    line: useAnimatedStyle(() => {
      const factor = visibleAnim.value * maxOfAddAndExpandAnim.value;
      return {
        opacity: interpolate(factor, [0, 1], [0, 1]),
        borderLeftWidth: interpolate(
          factor,
          [0, 0.1, 1],
          [0, isRoot ? 0 : 1.5, isRoot ? 0 : 1.5],
        ),
        borderBottomWidth: interpolate(factor, [0, 1], [0, isRoot ? 0 : 1.5]),
      };
    }),
    addItem: useAnimatedStyle(() => {
      const factor = addVisiblity.value * expandAnim.value;
      return {
        marginBottom: interpolate(
          factor,
          [0, 1],
          [0, styles.childrenContainer.marginTop],
        ),
        height: interpolate(addVisiblity.value, [0, 1], [0, 40]),
      };
    }),
  };

  // For the "Add" button
  const handleAddClick = useCallback(() => {
    const parentId = activityData.id;
    // Navigate to Add screen with rawIsAddScreen = "true"
    router.push({
      pathname: "/add",
      params: {
        parentId,
        rawIsAddScreen: "true",
      },
    });
  }, [activityData.id]);

  // For the "Edit" button
  const handleEditClick = useCallback(() => {
    router.push({
      pathname: "/add",
      params: {
        parentId: activityData.id,
        rawIsAddScreen: "false",
      },
    });
  }, [activityData.id]);

  const buttonsOnTopOfTag = [
    {
      text: "Start timer",
      color: theme.color.veryLightGrey,
      onPress: () => {
        console.log("Start timer");
      },
    },
    {
      text: "Edit",
      color: theme.color.mediumGrey,
      onPress: handleEditClick,
    },
  ];

  // --- FETCH CHILD TAGS HERE, if needed ---
  // If your children are mere IDs in `activityData.children`, you can fetch them:
  const isActivity = activityData.moduleType === moduleTypeEnum.activity;

  const expandAnimOfParentOfChild = useDerivedValue(
    () => expandAnim.value * expandAnimOfParent.value,
  );

  return (
    <Animated.View style={[animStyles.listModule]}>
      {/* If level=0, we might skip rendering an item at the root */}
      {level !== 0 &&
        (isActivity ? (
          <ActivityItem
            activityName={activityData.title}
            onExpand={handleExpand}
            onFocus={() => {
              setFocusedPath(path);
              onFocusAdditional();
            }}
            onUnfocus={() => {
              popFocusStack();
              onFocusAdditional();
            }}
            isFocused={isFocused}
            hasChildren={hasChildren}
            style={styles.activityItem}
            expandAnimParam={expandAnim}
            focusAnim={focusAnim}
            visibleAnim={visibleAnim}
            activityColor={activityData.colorPreset}
            buttons={buttonsOnTopOfTag}
          />
        ) : (
          <ProjectItem
            activityName={activityData.title}
            onExpand={handleExpand}
            onFocus={() => {
              setFocusedPath(path);
              onFocusAdditional();
            }}
            onUnfocus={() => {
              popFocusStack();
              onFocusAdditional();
            }}
            isFocused={isFocused}
            style={styles.activityItem}
            focusAnim={focusAnim}
            visibleAnim={visibleAnim}
            activityColor={activityData.colorPreset}
            buttons={buttonsOnTopOfTag}
          />
        ))}

      {/* Children container for Activities. 
          If your Project also has sub-items, you can handle that similarly. */}
      {isActivity && (
        <Animated.View
          style={[styles.childrenContainer, animStyles.childrenContainer]}
        >
          <Animated.View
            style={[styles.lineContainer, animStyles.lineContainer]}
          >
            <Animated.View style={[styles.line, animStyles.line]} />
          </Animated.View>

          <View style={styles.list}>
            {/* The "AddItem" row */}
            <AddItem
              onClickAddButton={handleAddClick}
              style={animStyles.addItem}
            />

            {isExpandAnimGreaterThanZero && (
              <FlatList
                data={activityData.children}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item: childID }) => {
                  // For each child, recursively render ListModule
                  return (
                    <ListModule
                      moduleID={childID}
                      level={level + 1}
                      isLastInList={
                        childID ===
                        activityData.children[activityData.children.length - 1]
                      } // or your own logic
                      path={`${path}/${childID}`}
                      addAnim={addAnim}
                      onFocusAdditional={onFocusAdditional}
                      expandAnimOfParent={expandAnimOfParentOfChild}
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
