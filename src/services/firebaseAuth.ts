import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

type AuthMode = "signin" | "signup";
const SESSION_STARTED_AT_KEY = "book_to_action_session_started_at";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const hasMissingConfig = Object.values(firebaseConfig).some((value) => !value);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : (() => {
        try {
          // Loaded dynamically to avoid type-resolution issues in Expo TS config.
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { getReactNativePersistence } = require("firebase/auth/react-native");
          return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
        } catch {
          return getAuth(app);
        }
      })();

if (Platform.OS === "web") {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Ignore if persistence was already set.
  });
}

const assertConfig = () => {
  if (!hasMissingConfig) return;
  throw new Error(
    "Firebase config is missing. Add EXPO_PUBLIC_FIREBASE_* values in your environment before using auth.",
  );
};

const setSessionStart = async () => {
  const value = String(Date.now());
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(SESSION_STARTED_AT_KEY, value);
    return;
  }
  await AsyncStorage.setItem(SESSION_STARTED_AT_KEY, value);
};

const getSessionStart = async () => {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(SESSION_STARTED_AT_KEY) ?? null;
  }
  return AsyncStorage.getItem(SESSION_STARTED_AT_KEY);
};

const clearSessionStart = async () => {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(SESSION_STARTED_AT_KEY);
    return;
  }
  await AsyncStorage.removeItem(SESSION_STARTED_AT_KEY);
};

const isSessionExpired = (timestamp: string | null) => {
  if (!timestamp) return false;
  const startedAt = Number(timestamp);
  if (!Number.isFinite(startedAt)) return true;
  return Date.now() - startedAt > SESSION_MAX_AGE_MS;
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  assertConfig();
  return onAuthStateChanged(auth, (user) => {
    void (async () => {
      if (!user) {
        await clearSessionStart();
        callback(null);
        return;
      }
      const sessionStartedAt = await getSessionStart();
      if (isSessionExpired(sessionStartedAt)) {
        await signOut(auth);
        await clearSessionStart();
        callback(null);
        return;
      }
      if (!sessionStartedAt) {
        await setSessionStart();
      }
      callback(user);
    })();
  });
};

export const authenticate = async (mode: AuthMode, email: string, password: string) => {
  assertConfig();
  const response =
    mode === "signup"
      ? await createUserWithEmailAndPassword(auth, email, password)
      : await signInWithEmailAndPassword(auth, email, password);
  await setSessionStart();
  return response;
};

export const signOutUser = async () => {
  assertConfig();
  await signOut(auth);
  await clearSessionStart();
};

export const getAuthErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const code = (error as Error & { code?: string }).code;
  if (!code) return error.message;

  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/invalid-credential") return "Invalid email or password.";
  if (code === "auth/user-not-found") return "Account not found. Please sign up first.";
  if (code === "auth/wrong-password") return "Incorrect password.";
  if (code === "auth/email-already-in-use") return "Account already exists. Please sign in.";
  if (code === "auth/weak-password") return "Password must be at least 6 characters.";
  if (code === "auth/too-many-requests") return "Too many attempts. Try again in a few minutes.";

  return error.message;
};
