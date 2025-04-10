import NetInfo from "@react-native-community/netinfo";
import { Stack, router } from "expo-router";
import * as Font from "expo-font";
import { FONTS } from "@/constants/fonts";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "@context/ThemeContext";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { ActivityIndicator, AppState, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TagProvider, useTagContext } from "@/context/TagContext";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import {
  ExpoSQLiteDatabase,
  drizzle,
  useLiveQuery,
} from "drizzle-orm/expo-sqlite";
import migrations from "@/drizzle/migrations";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { SessionProvider, useSessionContext } from "@/context/SessionContext";
import { schema } from "@/db/schema";
import { tags } from "@/db/schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { useTaskContext } from "@/context/TaskContext";

const loadFonts = () => {
  return Font.loadAsync({
    [FONTS.regular]: require("../assets/fonts/SF-Pro-Text-Regular.otf"),
    [FONTS.medium]: require("../assets/fonts/SF-Pro-Text-Medium.otf"),
    [FONTS.semibold]: require("../assets/fonts/SF-Pro-Text-Semibold.otf"),
    [FONTS.bold]: require("../assets/fonts/SF-Pro-Text-Bold.otf"),
  });
};

export const DATABASE_NAME = "tags";

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const expoDb = openDatabaseSync(DATABASE_NAME, {
    enableChangeListener: true,
  });
  const db = drizzle(expoDb, { schema });
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setAuthToken(token);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (success) {
      console.log("Database migrated successfully");
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      console.error("Database migration failed", error);
    }
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <TagProvider>
                <SessionProvider>
                  <AppContent db={db} authToken={authToken} />
                </SessionProvider>
              </TagProvider>
            </ThemeProvider>
          </GestureHandlerRootView>
        </SQLiteProvider>
      </Suspense>
    </AuthProvider>
  );
}

function AppContent({
  db,
  authToken,
}: {
  db: ExpoSQLiteDatabase<typeof schema>;
  authToken: string | null;
}) {
  const { isLoggedIn } = useAuthContext();
  const { syncUnsyncedRows: syncUnsyncedTags, fetchAndStoreTags } =
    useTagContext();
  const { syncUnsyncedRows: syncUnsyncedSessions, fetchAndStoreSessions } =
    useSessionContext();
  const { syncUnsyncedTasks } = useTaskContext();

  const syncEverything = useCallback(async () => {
    if (authToken) {
      await fetchAndStoreTags(db, authToken);
      await fetchAndStoreSessions(db, authToken);
      await syncUnsyncedTasks(db, authToken);
    }
  }, [fetchAndStoreTags, fetchAndStoreSessions, syncUnsyncedTasks, authToken]);

  useEffect(() => {
    if (authToken) {
      const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          syncEverything().catch(console.error);
        }
      });

      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === "background") {
          syncEverything().catch(console.error);
        }
      };
      const appStateSubscription = AppState.addEventListener(
        "change",
        handleAppStateChange,
      );

      const interval = setInterval(
        () => {
          syncEverything().catch(console.error);
        },
        5 * 60 * 1000,
      );
    }
  }, [authToken, syncEverything]);

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          presentation: "modal",
          headerLeft: () => (
            <SysButton
              text="Cancel"
              onPress={() => {
                router.back();
              }}
            />
          ),
          headerTitle: (props) => (
            <Text
              {...props}
              style={{
                fontSize: useTheme().theme.fontSize.medium,
                fontFamily: useTheme().theme.font.semibold,
              }}
            >
              Create tag
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="pickActivity"
        options={{
          presentation: "modal",
          headerShown: false,
          headerLeft: () => (
            <SysButton
              text="Cancel"
              onPress={() => {
                router.back();
              }}
              isRegular={true}
            />
          ),
          headerTitle: (props) => (
            <Text
              {...props}
              style={{
                fontSize: useTheme().theme.fontSize.medium,
                fontFamily: useTheme().theme.font.semibold,
              }}
            >
              Change Activity
            </Text>
          ),
          headerRight: () => (
            <SysButton
              text="Choose"
              onPress={() => {
                router.back();
              }}
            />
          ),
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="authSelection"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
