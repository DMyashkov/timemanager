import { Tabs } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import Stopwatch from "@assets/icons/stopwatch.svg";
import Workplace from "@assets/icons/workplace.svg";

export default function TabsLayout() {
  const { theme } = useTheme();
  const tabIconSize = 24;
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
      <Tabs.Screen
        name="watch"
        options={{
          tabBarIcon: ({ color }) => (
            <Stopwatch height={tabIconSize} width={tabIconSize} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workplace"
        options={{
          tabBarIcon: ({ color }) => (
            <Workplace height={tabIconSize} width={tabIconSize} fill={color} />
          ),
        }}
      />
      <Tabs.Screen name="styles/watchStyles" options={{ href: null }} />
    </Tabs>
  );
}
