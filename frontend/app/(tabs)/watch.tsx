import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import type { Button } from "@constants/interfaces";
import Switch from "@assets/icons/switch.svg";
import Edit from "@assets/icons/edit.svg";
import At from "@assets/icons/at.svg";
import XSquare from "@assets/icons/xsquare.svg";
import type { Color } from "@constants/interfaces";
import { router, useLocalSearchParams, usePathname } from "expo-router";

import Header from "@/components/header/headerBasic/header";
import Tomato from "@assets/icons/tomato.svg";
import { useTheme } from "@context/ThemeContext";
import ClearModeIcon from "@assets/icons/circle-check-regular.svg";
import FullModeIcon from "@assets/icons/circle-check-solid.svg";
import ThreeDots from "@assets/icons/three-dots.svg";
import { useEffect, useState } from "react";
import useStyles from "./styles/watchStyles";
import Tag from "@components/tag/tagComponent";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAuthContext } from "@/context/AuthContext";
import TagIcon from "@assets/icons/tag.svg";
import { moduleTypeEnum, type TagData } from "@/constants/interfaces";
import PickActivity from "@/app/pickActivity";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useTagContext } from "@/context/TagContext";

export default function Watch() {
  const additionalStyleConstants = {
    switchIconSize: 14,
    editIconSize: 15,
  };
  const { isLoggedIn } = useAuthContext();
  const { theme } = useTheme();
  const [fullMode, setFullMode] = useState<boolean>(false);
  const [selectedActivityID, setSelectedActivityID] = useState<number | null>(
    null,
  );
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(
    null,
  );
  const [isPickActivityVisible, setIsPickActivityVisible] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const styles = useStyles();
  const pathname = usePathname();
  const params = useLocalSearchParams();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle session start/stop
  const handleSessionToggle = () => {
    setIsTimerRunning((prev) => !prev);
  };

  // Handle navigation to PickActivity
  const handlePickActivity = () => {
    setIsPickActivityVisible(true);
  };

  const handleActivitySelected = (activity: TagData) => {
    if (activity.moduleType === moduleTypeEnum.project) {
      setSelectedActivityID(activity.parent);
      setSelectedProjectID(activity.id);
    } else {
      setSelectedActivityID(activity.id);
      setSelectedProjectID(null);
    }
  };

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  const { data: activityData } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.id, selectedActivityID ?? 0)),
    [selectedActivityID],
  );

  const { data: projectData } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.id, selectedProjectID ?? 0)),
    [selectedProjectID],
  );

  const { parseTag } = useTagContext();

  const [activityNode, setActivityNode] = useState<TagData | null>(null);
  const [projectNode, setProjectNode] = useState<TagData | null>(null);

  useEffect(() => {
    try {
      if (activityData) {
        // console.log("moduleData", moduleData);
        const parsedData = parseTag(activityData);
        if (parsedData?.id === 0) {
          setActivityNode(null);
        } else {
          setActivityNode(parsedData);
        }
      }
    } catch (error) {
      console.error("Error fetching root node:", error);
    }
  }, [parseTag, activityData]);

  useEffect(() => {
    try {
      if (projectData) {
        const parsedData = parseTag(projectData);
        if (parsedData?.id === 0) {
          setProjectNode(null);
        } else {
          setProjectNode(parsedData);
        }
      }
    } catch (error) {
      console.error("Error fetching root node:", error);
    }
  }, [parseTag, projectData]);

  // Handle edit activity
  const handleEditActivity = () => {
    handlePickActivity(); // Reuse the same flow for editing
  };

  useEffect(() => {
    // Listen for URL changes
    if (pathname === "/watch" && params.selectedActivity) {
      try {
        const activity = JSON.parse(params.selectedActivity as string);
        setSelectedActivityID(activity);
      } catch (e) {
        console.error("Failed to parse selected activity:", e);
      }
    }
  }, [pathname, params.selectedActivity]);

  const fullModeAnim = useSharedValue(0);
  const resetTimer = () => {
    setTimerSeconds(0);
  };

  const screenHeight = Dimensions.get("window").height;
  const lapsViewMaxHeight =
    (screenHeight * Number.parseFloat(styles.lapsView.height)) / 100;

  useEffect(() => {
    fullModeAnim.value = withTiming(fullMode ? 1 : 0, { duration: 300 });
  }, [fullMode, fullModeAnim]);

  const animStyles = {
    lapsView: useAnimatedStyle(() => ({
      height: fullModeAnim.value * lapsViewMaxHeight,
      marginTop: fullModeAnim.value * styles.lapsView.marginTop,
    })),
  };

  // Get button color based on selected tag
  const getButtonColor = () => {
    if (activityNode) {
      return theme.color.presets[activityNode.colorPreset].medium;
    }
    return theme.color.darkRed;
  };

  // Handle session terminate
  const handleSessionTerminate = () => {
    Alert.alert(
      "End Continious Session",
      "Are you sure you want to terminate this continuous session?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End",
          style: "destructive",
          onPress: () => {
            setIsSessionRunning(false);
            setIsTimerRunning(false);
            setSelectedActivityID(null);
            setSelectedProjectID(null);
            setTimerSeconds(0);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const headerButtons: Button[] = [];
  if (isSessionRunning) {
    headerButtons.push({
      id: "terminate",
      iconElement: <XSquare height={29} width={29} fill={theme.color.red} />,
      onPress: handleSessionTerminate,
    });
  }

  headerButtons.push(
    {
      id: "clearMode",
      iconElement: !fullMode ? (
        <FullModeIcon height={25} width={25} fill={theme.color.red} />
      ) : (
        <ClearModeIcon height={25} width={25} fill={theme.color.red} />
      ),
      onPress: () => {
        setFullMode(!fullMode);
      },
    },
    {
      id: "settings",
      iconElement: <ThreeDots height={25} width={18} fill={theme.color.red} />,
      onPress: () => {
        // settings action here
      },
    },
  );

  const buttonAnim = useSharedValue(0);

  useEffect(() => {
    buttonAnim.value = withTiming(isTimerRunning ? 1 : 0, { duration: 300 });
  }, [isTimerRunning, buttonAnim]);

  const buttonAnimStyles = {
    runningButtons: useAnimatedStyle(() => ({
      opacity: buttonAnim.value,
      position: "absolute",
      width: "100%",
      transform: [{ scale: 0.8 + buttonAnim.value * 0.2 }],
    })),
    idleButtons: useAnimatedStyle(() => ({
      opacity: 1 - buttonAnim.value,
      position: "absolute",
      width: "100%",
      transform: [{ scale: 1 - buttonAnim.value * 0.2 }],
    })),
  };

  return (
    <View style={styles.watchScreen}>
      <Header
        title={
          !isSessionRunning
            ? "Start Focus Timer"
            : isTimerRunning
              ? "Focus"
              : "Break"
        }
        additionalTitleStyles={{
          color: isTimerRunning ? theme.color.red : theme.color.darkestGrey,
        }}
        buttons={headerButtons}
      />
      <View style={styles.content}>
        <View style={styles.emptyView} />
        <View style={styles.clock}>
          {selectedActivityID ? (
            <View
              style={[
                styles.tagContainer,
                {
                  marginRight:
                    -styles.tagContainer.gap -
                    additionalStyleConstants.editIconSize,
                },
              ]}
            >
              {activityNode && (
                <Tag
                  text={activityNode.title}
                  colorPallete={
                    isTimerRunning
                      ? theme.color.presets[activityNode.colorPreset]
                      : {
                          light: theme.color.lightestGrey,
                          medium: theme.color.darkestGrey,
                          dark: theme.color.darkestGrey,
                        }
                  }
                />
              )}
              {projectNode && (
                <Tag
                  isProject={true}
                  text={projectNode.title}
                  colorPallete={
                    isTimerRunning
                      ? theme.color.presets[projectNode.colorPreset]
                      : {
                          light: theme.color.lightestGrey,
                          medium: theme.color.darkestGrey,
                          dark: theme.color.darkestGrey,
                        }
                  }
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  if (isTimerRunning) {
                    handlePickActivity();
                  } else {
                  }
                }}
                style={{
                  opacity: isTimerRunning ? 1 : 0,
                }}
              >
                <Edit
                  width={additionalStyleConstants.editIconSize}
                  height={additionalStyleConstants.editIconSize}
                  fill={
                    theme.color.presets[
                      projectNode?.colorPreset ??
                        activityNode?.colorPreset ??
                        "green"
                    ].dark
                  }
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.pickActivityButton}
              onPress={handlePickActivity}
            >
              <View style={styles.leftButtonContainer}>
                <TagIcon
                  style={styles.leftButtonTag}
                  fill={theme.color.darkestGrey}
                  width={23}
                  height={23}
                />
              </View>
              <Text style={styles.pickActivityText}>Pick activity</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.time}>{formatTime(timerSeconds)}</Text>
          <View
            style={[
              styles.bottomClockView,
              {
                marginLeft:
                  -styles.bottomClockView.gap -
                  additionalStyleConstants.switchIconSize,
              },
            ]}
          >
            <TouchableOpacity>
              <Switch
                style={styles.switchButton}
                fill={theme.color.darkGrey}
                width={additionalStyleConstants.switchIconSize}
                height={additionalStyleConstants.switchIconSize}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.secondTime}>4:17</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <View style={styles.leftButtonsContainer}>
            <Animated.View style={[buttonAnimStyles.runningButtons]}>
              <TouchableOpacity
                style={[
                  styles.filledButton,
                  { backgroundColor: getButtonColor() },
                ]}
                onPress={() => console.log("Lap pressed")}
              >
                <Text style={styles.textInsideButton}>Next</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={buttonAnimStyles.idleButtons}>
              {selectedActivityID && (
                <TouchableOpacity
                  style={styles.editBigButton}
                  onPress={handlePickActivity}
                >
                  <Edit
                    width={46}
                    height={80}
                    fill={theme.color.darkGrey}
                    style={{ marginBottom: 4, marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
          <View style={styles.rightButtonContainer}>
            <Animated.View style={[buttonAnimStyles.runningButtons]}>
              <TouchableOpacity
                style={[
                  styles.filledButton,
                  { backgroundColor: getButtonColor() },
                ]}
                onPress={handleSessionToggle}
              >
                <Text style={styles.textInsideButton}>Break</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={buttonAnimStyles.idleButtons}>
              <TouchableOpacity
                style={[
                  styles.filledButton,
                  { backgroundColor: theme.color.darkestGrey },
                ]}
                onPress={() => {
                  handleSessionToggle();
                  setIsSessionRunning(true);
                }}
              >
                <Text style={styles.textInsideButton}>Start</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
      <Animated.View style={[styles.lapsView, animStyles.lapsView]}>
        <View style={styles.lapsViewContent}>
          <FlatList
            data={[
              { id: 1, time: "0:01" },
              { id: 2, time: "0:03" },
              { id: 3, time: "0:05" },
              { id: 4, time: "0:10" },
            ]}
            renderItem={({ item }) => (
              <View style={styles.lapContainer}>
                <Text style={styles.lapText}>
                  {activityNode?.lapName} {item.id}
                </Text>
                <Text style={styles.lapText}>{item.time}</Text>
              </View>
            )}
            ListFooterComponent={() => <View style={styles.separator} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Animated.View>
      <PickActivity
        visible={isPickActivityVisible}
        onClose={() => {
          setIsPickActivityVisible(false);
        }}
        onActivitySelected={(activityData: TagData) => {
          handleActivitySelected(activityData);
          setIsSessionRunning(true);
          if (selectedActivityID) {
            resetTimer();
          }
          setIsTimerRunning(true);
        }}
        pickButtonText={selectedActivityID ? "Start new timer" : "Choose"}
      />
    </View>
  );
}
