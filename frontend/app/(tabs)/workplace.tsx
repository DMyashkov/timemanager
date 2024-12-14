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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WorkplaceScreen() {
  const { theme } = useTheme();
  const [addScreen, setAddScreen] = useState<boolean>(false);
  const [data, setData] = useState(null); // Store the tree data
  const [loading, setLoading] = useState<boolean>(true); // Indicate loading state
  const [error, setError] = useState<string | null>(null); // Store any error message

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

  // 🛠️ **Fetch the tag tree from the backend**
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/tags/tree/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );
        console.log(
          "Tree data loaded:",
          JSON.stringify(response.data, null, 2),
        );
        setData(response.data[0]); // Assume the first item is the root node
        setLoading(false);
      } catch (error) {
        setError("Failed to load data");
        console.error("Error fetching tree data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.noDataContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

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
          data={[{ key: "single-item" }]} // Array with one element
          renderItem={() => (
            <ListModule
              addScreen={addScreen}
              addAnim={addAnim}
              onFocusAdditional={() => setAddScreen(false)}
              activityData={data} // Pass the fetched data as props
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
  shadow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#000",
    opacity: 0.5,
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
