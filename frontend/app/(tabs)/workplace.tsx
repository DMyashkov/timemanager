import Header from "@/components/header/headerBasic/header";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import { FlatList, StyleSheet, View, Text } from "react-native";
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
import { useTagContext } from "@/context/TagContext";
import type { TagData } from "@/constants/interfaces";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { schema } from "@/db/schema";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export default function WorkplaceScreen() {
  const { theme } = useTheme();
  const { getTag } = useTagContext(); // Use context function to fetch tag
  const [rootNode, setRootNode] = useState<TagData | null>(null);
  const [loading, setLoading] = useState(true);

  // State and animation for the add screen toggle
  const [addScreen, setAddScreen] = useState(false);
  const addAnim = useSharedValue(0);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: schema });
  // useDrizzleStudio(db);

  const { data } = useLiveQuery(drizzleDb.select().from(schema.tags));
  const [renderValue, rerender] = useState(0);

  useEffect(() => {
    console.log(data);
    rerender((prev) => prev + 1);
  }, [data]);

  // Fetch the root node (id = 0) when the component mounts
  useEffect(() => {
    (async () => {
      try {
        const root = await getTag(0); // Fetch the root node from SQLite
        if (root) {
          setRootNode(root);
        } else {
          console.error("Root node (id=0) not found");
        }
      } catch (error) {
        console.error("Error fetching root node:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [getTag]);

  // Animate the plus icon on `addScreen` toggle
  useEffect(() => {
    addAnim.value = withTiming(addScreen ? 1 : 0, { duration: 250 });
  }, [addScreen, addAnim]);

  // Animated rotation for plus button
  const animStyles = {
    plusContainer: useAnimatedStyle(() => ({
      transform: [
        { rotate: `${interpolate(addAnim.value, [0, 1], [0, 45])}deg` },
      ],
    })),
  };

  // Show loading screen while fetching root node
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error if no root node was found
  if (!rootNode) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: Root node (id=0) not found.</Text>
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
            onPress: () => console.log("Bars button pressed"),
          },
          {
            id: "plus",
            iconElement: (
              <Animated.View style={[animStyles.plusContainer]}>
                <Plus height={25} width={23} fill={theme.color.black} />
              </Animated.View>
            ),
            onPress: () => setAddScreen((prev) => !prev),
          },
        ]}
        showSearchBar
      />

      <FocusProvider>
        <FlatList
          data={[rootNode]} // Single-item array
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ListModule
              addScreen={addScreen}
              addAnim={addAnim}
              onFocusAdditional={() => setAddScreen(false)}
              activityData={item} // Pass the root node into ListModule
            />
          )}
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
});
