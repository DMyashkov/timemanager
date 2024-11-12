import { View, Text, StyleSheet } from "react-native";

import Header from "@components/header/header";
import Tomato from "@assets/icons/tomato.svg";
import { useTheme } from "@context/ThemeContext";
import ClearModeIcon from "@assets/icons/circle-check-regular.svg";
import FullModeIcon from "@assets/icons/circle-check-solid.svg";
import ThreeDots from "@assets/icons/three-dots.svg";
import { useState } from "react";
import useStyles from "./styles/watchStyles";
import Tag from "@components/tag/tagComponent";

export default function Watch() {
  const { theme } = useTheme();
  const [fullMode, setFullMode] = useState<boolean>(false);
  const styles = useStyles();

  return (
    <View style={styles.watchScreen}>
      <Header
        title="Focus"
        additionalTitleStyles={{ color: theme.color.red }}
        buttons={[
          {
            id: "pomodoro",
            iconElement: (
              <Tomato height={28} width={28} fill={theme.color.red} />
            ),
            onPress: () => console.log("Pomodoro pressed"),
          },
          {
            id: "clearMode",
            iconElement: !fullMode ? (
              <FullModeIcon height={25} width={25} fill={theme.color.red} />
            ) : (
              <ClearModeIcon height={25} width={25} fill={theme.color.red} />
            ),
            onPress: () => {
              setFullMode(!fullMode);
            },
          },
          {
            id: "settings",
            iconElement: (
              <ThreeDots height={25} width={18} fill={theme.color.red} />
            ),
            onPress: () => console.log("Settings pressed"),
          },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.clock}>
          <View style={styles.tagContainer}>
            <Tag />
            <Tag isProject={true} />
          </View>
          <Text style={styles.time}>25:43</Text>
        </View>
      </View>
    </View>
  );
}
