import { View, Text, Image, TouchableOpacity } from "react-native";
import useStyles from "./styles/authSelectionStyles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Stopwatch from "@assets/icons/stopwatch.svg";
import Apple from "@assets/icons/apple.svg";
import Mail from "@assets/icons/envelope.svg";
import Google from "@assets/icons/google.svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function Component() {
  const styles = useStyles();
  const { theme } = useTheme();

  const focusAnim = useSharedValue(0);
  const animStyles = {
    emailButtons: useAnimatedStyle(() => ({
      height: focusAnim.value * 45,
    })),
    border: useAnimatedStyle(() => ({
      borderBottomWidth: focusAnim.value,
    })),
  };

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.appTitleContainer}>
        <View style={styles.logoContainer}>
          <Stopwatch width={24} height={24} fill={theme.color.red} />
        </View>
        <Text style={styles.title}>timemanager</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("@assets/images/stopwatchImage.jpeg")}
        />
      </View>
      <Text style={styles.slogan}>
        Organise every second of your time, finally.
      </Text>
      <View style={styles.choiceContainer}>
        <View style={styles.option}>
          <View style={{ marginBottom: 4 }}>
            <Apple width={23} height={23} fill={theme.color.black} />
          </View>
          <TouchableOpacity
            hitSlop={{ top: 13, bottom: 13, left: 90, right: 65 }}
          >
            <Text style={styles.optionText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <View style={[styles.iconContainer]}>
            <Google width={20} height={20} fill={theme.color.black} />
          </View>
          <TouchableOpacity
            hitSlop={{ top: 13, bottom: 13, left: 85, right: 58 }}
          >
            <Text style={styles.optionText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionEmailFull}>
          <Animated.View
            style={[
              styles.buttonsContainerOuter,
              animStyles.emailButtons,
              animStyles.border,
            ]}
          >
            <View style={styles.buttonsContainer}>
              <View style={styles.line} />
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => {
                  router.push("/login");
                }}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  router.push("/signup");
                }}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <View style={[styles.optionEmailCollapsed]}>
            <View style={[styles.iconContainer, { marginRight: 4 }]}>
              <Mail width={20} height={20} fill={theme.color.black} />
            </View>
            <TouchableOpacity
              hitSlop={{ top: 13, bottom: 13, left: 90, right: 65 }}
              onPress={() => setIsFocused(!isFocused)}
            >
              <Text style={styles.optionText}>Continue with Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.termsOfServiceOuter}>
        <Text style={styles.termsOfService}>
          By continuing you agree with out{" "}
          <Text style={styles.underlined}>Terms of Service</Text> and{" "}
          <Text style={styles.underlined}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
