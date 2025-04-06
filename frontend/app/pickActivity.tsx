import { View, Text, FlatList, Modal } from "react-native";
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
import { useTagContext } from "@/context/TagContext";
import type { TagData } from "@/constants/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";

interface PickActivityProps {
  visible: boolean;
  onClose: () => void;
  onActivitySelected: (activity: TagData) => void;
}

export default function PickActivity({ visible, onClose, onActivitySelected }: PickActivityProps) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { getTag } = useTagContext();
  const [searchText, setSearchText] = useState("");

  const [addScreen, setAddScreen] = useState<boolean>(false);
  const addAnim = useSharedValue(0);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  const createPickActivityButtons = (activity: TagData) => [
    {
      text: "Pick",
      color: theme.color.veryLightGrey,
      onPress: () => {
        onActivitySelected(activity);
        onClose();
      },
    },
    {
      text: "Edit",
      color: theme.color.mediumGrey,
      onPress: () => {
        router.push({
          pathname: "/add",
          params: {
            parentId: activity.id,
            rawIsAddScreen: "false"
          }
        });
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <HeaderModal
          title="Change Activity"
          leftText="Cancel"
          isThereRightButton={false}
          isThereSearchBar={true}
          searchText={searchText}
          setSearchText={setSearchText}
          onPressLeft={onClose}
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
    </Modal>
  );
}
