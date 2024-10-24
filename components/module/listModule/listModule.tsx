import { View, Animated, Easing } from "react-native";
import useStyles from "./styles";
// import { useTheme } from "@context/ThemeContext";
import ActivityItem from "@components/module/activityItem/activityItem";
import { useEffect, useRef, useState } from "react";
import { useFocus } from "@/context/FocusContext";
import AddItem from "../addItem/addItem";

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
  addAnim?: Animated.Value;
};

export default function Activity({
  activityData = data,
  level = 0,
  isFirstInList = true,
  isLastInList = true,
  path = "/root",
  addScreen = false,
  onClickAddButton = () => {},
  addAnim = useRef(new Animated.Value(0)).current,
}: ActivityProps) {
  const styles = useStyles();
  // const { theme } = useTheme();

  // const { focusedLevel, setFocusedLevel } = useFocus();
  const { focusedPath, setFocusedPath, popFocusStack } = useFocus();
  const isFocused = path === focusedPath;
  const isRoot = path === "/root";

  const shrinkAnim = useRef(new Animated.Value(0)).current; // Original width
  const shouldShrink = !path.startsWith(focusedPath);
  const [isExpanded, setIsExpanded] = useState<boolean>(isRoot);

  useEffect(() => {
    Animated.timing(shrinkAnim, {
      toValue: shouldShrink ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [shouldShrink, shrinkAnim]);

  const focusAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFocused, focusAnim]);

  const combinedHeightAnim = Animated.multiply(
    shrinkAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 82],
    }),
  );

  return (
    <Animated.View
      style={{
        marginTop: shrinkAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, isFirstInList ? 0 : -4],
        }),
        marginBottom: shrinkAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, isLastInList ? 0 : -4],
        }),
      }}
    >
      {level !== 0 && (
        <ActivityItem
          activityName={activityData.title}
          onExpand={() => {
            setIsExpanded(!isExpanded);
          }}
          onFocus={() => {
            setFocusedPath(path);
          }}
          onUnfocus={() => {
            popFocusStack();
          }}
          isExpanded={isExpanded}
          isFocused={isFocused}
          hasChildren={!!activityData.activities?.length}
          style={[
            styles.activityItem,
            {
              height: combinedHeightAnim,
              marginBottom: shrinkAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 0],
              }),
            },
          ]}
        />
      )}
      {activityData.activities?.length && isExpanded && (
        <Animated.View
          style={[
            styles.childrenContainer,
            {
              marginTop: shrinkAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [!isRoot ? 8 : 0, 0],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.lineContainer,
              {
                width: shrinkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [!isRoot ? 35 : 0, 0],
                }),
              },
            ]}
          >
            <Animated.View
              style={[
                styles.line,
                {
                  opacity: shrinkAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [!isRoot ? 1 : 0, 0],
                  }),
                },
              ]}
            />
          </Animated.View>
          <View style={[styles.list]}>
            <AddItem
              style={{
                marginBottom: addAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 2],
                }),
                marginTop: addAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 0],
                }),
                height: addAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 40],
                }),
                zIndex: 2,
              }}
              onClickAddButton={onClickAddButton}
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
              />
            ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
