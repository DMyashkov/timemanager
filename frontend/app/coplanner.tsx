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
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import MicrophoneIcon from "@assets/icons/microphone.svg";
import SendIcon from "@assets/icons/arrow-up.svg";
import ResetIcon from "@assets/icons/arrow-rotate-left.svg";

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
    task: "Learn a new programming language and build a small project",
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
  const textInputRef = useRef<TextInput>(null);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (visible) {
      // Small delay to ensure the modal is fully rendered before focusing
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.white,
    },
    contentContainer: {
      flex: 1,
      padding: 20,
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
      backgroundColor: theme.color.lightestGrey,
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
      borderWidth: 1,
      borderColor: theme.color.lightestGrey,
      borderRadius: 12,
      padding: 15,
      paddingVertical: 8,
      paddingBottom: 13,
      marginBottom: 30,
      backgroundColor: theme.color.lightestGrey,
      shadowColor: theme.color.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
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
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonIcon: {
      opacity: 1,
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
                  <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <ResetIcon
                      height={20}
                      width={20}
                      fill={theme.color.white}
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
