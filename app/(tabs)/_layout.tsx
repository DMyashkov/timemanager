import { Tabs } from "expo-router";

export default () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="workplace" />
    </Tabs>
  );
};
