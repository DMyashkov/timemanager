import Header from "@/components/header/headerBasic/header";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import ListModule from "@/components/module/listModule/listModule";
import { FocusProvider } from "@context/FocusContext";
import { useCallback, useEffect, useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useTagContext } from "@/context/TagContext";
import type { TagData } from "@/constants/interfaces";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { schema, tags } from "@/db/schema";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { eq } from "drizzle-orm";

export default function WorkplaceScreen() {
  const { theme } = useTheme();

  // State and animation for the add screen toggle
  const [addScreen, setAddScreen] = useState(false);
  const addAnim = useSharedValue(0);
  const emptyStateAnim = useSharedValue(0);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  const { data } = useLiveQuery(db.select().from(tags));
  // console.log("data", data);
  const [_, rerender] = useState(0);
  useEffect(() => {
    if (data) {
      // console.log("data", data);
      rerender((prev) => prev + 1);
    }
  }, [data]);

  // Animate empty state based on data length and addScreen state
  useEffect(() => {
    const shouldShowEmptyState = data?.length <= 1 && !addScreen;
    emptyStateAnim.value = withSpring(shouldShowEmptyState ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [data?.length, addScreen, emptyStateAnim]);

  const EmptyState = () => {
    const emptyStateStyles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      },
      text: {
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
        textAlign: "center",
        color: theme.color.darkGrey,
      },
      button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: theme.color.red,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.color.white,
      },
    });

    return (
      <View style={emptyStateStyles.container}>
        <Text style={emptyStateStyles.text}>
          No tags yet. Add your first tag
        </Text>
      </View>
    );
  };

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

  const emptyStateAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: emptyStateAnim.value,
      transform: [
        {
          translateY: interpolate(emptyStateAnim.value, [0, 1], [-20, 0]),
        },
      ],
    };
  });

  return (
    <View style={[styles.workplaceScreen]}>
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

      <View
        style={{
          flex: 1,
          backgroundColor: theme.color.white,
        }}
      >
        <FocusProvider>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                paddingTop: 20,
                justifyContent: "flex-start",
              },
              emptyStateAnimatedStyle,
            ]}
          >
            <EmptyState />
          </Animated.View>

          <FlatList
            data={[{ id: 0 }]} // Ensure item has an `id` field
            keyExtractor={(item) => String(item.id)}
            renderItem={() => (
              <ListModule
                addAnim={addAnim}
                onFocusAdditional={() => setAddScreen(false)}
                moduleID={0} // Root node
              />
            )}
            style={styles.listView}
          />
        </FocusProvider>
      </View>
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
