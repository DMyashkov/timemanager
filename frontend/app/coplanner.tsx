import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import MicrophoneIcon from "@assets/icons/microphone.svg";
import SendIcon from "@assets/icons/arrow-up.svg";
import ResetIcon from "@assets/icons/arrow-rotate-left.svg";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  useSharedValue,
  Easing,
  withSpring,
} from "react-native-reanimated";

const suggestions = [
  {
    context: "On Saturday I need to",
    task: "Plan my weekend workout routine and meal prep",
  },
  {
    context: "For my project I should",
    task: "Create a timeline for the next sprint and assign tasks",
  },
  {
    context: "This week I want to",
    task: "Learn a new language and build a small project",
  },
  {
    context: "In the morning I need to",
    task: "Review my emails and prepare for the team meeting",
  },
  {
    context: "Before the deadline I should",
    task: "Complete the documentation and run final tests",
  },
];

interface CoplannerProps {
  visible: boolean;
  onClose: () => void;
}

export default function Coplanner({ visible, onClose }: CoplannerProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const textInputRef = useRef<TextInput>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const borderRadius = useSharedValue(0.5);
  const perspective = useSharedValue(1000);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // Small delay to ensure the modal is fully rendered before focusing
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Start continuous clockwise rotation
      rotation.value = withRepeat(
        withTiming(360, { duration: 20000, easing: Easing.linear }),
        -1,
        false,
      );

      // Constant scale animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.9, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      );

      // Constant opacity
      opacity.value = withTiming(1, { duration: 500 });
    }
  }, [visible, text]);

  const animatedBlobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleSuggestionPress = (suggestion: string) => {
    setText(suggestion);
    // Keep keyboard focused
    textInputRef.current?.focus();
  };

  const handleReset = () => {
    setText("");
  };

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log("Sending:", text);
  };

  const SUGGESTION_HEIGHT = 85;
  const SUGGESTION_WIDTH = screenWidth * 0.7;

  const BACKGROUND_FOR_SUGGESTIONS = "#F6F5F3";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    contentContainer: {
      flex: 1,
      padding: 15,
      paddingBottom: Platform.OS === "ios" ? 60 : 40,
      justifyContent: "flex-end",
    },
    suggestionsWrapper: {
      height: SUGGESTION_HEIGHT,
      marginBottom: 20,
    },
    suggestionsContainer: {
      height: SUGGESTION_HEIGHT,
    },
    suggestionItem: {
      width: SUGGESTION_WIDTH,
      height: SUGGESTION_HEIGHT,
      paddingHorizontal: 15,
      marginRight: 10,
      backgroundColor: BACKGROUND_FOR_SUGGESTIONS,
      borderRadius: 8,
      justifyContent: "flex-start",
      padding: 10,
    },
    suggestionText: {
      color: theme.color.black,
      fontSize: theme.fontSize.medium,
      flexWrap: "wrap",
      textAlign: "left",
    },
    suggestionContext: {
      fontFamily: theme.font.semibold,
      marginBottom: 4,
    },
    suggestionTask: {
      fontFamily: theme.font.regular,
      color: theme.color.darkGrey,
    },
    inputContainer: {
      borderRadius: 12,
      padding: 15,
      paddingVertical: 8,
      paddingBottom: 12,
      marginBottom: 30,
      backgroundColor: BACKGROUND_FOR_SUGGESTIONS,
      minHeight: 100,
    },
    textInput: {
      color: theme.color.black,
      fontSize: theme.fontSize.medium,
      textAlignVertical: "top",
      fontFamily: theme.font.regular,
      lineHeight: 22,
      paddingBottom: 10,
    },
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 10,
    },
    button: {
      backgroundColor: theme.color.black,
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonIcon: {
      opacity: 1,
    },
    animatedBlob: {
      position: "absolute",
      width: screenWidth * 0.4,
      height: screenWidth * 0.4,
      backgroundColor: theme.color.lightRed,
      alignSelf: "center",
      top: keyboardHeight > 0 ? screenHeight * 0.1 : screenHeight * 0.3,
      borderRadius: (screenWidth * 0.4) / 2,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {text.length > 0 && (
          <Animated.View style={[styles.animatedBlob, animatedBlobStyle]} />
        )}
        <View style={styles.contentContainer}>
          <View style={styles.suggestionsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsContainer}
            >
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() =>
                    handleSuggestionPress(
                      `${suggestion.context} ${suggestion.task}`,
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.suggestionText, styles.suggestionContext]}
                  >
                    {suggestion.context}
                  </Text>
                  <Text style={[styles.suggestionText, styles.suggestionTask]}>
                    {suggestion.task}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="Type or speak your task..."
              placeholderTextColor={theme.color.darkGrey}
              blurOnSubmit={false}
              returnKeyType="none"
            />
            <View style={styles.buttonsRow}>
              {text ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#E5E0DA" }]}
                    onPress={handleReset}
                  >
                    <ResetIcon
                      height={20}
                      width={20}
                      fill={theme.color.black}
                      style={styles.buttonIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handleSend}>
                    <SendIcon
                      height={20}
                      width={20}
                      fill={theme.color.white}
                      style={styles.buttonIcon}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsRecording(!isRecording)}
                >
                  <MicrophoneIcon
                    height={20}
                    width={20}
                    fill={theme.color.white}
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
