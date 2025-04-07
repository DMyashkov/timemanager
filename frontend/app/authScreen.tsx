import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import useStyles from "./styles/loginStyles";
import { useTheme } from "@context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { router } from "expo-router";
import TextField from "@/components/form/textField/textField";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTagContext } from "@/context/TagContext";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";
import { useAuthContext } from "@/context/AuthContext";

export default function AuthScreen({ isSignUp = true }: { isSignUp: boolean }) {
  const styles = useStyles();
  const { height } = useWindowDimensions();

  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { fetchAndStoreTags } = useTagContext();

  const saveToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
    } catch (e) {
      console.error("Error saving token:", e);
    }
  };
  const API_URL = "http://127.0.0.1:8000/api"; // Updated API URL

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  useEffect(() => {
    console.log("isLoggedIn authScreen.tsx", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setLoading(false);
      console.log("Login successful:", response.data);

      const token = response.data.token;
      await saveToken(token);

      axios.defaults.headers.common.Authorization = `Token ${token}`;

      await fetchAndStoreTags(db, token);

      setIsLoggedIn(true);
      router.replace("/watch");
    } catch (err) {
      setLoading(false);

      if (axios.isAxiosError(err) && err.response) {
        console.error("Login error response:", err.response.data);
        console.error("Login error status:", err.response.status);
        console.error(
          "Login error headers:",
          JSON.stringify(err.response.headers, null, 2),
        );
        setError(
          err.response.data.error ||
            err.response.data.message ||
            JSON.stringify(err.response.data) ||
            "An error occurred",
        );
      } else if (err instanceof Error) {
        console.error("Login error:", err);
        setError(err.message);
      } else {
        console.error("Unknown login error:", err);
        setError("An unknown error occurred");
      }
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Signing up with email:", email, "and password", password);
      const response = await axios.post(`${API_URL}/register/`, {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setLoading(false);
      console.log("Sign-up successful:", response.data);

      const token = response.data.token;
      await saveToken(token);

      axios.defaults.headers.common.Authorization = `Token ${token}`;
      await fetchAndStoreTags(db, token);
      setIsLoggedIn(true);
      router.replace("/watch");
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        console.error("Signup error:", err.response?.data);
        setError(err.response?.data?.error || "An API error occurred");
      } else if (err instanceof Error) {
        console.error("Signup error:", err);
        setError(err.message);
      } else {
        console.error("Unknown signup error:", err);
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    const setAxiosToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        axios.defaults.headers.common.Authorization = `Token ${token}`;
      }
    };
    setAxiosToken();
  }, []);

  const handleForgotPassword = () => {
    // forgot password logic
  };

  return (
    <SafeAreaView style={styles.view}>
      <View style={[styles.innerView, { height: height / 2 }]}>
        <View style={[styles.headerButtonContainer]}>
          <SysButton
            text="Cancel"
            onPress={() => {
              router.back();
            }}
            isRed={true}
          />
        </View>
        <View
          style={[
            styles.content,
            {
              height: height / 2,
            },
          ]}
        >
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
    </SafeAreaView>
  );
}
