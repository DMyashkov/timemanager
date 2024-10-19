import Header from "@components/header/header";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import { ScrollView, StyleSheet, View } from "react-native";

export default function WorkplaceScreen() {
  return (
    <View style={styles.workplaceScreen}>
      <Header
        title="Workplace"
        buttons={[
          {
            id: "bars",
            iconElement: <Bars height={23} width={23} />,
            onPress: () => console.log("Button 2 pressed"),
          },
          {
            id: "plus",
            iconElement: <Plus height={25} width={23} />,
            onPress: () => console.log("Button 1 pressed"),
          },
        ]}
        showSearchBar={true}
      />
      <ScrollView></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  workplaceScreen: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
