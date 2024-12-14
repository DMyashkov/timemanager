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

export default function WorkplaceScreen() {
  const { theme } = useTheme();

  // States for controlling UI
  const [addScreen, setAddScreen] = useState<boolean>(false);
  const [dataIndex, setDataIndex] = useState(null); // DataIndex from backend
  const [data, setData] = useState(null); // Tag tree data from backend
  const [loading, setLoading] = useState<boolean>(true); // Indicates if data loading is in progress
  const [error, setError] = useState<string | null>(null); // Error message if something goes wrong

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

  // Fetch DataIndex first
  useEffect(() => {
    const fetchDataIndexAndData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Attempt to get DataIndex
        const indexResponse = await getDataIndex();
        setDataIndex(indexResponse.data);
      } catch (err) {
        console.error("Error fetching DataIndex:", err);
        setError("Failed to load DataIndex. Attempting to rebuild...");

        // Attempt to rebuild if DataIndex doesn't exist
        try {
          const rebuildResponse = await rebuildDataIndex();
          console.log("DataIndex rebuilt successfully:", rebuildResponse.data);

          // After rebuilding, fetch DataIndex again
          const indexAgainResponse = await getDataIndex();
          setDataIndex(indexAgainResponse.data);
        } catch (rebuildErr) {
          console.error("Error rebuilding DataIndex:", rebuildErr);
          setError("Failed to rebuild DataIndex. Please try again later.");
          setLoading(false);
          return; // Stop if we can't get the DataIndex
        }
      }

      // Now fetch the tag tree data (the actual hierarchical data)
      try {
        const token = await AsyncStorage.getItem("authToken");
        const treeResponse = await axios.get(
          "http://127.0.0.1:8000/api/tags/tree/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );
        // Assume the first item is the root node
        setData(treeResponse.data[0]);
        setLoading(false);
      } catch (treeError) {
        setError("Failed to load tree data");
        console.error("Error fetching tree data:", treeError);
        setLoading(false);
      }
    };

    fetchDataIndexAndData();
  }, []);

  // Render different states based on loading/error/data presence
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Data and DataIndex...</Text>
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

  if (!dataIndex || !data) {
    return (
      <View style={styles.noDataContainer}>
        <Text>No Data or Data Index available</Text>
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
          data={[{ key: "single-item" }]} // Just one item that renders the ListModule
          renderItem={() => (
            <ListModule
              addScreen={addScreen}
              addAnim={addAnim}
              onFocusAdditional={() => setAddScreen(false)}
              dataIndex={dataIndex} // Pass the loaded DataIndex
              activityData={data} // Pass the fetched Tag tree data
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
