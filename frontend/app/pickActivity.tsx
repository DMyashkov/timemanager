import { View, Text } from "react-native";
import useStyles from "./styles/pickActivityStyles";
import { useTheme } from "@context/ThemeContext";
import HeaderModal from "@/components/header/headerModal/headerModal";
import { useState } from "react";

export default function PickActivity() {
  const styles = useStyles();
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState("");

  return (
    <View style={styles.container}>
      <HeaderModal
        title="Change Activity"
        leftText="Cancel"
        rightText="Choose"
        isThereSearchBar={true}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    </View>
  );
}
