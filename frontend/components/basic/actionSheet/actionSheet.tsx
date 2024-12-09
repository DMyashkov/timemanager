// ActionSheet.tsx
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import PropTypes from "prop-types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const PRIMARY_COLOR = "rgb(0,98,255)";
const WHITE = "#ffffff";
const BORDER_COLOR = "#DBDBDB";

interface ActionSheetProps {
  actionItems: Array<{
    id: string | number;
    label: string;
    onPress: () => void;
  }>;
  onCancel?: () => void;
  actionTextColor?: string;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const ActionSheet = ({
  actionItems = [],
  onCancel = () => {},
  actionTextColor = "#000",
  bottomSheetRef,
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
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={true}
      handleIndicatorStyle={{ backgroundColor: "transparent" }}
      backgroundStyle={{ backgroundColor: "transparent" }}
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
            ]}
            underlayColor={"#f7f7f7"}
            onPress={() => {
              actionItem.onPress();
              bottomSheetRef.current?.close();
            }}
          >
            <Text
              allowFontScaling={false}
              style={[
                styles.actionSheetText,
                actionTextColor && { color: actionTextColor },
                index === actionSheetItems.length - 1 && styles.cancelText,
              ]}
            >
              {actionItem.label}
            </Text>
          </TouchableHighlight>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: "gray",
  },
  modalContent: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  },
  firstItem: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
