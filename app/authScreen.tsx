import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import useStyles from "./styles/loginStyles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { router } from "expo-router";
import TextField from "@/components/form/textField/textField";
import { useState } from "react";

export default function AuthScreen({ isSignUp = true }: { isSignUp: boolean }) {
  const styles = useStyles();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // login logic
  };

  const handleSignUp = () => {
    // signup logic
  };

  const handleForgotPassword = () => {
    // forgot password logic
  };

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.innerView}>
        <View style={[styles.headerButtonContainer]}>
          <SysButton
            text="Cancel"
            onPress={() => {
              router.back();
            }}
            isRed={true}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{!isSignUp ? "Log In" : "Sign Up"}</Text>
            <Text style={styles.description}>Add your email and password.</Text>
          </View>
          <TextField
            placeholder="Email"
            topHint="YOUR EMAIL"
            autoFocus={true}
            setModuleName={setEmail}
          />
          <TextField
            placeholder="Password"
            topHint="YOUR PASSWORD"
            hideOption={true}
            setModuleName={setPassword}
          />
          <View style={styles.loginButtonOuter}>
            <View style={styles.outerButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={!isSignUp ? handleLogin : handleSignUp}
              >
                <Text style={styles.buttonText}>
                  {!isSignUp ? "Log In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>
                {!isSignUp ? "Forgot your password?" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.empty} />
    </SafeAreaView>
  );
}
