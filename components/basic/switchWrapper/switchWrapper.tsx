import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";

import type { SwitchProps } from "@/constants/interfaces";
import Switch from "@/components/basic/switch/switch";

interface SwitchWrapperProps extends SwitchProps {
  children: [React.ReactNode, React.ReactNode];
  styleSwitch?: object;
}

export default function SwitchWrapper({
  children,
  buttons = [],
  styleSwitch = {},
}: SwitchWrapperProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styleSwitch}>
        <Switch buttons={buttons} />
      </View>
      <View style={styles.main}>
        {children[0]}
        {children[1]}
      </View>
    </View>
  );
}
