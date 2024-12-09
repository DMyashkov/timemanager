import { View, Text } from "react-native";
import type { ActionSheetItem } from "@components/basic/actionSheet/actionSheet";
import { useTheme } from "@context/ThemeContext";
import FlagHollow from "@assets/icons/flag.svg";
import FlagFull from "@assets/icons/flag-full.svg";
import ActionItemElementFlag from "@components/basic/actionItemFlag/actionItemFlag";
import { act } from "react";

export const actionItemsArray = (): Array<ActionSheetItem> => {
  const { theme } = useTheme(); // Must be inside the function to use hooks

  return [
    {
      id: 1,
      label: "Priority 1",
      onPress: () => {},
      element: (
        <ActionItemElementFlag
          Icon={FlagFull}
          text="Priority 1"
          textColor={theme.color.black}
          iconColor={theme.color.darkRed}
        />
      ),
      contentStyle: {},
    },
    {
      id: 2,
      label: "Priority 2",
      onPress: () => {},
      element: (
        <ActionItemElementFlag
          Icon={FlagFull}
          text="Priority 2"
          textColor={theme.color.black}
          iconColor={theme.color.presets.yellow.dark}
        />
      ),
    },
    {
      id: 3,
      label: "Priority 3",
      onPress: () => {},
      element: (
        <ActionItemElementFlag
          Icon={FlagFull}
          text="Priority 3"
          textColor={theme.color.black}
          iconColor={theme.color.presets.blue.dark}
        />
      ),
    },
    {
      id: 4,
      label: "Priority 4",
      onPress: () => {},
      element: (
        <ActionItemElementFlag
          Icon={FlagHollow}
          text="Priority 4"
          textColor={theme.color.black}
          iconColor={theme.color.black}
        />
      ),
    },
  ];
};
