import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacityBase,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Switch from "@assets/icons/switch.svg";
import Edit from "@assets/icons/edit.svg";

import Header from "@components/header/header";
import Tomato from "@assets/icons/tomato.svg";
import { useTheme } from "@context/ThemeContext";
import ClearModeIcon from "@assets/icons/circle-check-regular.svg";
import FullModeIcon from "@assets/icons/circle-check-solid.svg";
import ThreeDots from "@assets/icons/three-dots.svg";
import { useEffect, useState } from "react";
import useStyles from "./styles/watchStyles";
import Tag from "@components/tag/tagComponent";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Watch() {
  const additionalStyleConstants = {
    switchIconSize: 14,
    editIconSize: 15,
  };
  const { theme } = useTheme();
  const [fullMode, setFullMode] = useState<boolean>(false);
  const styles = useStyles();

  const fullModeAnim = useSharedValue(0);

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

  return (
    <View style={styles.watchScreen}>
      <Header
        title="Focus"
        additionalTitleStyles={{ color: theme.color.red }}
        buttons={[
          {
            id: "pomodoro",
            iconElement: (
              <Tomato height={28} width={28} fill={theme.color.red} />
            ),
            onPress: () => console.log("Pomodoro pressed"),
          },
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
            iconElement: (
              <ThreeDots height={25} width={18} fill={theme.color.red} />
            ),
            onPress: () => console.log("Settings pressed"),
          },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.emptyView} />
        <View style={styles.clock}>
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
            <Tag />
            <Tag isProject={true} />
            <TouchableOpacity>
              <Edit
                width={additionalStyleConstants.editIconSize}
                height={additionalStyleConstants.editIconSize}
                fill={theme.color.presets.green.medium}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.time}>25:43</Text>
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
            <TouchableOpacity
              style={styles.filledButton}
              onPress={() => console.log("Button 1 pressed")}
            >
              <Text style={styles.textInsideButton}>Lap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lapNumberButton}>
              <Text style={styles.lapNumberText}>01</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtonContainer}>
            <TouchableOpacity
              style={styles.filledButton}
              onPress={() => console.log("Button 1 pressed")}
            >
              <Text style={styles.textInsideButton}>Break</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Animated.View style={[styles.lapsView, animStyles.lapsView]}>
        <View style={styles.lapsViewContent}>
          <FlatList
            data={[
              { id: 1, time: "12:34" },
              { id: 2, time: "12:34" },
              { id: 3, time: "12:34" },
              { id: 4, time: "12:34" },
              { id: 5, time: "12:34" },
            ]}
            renderItem={({ item }) => (
              <View style={styles.lapContainer}>
                <Text style={styles.lapText}>Problem {item.id}</Text>
                <Text style={styles.lapText}>{item.time}</Text>
              </View>
            )}
            ListFooterComponent={() => <View style={styles.separator} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Animated.View>
    </View>
  );
}
