import { Tabs } from "expo-router";
import { useTheme } from "@context/ThemeContext";

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: theme.color.veryLightGrey,
        tabBarInactiveBackgroundColor: theme.color.veryLightGrey,
        tabBarActiveTintColor: theme.color.red,
        tabBarInactiveTintColor: theme.color.darkGrey,
      }}
    >
      <Tabs.Screen name="watch" />
      <Tabs.Screen name="workplace" />
      <Tabs.Screen name="styles/watchStyles" options={{ href: null }} />
    </Tabs>
  );
}
