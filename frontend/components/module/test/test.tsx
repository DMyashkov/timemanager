import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";

const NestedFlatLists = () => {
  const outerData = Array.from({ length: 5 }, (_, i) => `Outer Item ${i + 1}`);
  const innerData = Array.from({ length: 3 }, (_, i) => `Inner Item ${i + 1}`);

  const renderInnerList = () => (
    <FlatList
      data={innerData}
      renderItem={({ item }) => (
        <View style={styles.innerItem}>
          <Text>{item}</Text>
        </View>
      )}
      keyExtractor={(item) => item}
      contentContainerStyle={{ gap: 100, opacity: 0.2, padding: 10 }}
    />
  );

  return (
    <FlatList
      data={outerData}
      renderItem={({ item }) => (
        <View style={styles.outerItem}>
          <Text>{item}</Text>
          {renderInnerList()}
        </View>
      )}
      keyExtractor={(item) => item}
      contentContainerStyle={{ gap: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  outerItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  innerItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default NestedFlatLists;
