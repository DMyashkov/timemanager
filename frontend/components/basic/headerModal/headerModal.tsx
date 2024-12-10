import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SysButton from "../blueSystemButton/blueSystemButton";

export default function HeaderModal({
  onPressLeft,
  onPressRight,
  leftText,
  rightText,
  isThereLeftButton = true,
  isThereRightButton = true,
  isLeftRed = false,
  isRightRed = false,
  title = "Header",
}: {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  leftText: string;
  rightText: string;
  isThereLeftButton?: boolean;
  isThereRightButton?: boolean;
  isLeftRed?: boolean;
  isRightRed?: boolean;
  title: string;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <>
      <View style={styles.headerButtonContainer}>
        <View style={styles.innerButtonsHeader}>
          {isThereLeftButton && (
            <SysButton
              text={leftText}
              isRegular={true}
              onPress={() => {
                if (onPressLeft) onPressLeft();
              }}
              isRed={isLeftRed}
            />
          )}
          <SysButton
            text={rightText}
            onPress={() => {
              if (onPressRight) onPressRight();
            }}
            isRed={isRightRed}
          />
        </View>
        <View style={styles.titleView}>
          <Text style={styles.titleHeader}>{title}</Text>
        </View>
      </View>
      <View style={[styles.separator, {}]} />
    </>
  );
}
