import Header from "@components/header/header";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import ListModule from "@/components/module/listModule/listModule";
import { FocusProvider } from "@context/FocusContext";
import { useEffect, useRef, useState } from "react";

export default function WorkplaceScreen() {
  const { theme } = useTheme();
  const [addScreen, setAddScreen] = useState<boolean>(false);
  const addAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(addAnim, {
      toValue: addScreen ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [addAnim, addScreen]);

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
              <Animated.View
                style={{
                  transform: [
                    {
                      // rotate: `${addAnim.interpolate({
                      //   inputRange: [0, 1],
                      //   outputRange: [47, 45],
                      // })}deg`,
                      rotate: addAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "45deg"], // Ensure degrees are strings
                      }),
                    },
                  ],
                }}
              >
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
        <View style={styles.listView}>
          <ListModule
            addScreen={addScreen}
            addAnim={addAnim}
            onFocusAdditional={() => setAddScreen(false)}
          />
        </View>
      </FocusProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  workplaceScreen: {
    backgroundColor: "#fff",
    flex: 1,
    zIndex: -1,
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
