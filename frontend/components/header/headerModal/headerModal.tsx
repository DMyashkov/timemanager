import { View, Text } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import SysButton from "../../basic/blueSystemButton/blueSystemButton";
import SearchBarCustom from "../searchBar/searchBar";

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
  isThereSearchBar = true,
  searchText,
  setSearchText,
}: {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  leftText?: string;
  rightText?: string;
  isThereLeftButton?: boolean;
  isThereRightButton?: boolean;
  isLeftRed?: boolean;
  isRightRed?: boolean;
  title: string;
  isThereSearchBar?: boolean;
  searchText?: string;
  setSearchText?: (text: string) => void;
}) {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <>
      <View style={styles.headerButtonContainer}>
        <View style={styles.innerButtonsHeader}>
          {isThereLeftButton && leftText != null && (
            <SysButton
              text={leftText}
              isRegular={true}
              onPress={() => {
                if (onPressLeft) onPressLeft();
              }}
              isRed={isLeftRed}
            />
          )}
          {isThereRightButton && rightText != null && (
            <SysButton
              text={rightText}
              onPress={() => {
                if (onPressRight) onPressRight();
              }}
              isRed={isRightRed}
            />
          )}
        </View>
        <View style={styles.titleView}>
          <Text style={styles.titleHeader}>{title}</Text>
        </View>
      </View>
      {isThereSearchBar && searchText != null && setSearchText && (
        <View
          style={{
            paddingHorizontal: 10,
            paddingBottom: 10,
            marginTop: -3,
          }}
        >
          <SearchBarCustom
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </View>
      )}
      <View style={[styles.separator, {}]} />
    </>
  );
}
