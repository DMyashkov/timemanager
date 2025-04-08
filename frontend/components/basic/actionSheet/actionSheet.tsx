// ActionSheet.tsx
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";
import PropTypes from "prop-types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const PRIMARY_COLOR = "rgb(0,98,255)";
const WHITE = "#ffffff";
const BORDER_COLOR = "#DBDBDB";

export interface ActionSheetItem {
  id: string | number;
  label: string;
  onPress: () => void;
  element?: React.ReactElement;
  contentStyle?: ViewStyle;
}

export interface ActionSheetProps {
  actionItems: Array<ActionSheetItem>;
  onCancel?: () => void;
  actionTextColor?: string;
  bottomSheetRef: React.RefObject<BottomSheet>;
  cancelTextStyle?: TextStyle;
}

const ActionSheet = ({
  actionItems = [],
  onCancel = () => {},
  actionTextColor = "#000",
  bottomSheetRef,
  cancelTextStyle,
}: ActionSheetProps) => {
  const actionSheetItems = [
    ...actionItems,
    {
      id: "#cancel",
      label: "Cancel",
      onPress: onCancel,
    },
  ];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["50%"]}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={true}
      handleIndicatorStyle={{ backgroundColor: "transparent" }}
      backgroundStyle={{ backgroundColor: "transparent" }}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
    >
      <BottomSheetView style={styles.modalContent}>
        {actionSheetItems.map((actionItem, index) => (
          <TouchableHighlight
            key={actionItem.id}
            style={[
              styles.actionSheetView,
              index === 0 && styles.firstItem,
              index === actionSheetItems.length - 2 && styles.lastRegularItem,
              index === actionSheetItems.length - 1 && styles.cancelItem,
              actionItem.contentStyle,
            ]}
            underlayColor={"#f7f7f7"}
            onPress={() => {
              actionItem.onPress();
              bottomSheetRef.current?.close();
            }}
          >
            {actionItem.element ? (
              actionItem.element
            ) : (
              <Text
                allowFontScaling={false}
                style={[
                  styles.actionSheetText,
                  actionTextColor && { color: actionTextColor },
                  index === actionSheetItems.length - 1 && [
                    styles.cancelText,
                    cancelTextStyle,
                  ],
                ]}
              >
                {actionItem.label}
              </Text>
            )}
          </TouchableHighlight>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
};

const getConditionalStyles = (index: number, total: number): ViewStyle => {
  if (index === 0) {
    return styles.firstItem;
  }
  if (index === total - 2) {
    return styles.lastRegularItem;
  }
  if (index === total - 1) {
    return styles.cancelItem;
  }
  return {};
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  actionSheetText: {
    fontSize: 18,
    textAlign: "center",
  },
  cancelText: {
    color: "#fa1616",
  },
  actionSheetView: {
    backgroundColor: WHITE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR,
    height: 54.5,
  },
  firstItem: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  customElementContainer: {
    // Ensure custom elements have proper padding and alignment
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR,
    backgroundColor: WHITE,
    borderRadius: 12,
    marginTop: 8,
  },

  lastRegularItem: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cancelItem: {
    borderBottomWidth: 0,
    backgroundColor: WHITE,
    marginTop: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

ActionSheet.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      onPress: PropTypes.func,
    }),
  ).isRequired,
  onCancel: PropTypes.func,
  actionTextColor: PropTypes.string,
  bottomSheetRef: PropTypes.object.isRequired,
};

export default ActionSheet;
