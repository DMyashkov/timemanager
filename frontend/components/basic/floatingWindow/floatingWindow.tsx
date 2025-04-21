import React, { useCallback, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@context/ThemeContext';
import useStyles from './styles';
import { useAuthContext } from '@context/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_INDICATOR_SIZE = 20; // Size of the snap point indicators
const BUTTON_SIZE = 60; // Size of the floating button
const EDGE_PADDING = 20; // Padding from the edges
const STATUS_BAR_PADDING = 40; // Additional padding from the top for status bar
const SHOW_SNAP_POINTS = false; // Whether to show the snap point indicators

interface FloatingWindowProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export default function FloatingWindow({ children, onPress }: FloatingWindowProps) {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuthContext();
  const styles = useStyles();

  // Define snap positions for indicators
  const snapPositions = [
    { x: EDGE_PADDING + BUTTON_SIZE / 2, y: STATUS_BAR_PADDING + EDGE_PADDING + BUTTON_SIZE / 2, color: 'red' }, // Top-left
    { x: SCREEN_WIDTH / 2, y: STATUS_BAR_PADDING + EDGE_PADDING + BUTTON_SIZE / 2, color: 'orange' }, // Top-center
    { x: SCREEN_WIDTH - EDGE_PADDING - BUTTON_SIZE / 2, y: STATUS_BAR_PADDING + EDGE_PADDING + BUTTON_SIZE / 2, color: 'yellow' }, // Top-right
    { x: EDGE_PADDING + BUTTON_SIZE / 2, y: SCREEN_HEIGHT / 2, color: 'green' }, // Mid-left
    { x: SCREEN_WIDTH - EDGE_PADDING - BUTTON_SIZE / 2, y: SCREEN_HEIGHT / 2, color: 'blue' }, // Mid-right
    { x: EDGE_PADDING + BUTTON_SIZE / 2, y: SCREEN_HEIGHT - 100 - BUTTON_SIZE / 2, color: 'purple' }, // Bottom-left
    { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT - 100 - BUTTON_SIZE / 2, color: 'pink' }, // Bottom-center
    { x: SCREEN_WIDTH - EDGE_PADDING - BUTTON_SIZE / 2, y: SCREEN_HEIGHT - 100 - BUTTON_SIZE / 2, color: 'cyan' }, // Bottom-right
  ];

  const translateX = useSharedValue(snapPositions[5].x - BUTTON_SIZE / 2); // Bottom-left position
  const translateY = useSharedValue(snapPositions[5].y - BUTTON_SIZE / 2);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const snapToPosition = useCallback((x: number, y: number) => {
    // Define snap positions (corners and mid-sides)
    const snapPositions = [
      { x: EDGE_PADDING + BUTTON_SIZE / 2, y: STATUS_BAR_PADDING + EDGE_PADDING + BUTTON_SIZE / 2 }, // Top-left
      { x: SCREEN_WIDTH / 2, y: STATUS_BAR_PADDING + EDGE_PADDING + BUTTON_SIZE / 2 }, // Top-center
      { x: SCREEN_WIDTH - EDGE_PADDING - BUTTON_SIZE / 2, y: STATUS_BAR_PADDING + EDGE_PADDING + BUTTON_SIZE / 2 }, // Top-right
      { x: EDGE_PADDING + BUTTON_SIZE / 2, y: SCREEN_HEIGHT / 2 }, // Mid-left
      { x: SCREEN_WIDTH - EDGE_PADDING - BUTTON_SIZE / 2, y: SCREEN_HEIGHT / 2 }, // Mid-right
      { x: EDGE_PADDING + BUTTON_SIZE / 2, y: SCREEN_HEIGHT - 100 - BUTTON_SIZE / 2 }, // Bottom-left
      { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT - 100 - BUTTON_SIZE / 2 }, // Bottom-center
      { x: SCREEN_WIDTH - EDGE_PADDING - BUTTON_SIZE / 2, y: SCREEN_HEIGHT - 100 - BUTTON_SIZE / 2 }, // Bottom-right
    ];

    // Find the closest snap position
    let closestSnap = snapPositions[0];
    let minDistance = Infinity;

    snapPositions.forEach((pos) => {
      const distance = Math.sqrt(
        Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = pos;
      }
    });

    // Animate to the closest snap position
    translateX.value = withSpring(closestSnap.x - BUTTON_SIZE / 2, {
      damping: 15,
      stiffness: 100,
    });
    translateY.value = withSpring(closestSnap.y - BUTTON_SIZE / 2, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd((e) => {
      const finalX = startX.value + e.translationX + BUTTON_SIZE / 2;
      const finalY = startY.value + e.translationY + BUTTON_SIZE / 2;
      runOnJS(snapToPosition)(finalX, finalY);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} pointerEvents="box-none">
      {/* Snap point indicators */}
      {SHOW_SNAP_POINTS && snapPositions.map((pos, index) => (
        <View
          key={index}
          style={[
            styles.snapIndicator,
            {
              left: pos.x - SNAP_INDICATOR_SIZE / 2,
              top: pos.y - SNAP_INDICATOR_SIZE / 2,
              backgroundColor: pos.color,
            },
          ]}
        />
      ))}

      {/* Floating window */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.container,
            animatedStyle,
            { backgroundColor: theme.color.white },
          ]}
        >
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
} 