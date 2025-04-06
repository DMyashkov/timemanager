import { View, Text, FlatList } from "react-native";
import useStyles from "./styles/pickActivityStyles";
import { useTheme } from "@context/ThemeContext";
import HeaderModal from "@/components/header/headerModal/headerModal";
import { Suspense, useEffect, useState } from "react";
import { FocusProvider } from "@/context/FocusContext";
import ListModule from "@/components/module/listModule/listModule";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
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
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  const [rootTag, setRootTag] = useState<TagData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const root = await getTag(db, 0);
        if (root) {
          setRootTag(root);
        } else {
          console.error("Root node (id=0) not found");
        }
      } catch (error) {
        console.error("Error fetching root node:", error);
      }
    })();
  }, [getTag, db]);

  if (!rootTag) {
    return <Text>Loading...</Text>;
  }

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
            />
          )}
          style={styles.listView}
        />
      </FocusProvider>
    </View>
  );
}
