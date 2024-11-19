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

export default function Login() {
  const styles = useStyles();
  const { theme } = useTheme();

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
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.description}>Add your email and password.</Text>
          </View>
          <TextField
            placeholder="Email"
            topHint="YOUR EMAIL"
            autoFocus={true}
          />
          <TextField
            placeholder="Password"
            topHint="YOUR PASSWORD"
            hideOption={true}
          />
          <View style={styles.loginButtonOuter}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.empty} />
    </SafeAreaView>
  );
}
