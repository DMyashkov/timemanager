import Header from "@components/header/header";
import ActivityItem from "@components/module/activityItem/activityItem";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import { Easing, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import ListModule from "@/components/module/listModule/listModule";
import { FocusProvider } from "@context/FocusContext";
import { useEffect, useRef, useState } from "react";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function WorkplaceScreen() {
  const { theme } = useTheme();
  const [addScreen, setAddScreen] = useState<boolean>(false);
  const addAnim = useSharedValue(0);
  useEffect(() => {
    addAnim.value = withTiming(Number(addScreen), { duration: 250 });
  }, [addAnim, addScreen]);

  const animStyles = {
    plusContainer: useAnimatedStyle(() => ({
      transform: [
        {
          rotate: `${interpolate(addAnim.value, [0, 1], [0, 45])}deg`,
        },
      ],
    })),
  };

  return (
    <View style={styles.workplaceScreen}>
      {/* <View style={styles.shadow} /> */}
      <Header
        title="Workplace"
        buttons={[
          {
            id: "bars",
            iconElement: (
              <Bars height={23} width={23} fill={theme.color.black} />
            ),
            onPress: () => console.log("Button 2 pressed"),
          },
          {
            id: "plus",
            iconElement: (
              <Animated.View style={[animStyles.plusContainer]}>
                <Plus height={25} width={23} fill={theme.color.black} />
              </Animated.View>
            ),
            onPress: () => {
              setAddScreen(!addScreen);
            },
          },
        ]}
        showSearchBar={true}
      />
      <FocusProvider>
        <FlatList
          data={[{ key: "single-item" }]} // Array with one element
          renderItem={() => (
            <ListModule
              addScreen={addScreen}
              addAnim={addAnim}
              onFocusAdditional={() => setAddScreen(false)}
            />
          )}
          keyExtractor={(item) => item.key}
          style={styles.listView}
        />
      </FocusProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  workplaceScreen: {
    backgroundColor: "#fff",
    flex: 1,
    zIndex: -1,
    // backgroundColor: "red",
  },
  listView: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  shadow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#000",
    opacity: 0.5,
  },
});
