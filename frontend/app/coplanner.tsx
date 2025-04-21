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
  "I have to walk the dog today",
  "Need to finish the project by Friday",
  "Schedule a meeting with the team",
  "Buy groceries for the week",
  "Call mom for her birthday",
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

  const SUGGESTION_HEIGHT = 80;

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
      width: screenWidth * 0.4,
      height: SUGGESTION_HEIGHT,
      paddingHorizontal: 15,
      marginRight: 10,
      backgroundColor: theme.color.lightGrey,
      borderRadius: 8,
      justifyContent: "flex-start",
      padding: 10,
    },
    suggestionText: {
      color: theme.color.black,
      fontSize: theme.fontSize.medium,
      flexWrap: "wrap",
      textAlign: "left",
      lineHeight: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.color.lightGrey,
      borderRadius: 8,
      padding: 10,
      marginBottom: 20,
    },
    textInput: {
      flex: 1,
      minHeight: 100,
      color: theme.color.black,
      fontSize: theme.fontSize.medium,
      textAlignVertical: "top",
    },
    button: {
      padding: 10,
      marginLeft: 10,
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
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText} numberOfLines={3}>
                    {suggestion}
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
            {text ? (
              <>
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                  <ResetIcon height={24} width={24} fill={theme.color.black} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSend}>
                  <SendIcon height={24} width={24} fill={theme.color.black} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsRecording(!isRecording)}
              >
                <MicrophoneIcon
                  height={24}
                  width={24}
                  fill={theme.color.black}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
