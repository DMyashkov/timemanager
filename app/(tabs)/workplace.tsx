import Header from "@components/header/header";
import Plus from "@assets/icons/plus.svg";
import Bars from "@assets/icons/bars.svg";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import Activity from "@/components/module/listModule/listModule";
import { FocusProvider } from "@context/FocusContext";

export default function WorkplaceScreen() {
  const { theme } = useTheme();
  return (
    <View style={styles.workplaceScreen}>
      <Header
        title="Workplace"
        buttons={[
          {
            id: "bars",
            iconElement: (
              <Bars height={23} width={23} fill={theme.color.black} />
            ),
            onPress: () => console.log("Button 2 pressed"),
          },
          {
            id: "plus",
            iconElement: (
              <Plus height={25} width={23} fill={theme.color.black} />
            ),
            onPress: () => console.log("Button 1 pressed"),
          },
        ]}
        showSearchBar={true}
      />
      <FocusProvider>
        <View style={styles.listView}>
          <Activity />
        </View>
      </FocusProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  workplaceScreen: {
    backgroundColor: "#fff",
    flex: 1,
  },
  listView: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
