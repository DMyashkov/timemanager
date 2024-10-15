import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@components/header/header";

const WorkplaceScreen = () => {
  return (
    <>
      <Header
        title="Workplace"
        buttons={[
          {
            id: "1",
            icon: "plus",
            onPress: () => console.log("Button 1 pressed"),
          },
          {
            id: "2",
            icon: "plus",
            onPress: () => console.log("Button 2 pressed"),
          },
          {
            id: "3",
            icon: "plus",
            onPress: () => console.log("Button 3 pressed"),
          },
        ]}
      />
    </>
  );
};

export default WorkplaceScreen;
