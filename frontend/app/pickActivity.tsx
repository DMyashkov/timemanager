import { View, Text, FlatList } from "react-native";
import useStyles from "./styles/pickActivityStyles";
import { useTheme } from "@context/ThemeContext";
import HeaderModal from "@/components/header/headerModal/headerModal";
import { Suspense, useCallback, useEffect, useState } from "react";
import { FocusProvider } from "@/context/FocusContext";
import ListModule from "@/components/module/listModule/listModule";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { getTableConfig } from "drizzle-orm/mysql-core";
import { useTagContext } from "@/context/TagContext";
import type { TagData } from "@/constants/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";

export default function PickActivity() {
  const styles = useStyles();
  const { theme } = useTheme();
  const { getTag } = useTagContext();
  const [searchText, setSearchText] = useState("");
  const { onSelect } = useLocalSearchParams();

  const [addScreen, setAddScreen] = useState<boolean>(false);
  const addAnim = useSharedValue(0);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  const handleActivitySelected = (activity: TagData) => {
    if (onSelect === "watch") {
      const displayActivity = {
        id: activity.id,
        title: activity.title,
        parent: activity.parent
          ? {
              id: activity.parent,
              title: "Loading...",
            }
          : undefined,
      };

      router.push({
        pathname: "/watch",
        params: {
          selectedActivity: JSON.stringify(displayActivity),
        },
      });
    }
  };

  const createPickActivityButtons = (activity: TagData) => [
    {
      text: "Pick",
      color: theme.color.veryLightGrey,
      onPress: () => handleActivitySelected(activity),
    },
    {
      text: "Edit",
      color: theme.color.mediumGrey,
      onPress: () => {
        router.push({
          pathname: "/add",
          params: {
            parentId: activity.id,
            rawIsAddScreen: "false",
          },
        });
      },
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderModal
        title="Change Activity"
        leftText="Cancel"
        isThereRightButton={false}
        isThereSearchBar={true}
        searchText={searchText}
        setSearchText={setSearchText}
        onPressLeft={() => {
          router.back();
          console.log("Cancel");
        }}
      />
      <FocusProvider>
        <FlatList
          data={[{ id: 0 }]} // Ensure item has an `id` field
          keyExtractor={(item) => String(item.id)}
          renderItem={() => (
            <ListModule
              addAnim={addAnim}
              onFocusAdditional={() => setAddScreen(false)}
              moduleID={0} // Root node
              customButtons={createPickActivityButtons}
            />
          )}
          style={styles.listView}
        />
      </FocusProvider>
    </View>
  );
}
