import { Tabs } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import Stopwatch from "@assets/icons/stopwatch.svg";
import Workplace from "@assets/icons/workplace.svg";
import House from "@assets/icons/house.svg";
import Calendar from "@assets/icons/calendar.svg";
import CalendarDays from "@assets/icons/calendar-days.svg";
import CalendarWeek from "@assets/icons/calendar-week.svg";
import { FocusedDateProvider } from "@/context/focusedDateContext";

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
        name="tasks"
        options={{
          tabBarIcon: ({ color }) => (
            <House height={tabIconSize} width={tabIconSize} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ color }) => (
            <CalendarDays
              height={tabIconSize}
              width={tabIconSize}
              fill={color}
            />
          ),
        }}
      />

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
      <Tabs.Screen name="styles/tasksStyles" options={{ href: null }} />
      <Tabs.Screen name="styles/calendarStyles" options={{ href: null }} />
    </Tabs>
  );
}
