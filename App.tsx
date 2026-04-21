import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as Speech from "expo-speech";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  BOOKS,
  BOOK_GOAL_RESULTS,
  GOALS,
  TAB_META,
  type GoalId,
  type GoalResult,
  type ResultTabId,
} from "./src/data/library";

type Screen = "login" | "home" | "loading" | "results";

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [screen, setScreen] = useState<Screen>("login");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("demo@booktoaction.app");
  const [password, setPassword] = useState("Action@123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authUsers, setAuthUsers] = useState<Record<string, string>>({
    "demo@booktoaction.app": "Action@123",
  });
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>(["productivity"]);
  const [selectedBookId, setSelectedBookId] = useState(BOOKS[0].id);
  const [activeTab, setActiveTab] = useState<ResultTabId>("summary");
  const [bookMenuOpen, setBookMenuOpen] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const [speakingGoalId, setSpeakingGoalId] = useState<GoalId | null>(null);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const selectedBook = BOOKS.find((book) => book.id === selectedBookId) ?? BOOKS[0];
  const contentByGoal = BOOK_GOAL_RESULTS[selectedBook.id];
  const primaryGoalId = selectedGoals[0];

  useEffect(() => {
    if (screen !== "loading") {
      return;
    }
    const timer = setTimeout(() => setScreen("results"), 1000);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "loading") {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [screen, rotateAnim]);

  useEffect(() => {
    // Always stop audio when context changes away from summary playback.
    if (screen !== "results" || activeTab !== "summary") {
      Speech.stop();
      setSpeakingGoalId(null);
    }
  }, [screen, activeTab, selectedBookId]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const toggleGoal = (goalId: GoalId) => {
    setSelectionError("");
    if (selectedGoals.includes(goalId)) {
      if (selectedGoals.length === 1) {
        setSelectionError("Select at least one goal.");
        return;
      }
      setSelectedGoals((prev) => prev.filter((id) => id !== goalId));
      return;
    }
    if (selectedGoals.length >= 3) {
      setSelectionError("You can select up to 3 goals.");
      return;
    }
    setSelectedGoals((prev) => [...prev, goalId]);
  };

  const handleStart = () => {
    setSelectionError("");
    if (selectedGoals.length === 0 || selectedGoals.length > 3) {
      setSelectionError("Please select 1 to 3 goals.");
      return;
    }
    setActiveTab("summary");
    setSpeakingGoalId(null);
    Speech.stop();
    setScreen("loading");
  };

  const handleAuth = () => {
    const normalizedEmail = email.trim().toLowerCase();
    setAuthError("");

    if (!normalizedEmail || !password) {
      setAuthError("Email and password are required.");
      return;
    }
    if (!normalizedEmail.includes("@")) {
      setAuthError("Enter a valid email address.");
      return;
    }

    if (authMode === "signup") {
      if (password.length < 8) {
        setAuthError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Password and confirm password do not match.");
        return;
      }
      if (authUsers[normalizedEmail]) {
        setAuthError("Account already exists. Please sign in.");
        return;
      }
      setAuthUsers((prev) => ({ ...prev, [normalizedEmail]: password }));
      setScreen("home");
      return;
    }

    if (authUsers[normalizedEmail] !== password) {
      setAuthError("Invalid credentials. Try demo@booktoaction.app / Action@123");
      return;
    }
    setScreen("home");
  };

  const speakSummary = (goalId: GoalId, summary: string[], quotes: string[]) => {
    if (speakingGoalId === goalId) {
      Speech.stop();
      setSpeakingGoalId(null);
      return;
    }

    const text = [...summary, "Notable quotes.", ...quotes].join(" ");
    Speech.stop();
    setSpeakingGoalId(goalId);
    Speech.speak(text, {
      language: "en",
      pitch: 1.0,
      rate: 0.95,
      onDone: () => setSpeakingGoalId(null),
      onStopped: () => setSpeakingGoalId(null),
      onError: () => setSpeakingGoalId(null),
    });
  };

  const getSectionLines = (result: GoalResult, tab: ResultTabId): string[] => {
    if (tab === "summary") return result.summary;
    if (tab === "ideas") return result.ideas;
    if (tab === "framework") return result.framework;
    if (tab === "plan") return result.plan;
    return result.mistakes;
  };

  const getTabAccent = (tab: ResultTabId) => {
    if (tab === "summary") return "#4f68ea";
    if (tab === "ideas") return "#7a53d9";
    if (tab === "framework") return "#0f8f85";
    if (tab === "plan") return "#cf6f2e";
    return "#c0466d";
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.appContainer}>

      {screen === "login" && (
        <View style={styles.loginWrap}>
          <View style={styles.loginHeroCard}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>📖</Text>
            </View>
            <Text style={styles.title}>Book to Action</Text>
            <Text style={styles.subtitle}>Turn books into action</Text>
            <Text style={styles.loginNote}>
              Convert powerful ideas into monthly strategy, frameworks, and execution plans.
            </Text>
            <View style={styles.loginPillRow}>
              <Text style={styles.loginPill}>Summary</Text>
              <Text style={styles.loginPill}>Frameworks</Text>
              <Text style={styles.loginPill}>Action Plan</Text>
            </View>

            <View style={styles.authCard}>
              <View style={styles.authModeRow}>
                <Pressable
                  style={[styles.authModeButton, authMode === "signin" && styles.authModeButtonActive]}
                  onPress={() => {
                    setAuthMode("signin");
                    setAuthError("");
                  }}
                >
                  <Text style={[styles.authModeText, authMode === "signin" && styles.authModeTextActive]}>
                    Sign In
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.authModeButton, authMode === "signup" && styles.authModeButtonActive]}
                  onPress={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                >
                  <Text style={[styles.authModeText, authMode === "signup" && styles.authModeTextActive]}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <TextInput
                style={styles.authInput}
                placeholder="Email"
                placeholderTextColor="#94a3c8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.authInput}
                placeholder="Password"
                placeholderTextColor="#94a3c8"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              {authMode === "signup" ? (
                <TextInput
                  style={styles.authInput}
                  placeholder="Confirm password"
                  placeholderTextColor="#94a3c8"
                  secureTextEntry
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              ) : null}

              {authError ? <Text style={styles.authError}>{authError}</Text> : null}
            </View>
          </View>
          <Pressable style={styles.startButton} onPress={handleAuth}>
            <Text style={styles.startText}>{authMode === "signin" ? "Sign In" : "Create Account"}</Text>
          </Pressable>
        </View>
      )}

      {screen === "home" && (
        <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>📖</Text>
            </View>
            <Text style={styles.title}>Book to Action</Text>
            <Text style={styles.subtitle}>Turn books into action</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What do you want to improve?</Text>
            {GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
              <Pressable
                key={goal.id}
                style={[styles.goalRow, isSelected && styles.goalRowActive]}
                onPress={() => toggleGoal(goal.id)}
              >
                <View style={styles.goalLeft}>
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[styles.goalText, isSelected && styles.goalTextActive]}>{goal.label}</Text>
                </View>
                <Text style={styles.goalArrow}>{isSelected ? "✓" : "○"}</Text>
              </Pressable>
              );
            })}
            <Text style={styles.helperText}>Selected: {selectedGoals.length}/3 goals</Text>
            {selectionError ? <Text style={styles.errorText}>{selectionError}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select book</Text>
            <Pressable style={styles.select} onPress={() => setBookMenuOpen((prev) => !prev)}>
              <Text style={styles.selectText}>{selectedBook.title}</Text>
              <Text style={styles.selectArrow}>{bookMenuOpen ? "⌃" : "⌄"}</Text>
            </Pressable>
            {bookMenuOpen && (
              <View style={styles.bookMenu}>
                <ScrollView nestedScrollEnabled style={styles.bookMenuList}>
                  {BOOKS.map((book) => (
                    <Pressable
                      key={book.id}
                      style={styles.bookItem}
                      onPress={() => {
                        setSelectedBookId(book.id);
                        setBookMenuOpen(false);
                      }}
                    >
                      <Text style={styles.bookItemTitle}>
                        {book.title}
                        <Text style={styles.bookItemAuthorInline}> - {book.author}</Text>
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <Pressable style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startText}>Start</Text>
          </Pressable>
        </ScrollView>
      )}

      {screen === "loading" && (
        <View style={styles.loadingWrap}>
          <Animated.View
            style={[
              styles.loaderOuter,
              {
                transform: [
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.loaderInner} />
          </Animated.View>
          <Text style={styles.loadingText}>Analyzing your book and creating your action plan</Text>
          <View style={styles.card}>
            <Text style={styles.metaText}>Book: {selectedBook.title}</Text>
            <Text style={styles.metaText}>Author: {selectedBook.author}</Text>
          </View>
        </View>
      )}

      {screen === "results" && (
        <ScrollView contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable onPress={() => setScreen("home")}>
              <Text style={styles.topLink}>← Back</Text>
            </Pressable>
            <Pressable style={styles.homeBtn} onPress={() => setScreen("home")}>
              <Text style={styles.homeBtnText}>⌂</Text>
            </Pressable>
          </View>

          <View style={styles.resultHeader}>
            <Text style={styles.resultLabel}>YOUR ACTION PLAN</Text>
            <Text style={styles.resultBook}>{selectedBook.title}</Text>
            <Text style={styles.resultAuthor}>by {selectedBook.author}</Text>
            <Text style={styles.resultGoal}>
              Your plan for{" "}
              {selectedGoals
                .map((goalId) => GOALS.find((goal) => goal.id === goalId)?.label ?? "")
                .join(", ")}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsWrap}
            contentContainerStyle={styles.tabsContent}
          >
            {TAB_META.map((tab) => (
              <Pressable
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.tabActive,
                  activeTab === tab.id && {
                    borderColor: getTabAccent(tab.id),
                    backgroundColor: getTabAccent(tab.id),
                    shadowColor: getTabAccent(tab.id),
                  },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.resultsGrid}>
            {(() => {
              const goalMeta = GOALS.find((goal) => goal.id === primaryGoalId);
              const result = primaryGoalId ? contentByGoal?.[primaryGoalId] : undefined;
              const lines = result ? getSectionLines(result, activeTab) : ["No content found for this goal."];
              const tabTitle = TAB_META.find((tab) => tab.id === activeTab)?.title ?? "Result";
              return (
                <View
                  style={[
                    styles.card,
                    styles.resultCard,
                    {
                      borderLeftWidth: 4,
                      borderLeftColor: getTabAccent(activeTab),
                      backgroundColor: `${getTabAccent(activeTab)}12`,
                    },
                    styles.resultCardFull,
                  ]}
                >
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>
                      {tabTitle} - {goalMeta?.label}
                    </Text>
                    {activeTab === "summary" && result && primaryGoalId ? (
                      <Pressable
                        onPress={() => speakSummary(primaryGoalId, result.summary, result.quotes)}
                        style={[styles.audioIconButton, speakingGoalId === primaryGoalId && styles.audioIconButtonActive]}
                      >
                        <Text style={styles.audioIcon}>{speakingGoalId === primaryGoalId ? "⏹" : "🔊"}</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  {activeTab === "summary" && result ? (
                    <>
                      {lines.map((line) => (
                        <Text key={line} style={styles.sectionText}>
                          {line}
                        </Text>
                      ))}
                      <View style={styles.quoteBlock}>
                        <Text style={styles.quoteHeading}>Notable lines</Text>
                        {result.quotes.map((quote) => (
                          <Text key={quote} style={styles.quoteText}>
                            "{quote.replace(/^"|"$/g, "")}"
                          </Text>
                        ))}
                      </View>
                    </>
                  ) : activeTab === "framework" || activeTab === "plan" ? (
                    lines.map((line) => {
                      const splitIndex = line.indexOf(":");
                      if (splitIndex === -1) {
                        return (
                          <Text key={line} style={styles.bulletText}>
                            • {line}
                          </Text>
                        );
                      }
                      const prefix = line.slice(0, splitIndex + 1);
                      const rest = line.slice(splitIndex + 1).trim();
                      return (
                        <View key={line} style={styles.structuredItem}>
                          <View style={styles.structuredRow}>
                            <Text style={styles.structuredBullet}>•</Text>
                            <View style={styles.structuredContent}>
                              <Text style={styles.structuredTitle}>{prefix}</Text>
                              <Text style={styles.structuredBody}>{rest}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    lines.map((line) => (
                      <Text key={line} style={styles.bulletText}>
                        • {line}
                      </Text>
                    ))
                  )}
                </View>
              );
            })()}
          </View>
        </ScrollView>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#eef2ff",
    alignItems: "center",
  },
  appContainer: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 1080 : 520,
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 0,
    shadowColor: "#3347b8",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 10 },
    elevation: 0,
  },
  loginWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loginHeroCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d8e1ff",
    backgroundColor: "#f8faff",
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#3a4cb2",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  loginPillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  loginPill: {
    borderWidth: 1,
    borderColor: "#d2dcff",
    backgroundColor: "#edf2ff",
    color: "#4152ab",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
  },
  authCard: {
    width: "100%",
    marginTop: 6,
  },
  authModeRow: {
    flexDirection: "row",
    backgroundColor: "#dfe7ff",
    borderRadius: 12,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#c2d0ff",
  },
  authModeButton: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 8,
    alignItems: "center",
  },
  authModeButtonActive: {
    backgroundColor: "#4f68ea",
    borderWidth: 1,
    borderColor: "#4a63e5",
    shadowColor: "#4f68ea",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  authModeText: {
    color: "#52639f",
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
  },
  authModeTextActive: {
    color: "#ffffff",
    fontFamily: "Manrope_700Bold",
  },
  authInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d2dcff",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1f275b",
    marginBottom: 8,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
  },
  authError: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 2,
    fontFamily: "Manrope_600SemiBold",
  },
  homeContent: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 640 : 520,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
  hero: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#2a2f6a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#1d2559",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoText: {
    fontSize: 30,
  },
  title: {
    fontSize: Platform.OS === "web" ? 24 : 32,
    lineHeight: Platform.OS === "web" ? 28 : 36,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.4,
    color: "#1b214b",
  },
  subtitle: {
    marginTop: 2,
    fontSize: Platform.OS === "web" ? 13 : 15,
    fontFamily: "Manrope_500Medium",
    color: "#6d76a6",
  },
  loginNote: {
    marginTop: 16,
    marginBottom: 18,
    color: "#6d76a6",
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    textAlign: "center",
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dde3ff",
    backgroundColor: "#ffffff",
    padding: Platform.OS === "web" ? 16 : 14,
    marginBottom: 14,
    shadowColor: "#4450a3",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: Platform.OS === "web" ? 16 : 22,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.2,
    color: "#1f275b",
    marginBottom: 12,
  },
  goalRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e7ff",
    backgroundColor: "#f6f8ff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 10 : 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalRowActive: {
    backgroundColor: "#e8efff",
    borderColor: "#8ea8ff",
  },
  goalLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIcon: {
    width: 24,
    fontSize: 16,
  },
  goalText: {
    fontSize: Platform.OS === "web" ? 14 : 18,
    fontFamily: "Manrope_600SemiBold",
    color: "#2d355f",
    marginLeft: 8,
  },
  goalTextActive: {
    color: "#2d43b8",
    fontFamily: "Manrope_700Bold",
  },
  goalArrow: {
    fontSize: 18,
    color: "#8896cc",
    fontWeight: "700",
  },
  helperText: {
    marginTop: 4,
    color: "#6d76a6",
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
  },
  errorText: {
    marginTop: 4,
    color: "#dc2626",
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
  },
  select: {
    borderWidth: 1,
    borderColor: "#d7dfff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  bookMenu: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d7dfff",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  bookMenuList: {
    maxHeight: 220,
  },
  bookItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e7ebff",
    backgroundColor: "#ffffff",
  },
  bookItemTitle: {
    fontSize: 15,
    color: "#1f275b",
    fontFamily: "Manrope_600SemiBold",
  },
  bookItemAuthorInline: {
    fontSize: 13,
    color: "#7d86b0",
    fontFamily: "Manrope_400Regular",
  },
  selectText: {
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontFamily: "Manrope_600SemiBold",
    color: "#1f275b",
  },
  selectArrow: {
    fontSize: 20,
    color: "#6875a8",
  },
  startButton: {
    borderRadius: 14,
    backgroundColor: "#3d4fd0",
    paddingVertical: Platform.OS === "web" ? 12 : 14,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#2f41c7",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: "#5870ea",
  },
  startText: {
    color: "#ffffff",
    fontSize: Platform.OS === "web" ? 16 : 18,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.1,
  },
  loadingWrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 110,
  },
  loaderOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 7,
    borderColor: "#dbe6ff",
    borderTopColor: "#4066ff",
    alignSelf: "center",
    marginBottom: 16,
  },
  loaderInner: {
    flex: 1,
  },
  loadingText: {
    textAlign: "center",
    color: "#2d355f",
    fontSize: Platform.OS === "web" ? 16 : 17,
    lineHeight: Platform.OS === "web" ? 24 : 26,
    marginBottom: 18,
    fontFamily: "Manrope_500Medium",
  },
  metaText: {
    color: "#384377",
    fontSize: Platform.OS === "web" ? 16 : 17,
    lineHeight: Platform.OS === "web" ? 24 : 26,
    fontFamily: "Manrope_500Medium",
  },
  resultsContent: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 980 : 520,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  topLink: {
    color: "#3a477e",
    fontSize: Platform.OS === "web" ? 18 : 19,
    fontFamily: "Manrope_600SemiBold",
  },
  homeBtn: {
    borderWidth: 1,
    borderColor: "#4d67e8",
    borderRadius: 12,
    width: 46,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4f68ea",
    shadowColor: "#4f68ea",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  homeBtnText: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "Manrope_700Bold",
  },
  resultHeader: {
    backgroundColor: "#f4f6ff",
    borderWidth: 1,
    borderColor: "#dbe3ff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  resultLabel: {
    color: "#7a84b1",
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: "Manrope_600SemiBold",
  },
  resultBook: {
    color: "#1f275b",
    fontSize: Platform.OS === "web" ? 24 : 32,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.35,
    marginBottom: 2,
  },
  resultAuthor: {
    color: "#5d6898",
    fontSize: Platform.OS === "web" ? 13 : 15,
    marginBottom: 16,
    fontFamily: "Manrope_500Medium",
  },
  resultGoal: {
    color: "#3558d7",
    fontSize: Platform.OS === "web" ? 13 : 15,
    fontFamily: "Manrope_700Bold",
    marginBottom: 10,
  },
  tabsWrap: {
    marginBottom: 16,
  },
  tabsContent: {
    paddingRight: 12,
    paddingBottom: 2,
  },
  tab: {
    borderWidth: 1,
    borderColor: "#ccd7ff",
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    paddingHorizontal: Platform.OS === "web" ? 9 : 10,
    paddingVertical: Platform.OS === "web" ? 6 : 7,
    marginRight: 6,
  },
  tabActive: {
    borderColor: "#4f68ea",
    backgroundColor: "#516cff",
    shadowColor: "#4f68ea",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabText: {
    color: "#5c6ea8",
    fontSize: Platform.OS === "web" ? 12 : 13,
    fontFamily: "Manrope_600SemiBold",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  sectionTitle: {
    flex: 1,
    fontSize: Platform.OS === "web" ? 18 : 22,
    lineHeight: Platform.OS === "web" ? 25 : 30,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.2,
    color: "#1f275b",
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionText: {
    fontSize: Platform.OS === "web" ? 14 : 15,
    lineHeight: Platform.OS === "web" ? 22 : 24,
    color: "#3f4b7c",
    marginBottom: 10,
    fontFamily: "Manrope_500Medium",
  },
  bulletText: {
    fontSize: Platform.OS === "web" ? 14 : 15,
    lineHeight: Platform.OS === "web" ? 22 : 24,
    color: "#3f4b7c",
    marginBottom: 10,
    fontFamily: "Manrope_500Medium",
  },
  bulletBold: {
    fontFamily: "Manrope_700Bold",
    color: "#2f3f86",
  },
  audioIconButton: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eaf0ff",
    borderWidth: 1,
    borderColor: "#c9d6ff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },
  audioIconButtonActive: {
    backgroundColor: "#dfe7ff",
    borderColor: "#93a7ff",
  },
  audioIcon: {
    fontSize: 14,
  },
  quoteBlock: {
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: "#e4e9ff",
    paddingTop: 10,
  },
  quoteHeading: {
    color: "#51608f",
    fontSize: 12,
    marginBottom: 6,
    fontFamily: "Manrope_700Bold",
  },
  quoteText: {
    color: "#3f4b7c",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
    fontFamily: "Manrope_500Medium",
    fontStyle: "italic",
  },
  resultCard: {
    borderColor: "#d2dcff",
    backgroundColor: "#ffffff",
    marginBottom: 18,
  },
  structuredItem: {
    marginBottom: 14,
  },
  structuredRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  structuredBullet: {
    width: 16,
    fontSize: Platform.OS === "web" ? 14 : 15,
    lineHeight: Platform.OS === "web" ? 22 : 24,
    color: "#2f3f86",
    fontFamily: "Manrope_700Bold",
  },
  structuredContent: {
    flex: 1,
  },
  structuredTitle: {
    fontSize: Platform.OS === "web" ? 14 : 15,
    color: "#2f3f86",
    fontFamily: "Manrope_700Bold",
    marginBottom: 4,
  },
  structuredBody: {
    fontSize: Platform.OS === "web" ? 14 : 15,
    lineHeight: Platform.OS === "web" ? 22 : 24,
    color: "#3f4b7c",
    fontFamily: "Manrope_500Medium",
  },
  resultsGrid: {
    width: "100%",
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: Platform.OS === "web" ? "wrap" : "nowrap",
    justifyContent: "space-between",
  },
  resultCardHalf: {
    width: "49%",
  },
  resultCardFull: {
    width: "100%",
  },
});
