import Header from "@/components/header/headerBasic/header";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import { Easing, FlatList, StyleSheet, View, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import ListModule from "@/components/module/listModule/listModule";
import { FocusProvider } from "@context/FocusContext";
import { useEffect, useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getDataIndex, rebuildDataIndex } from "@/utils/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTagContext } from "@/context/TagContext";

export default function WorkplaceScreen() {
  const { theme } = useTheme();

  // States for controlling UI
  const [addScreen, setAddScreen] = useState<boolean>(false);

  const addAnim = useSharedValue(0);

  // Animate the plus icon on addScreen toggle
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

  const { treeData, dataIndex } = useTagContext();

  // Render different states based on loading/error/data presence
  if (!treeData || !dataIndex) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Data and DataIndex...</Text>
      </View>
    );
  }
  // pretty print data
  console.log("Pretty Printed data:", JSON.stringify(treeData, null, 2));
  console.log("Pretty Printed dataIndex:", JSON.stringify(dataIndex, null, 2));

  return (
    <View style={styles.workplaceScreen}>
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
          data={[{ key: "single-item" }]} // Just one item that renders the ListModule
          renderItem={() => (
            <ListModule
              addScreen={addScreen}
              addAnim={addAnim}
              onFocusAdditional={() => setAddScreen(false)}
              dataIndex={dataIndex} // Pass the loaded DataIndex
              activityData={treeData} // Pass the fetched Tag tree data
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
  },
  listView: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
