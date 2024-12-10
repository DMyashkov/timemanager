import { View, Text } from "react-native";
import useStyles from "./styles/pickActivityStyles";
import { useTheme } from "@context/ThemeContext";
import HeaderModal from "@/components/basic/headerModal/headerModal";

export default function PickActivity() {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <HeaderModal
        title="Change Activity"
        leftText="Cancel"
        rightText="Choose"
      />
    </View>
  );
}
