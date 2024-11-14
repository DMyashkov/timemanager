import { Stack, router } from "expo-router";
import * as Font from "expo-font";
import { FONTS } from "@/constants/fonts";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "@context/ThemeContext";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { Text } from "react-native";

const loadFonts = () => {
  return Font.loadAsync({
    [FONTS.regular]: require("../assets/fonts/SF-Pro-Text-Regular.otf"),
    [FONTS.medium]: require("../assets/fonts/SF-Pro-Text-Medium.otf"),
    [FONTS.semibold]: require("../assets/fonts/SF-Pro-Text-Semibold.otf"),
    [FONTS.bold]: require("../assets/fonts/SF-Pro-Text-Bold.otf"),
  });
};

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ contentStyle: { backgroundColor: "red" } }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add"
          options={{
            presentation: "modal",
            headerLeft: () => (
              <SysButton
                text="Cancel"
                onPress={() => {
                  router.back();
                }}
              />
            ),
            headerRight: () => (
              <SysButton
                text="Save"
                onPress={() => {
                  router.back();
                }}
              />
            ),
            headerTitle: (props) => (
              <Text
                {...props}
                style={{
                  fontSize: useTheme().theme.fontSize.medium,
                  fontFamily: useTheme().theme.font.semibold,
                }}
              >
                Create tag
              </Text>
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
