import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import { useTheme } from "@context/ThemeContext";
import Check from "@assets/icons/check.svg";
interface Color {
  light: string; // Hex color or any valid CSS color string
  medium: string;
  dark: string;
}

interface ColorPickerProps {
  colors: Color[]; // Array of Color objects
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;
}

export default function ColorPicker({
  colors,
  selectedColorIndex,
  setSelectedColorIndex,
}: ColorPickerProps): JSX.Element {
  const styles = useStyles();
  const { theme } = useTheme();

  const maxSwatchesPerRow = 6; // Maximum number of swatches per row

  // Split colors into rows of `maxSwatchesPerRow`
  const rows: Color[][] = [];
  for (let i = 0; i < colors.length; i += maxSwatchesPerRow) {
    rows.push(colors.slice(i, i + maxSwatchesPerRow));
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Colour</Text>
      </View>
      <View style={styles.innerContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((color, colorIndex) => {
              const absoluteIndex = rowIndex * maxSwatchesPerRow + colorIndex;

              return (
                <TouchableOpacity
                  key={`colorSwatch-${absoluteIndex}`} // Use the generated key
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color.medium },
                  ]}
                  onPress={() => {
                    setSelectedColorIndex(absoluteIndex);
                  }}
                >
                  {absoluteIndex === selectedColorIndex && (
                    <Check width={19} height={19} fill={theme.color.white} />
                  )}
                </TouchableOpacity>
              );
            })}
            {/* Add empty swatches to fill the row */}
            {Array.from({ length: maxSwatchesPerRow - row.length }).map(
              (_, emptyIndex) => (
                <View
                  key={`emptyColorSwatch-${emptyIndex}`}
                  style={[styles.colorSwatch, { opacity: 0 }]}
                />
              ),
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
