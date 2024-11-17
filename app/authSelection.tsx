import { View, Text, Image, TouchableOpacity } from "react-native";
import useStyles from "./styles/authSelectionStyles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Stopwatch from "@assets/icons/stopwatch.svg";
import Apple from "@assets/icons/apple.svg";
import Mail from "@assets/icons/envelope.svg";
import Google from "@assets/icons/google.svg";

export default function Component() {
  const styles = useStyles();
  const { theme } = useTheme();

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
        <View style={styles.option}>
          <View style={[styles.iconContainer, { marginRight: 4 }]}>
            <Mail width={20} height={20} fill={theme.color.black} />
          </View>
          <TouchableOpacity
            hitSlop={{ top: 13, bottom: 13, left: 90, right: 65 }}
          >
            <Text style={styles.optionText}>Continue with Email</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.termsOfService}>
        By continuing you agree with out{" "}
        <Text style={styles.underlined}>Terms of Service</Text> and{" "}
        <Text style={styles.underlined}>Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
}
