import { View, Text, FlatList } from "react-native";
import useStyles from "./styles/pickActivityStyles";
import { useTheme } from "@context/ThemeContext";
import HeaderModal from "@/components/header/headerModal/headerModal";
import { useEffect, useState } from "react";
import { FocusProvider } from "@/context/FocusContext";
import ListModule from "@/components/module/listModule/listModule";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";

export default function PickActivity() {
  const styles = useStyles();
  const { theme } = useTheme();
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
        }}
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
