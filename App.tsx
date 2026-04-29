import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import * as Speech from "expo-speech";
import {
  Animated,
  Image,
  type ImageSourcePropType,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BOOKS,
  GOALS,
  TAB_META,
  getResultForSelection,
  type GoalId,
  type GoalResult,
  type ResultTabId,
} from "./src/features/book-to-action/data";

type Screen = "home" | "loading" | "results";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>(["productivity"]);
  const [selectedBookId, setSelectedBookId] = useState(BOOKS[0].id);
  const [activeTab, setActiveTab] = useState<ResultTabId>("framework");
  const [selectionError, setSelectionError] = useState("");
  const [speakingGoalId, setSpeakingGoalId] = useState<string | null>(null);
  const [bookScrollX, setBookScrollX] = useState(0);
  const [bookViewportWidth, setBookViewportWidth] = useState(0);
  const [bookContentWidth, setBookContentWidth] = useState(0);
  const rotateAnim = useState(new Animated.Value(0))[0];
  const bookScrollRef = useRef<ScrollView | null>(null);

  const selectedBook = BOOKS.find((book) => book.id === selectedBookId) ?? BOOKS[0];
  const selectedGoalLabels = selectedGoals
    .map((goalId) => GOALS.find((goal) => goal.id === goalId)?.label ?? "")
    .filter(Boolean);
  const resultForSelection = getResultForSelection(selectedBook.id, selectedGoals);
  const speakingKey = `${selectedBook.id}:${selectedGoals.join("+")}`;

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
    setActiveTab("framework");
    setSpeakingGoalId(null);
    Speech.stop();
    setScreen("loading");
  };

  const speakSummary = (summaryKey: string, summary: string[], quotes: string[]) => {
    if (speakingGoalId === summaryKey) {
      Speech.stop();
      setSpeakingGoalId(null);
      return;
    }

    const text = [...summary, "Notable quotes.", ...quotes].join(" ");
    Speech.stop();
    setSpeakingGoalId(summaryKey);
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

  const getBookPlaceholder = (title: string) => {
    const initials = title
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("");
    return initials || "BK";
  };

  const getBookCoverSource = (bookId: string): ImageSourcePropType | null => {
    if (bookId === "atomic-habits") return require("./assets/covers/Atomic_Habits.jpg");
    if (bookId === "as-a-man-thinketh") return require("./assets/covers/As_a_Man_Thinketh.jpeg");
    if (bookId === "encyclopaedia-britannica") return require("./assets/covers/Encyclopaedia_Britannica.jpg");
    if (bookId === "enquire-within-upon-everything") return require("./assets/covers/Enquire_Within_Upon_Everything.jpg");
    if (bookId === "the-art-of-money-getting") return require("./assets/covers/The_Art_of_Money_Getting.jpg");
    if (bookId === "the-art-of-war") return require("./assets/covers/The_Art_of_War.jpg");
    if (bookId === "the-book-of-business-etiquette") return require("./assets/covers/The_Book_of_Business_Etiquette.jpg");
    if (bookId === "the-elements-of-style") return require("./assets/covers/The_Elements_of_Style.jpg");
    if (bookId === "the-psychology-of-management") return require("./assets/covers/The_Psychology_of_Management.jpg");
    if (bookId === "the-science-of-getting-rich") return require("./assets/covers/The_Science_of_Getting_Rich.jpg");
    return null;
  };

  const canScrollLeft = bookScrollX > 8;
  const canScrollRight = bookScrollX + bookViewportWidth < bookContentWidth - 8;

  const scrollBooks = (direction: "left" | "right") => {
    const step = Math.max(160, bookViewportWidth * 0.75);
    const maxX = Math.max(0, bookContentWidth - bookViewportWidth);
    const nextX = direction === "left" ? Math.max(0, bookScrollX - step) : Math.min(maxX, bookScrollX + step);
    bookScrollRef.current?.scrollTo({ x: nextX, animated: true });
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.appContainer}>

      {screen === "home" && (
        <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Image source={require("./assets/icon.png")} style={styles.logoImage} resizeMode="cover" />
            </View>
            <Text style={styles.title}>Book to Action</Text>
            <Text style={styles.subtitle}>Turn books into action</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Categories</Text>
            <Text style={styles.sectionCaption}>Select multiple categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <Pressable
                    key={goal.id}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                    onPress={() => toggleGoal(goal.id)}
                  >
                    <Text style={styles.categoryChipIcon}>{goal.icon}</Text>
                    <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                      {goal.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {selectionError ? <Text style={styles.errorText}>{selectionError}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pick a book</Text>
            <Text style={styles.sectionCaption}>Tap a card or use arrows to browse</Text>
            <View
              style={styles.booksCarouselRow}
              onLayout={(event) => setBookViewportWidth(Math.max(0, event.nativeEvent.layout.width))}
            >
              <Pressable
                style={[styles.arrowSide, !canScrollLeft && styles.arrowButtonDisabled]}
                onPress={() => scrollBooks("left")}
                disabled={!canScrollLeft}
              >
                <Text style={styles.arrowButtonText}>‹</Text>
              </Pressable>
              <ScrollView
                ref={bookScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                style={styles.booksScroll}
                contentContainerStyle={styles.booksScrollContent}
                onContentSizeChange={(width) => setBookContentWidth(width)}
                onScroll={(event) => setBookScrollX(event.nativeEvent.contentOffset.x)}
                scrollEventThrottle={16}
              >
                {BOOKS.map((book) => {
                  const isSelected = selectedBookId === book.id;
                  const bookCoverSource = getBookCoverSource(book.id);
                  return (
                    <Pressable
                      key={book.id}
                      style={[styles.bookCard, isSelected && styles.bookCardActive]}
                      onPress={() => setSelectedBookId(book.id)}
                    >
                      {bookCoverSource ? (
                        <Image source={bookCoverSource} style={styles.bookCoverImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.bookCoverPlaceholder}>
                          <Text style={styles.bookCoverPlaceholderText}>{getBookPlaceholder(book.title)}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Pressable
                style={[styles.arrowSide, !canScrollRight && styles.arrowButtonDisabled]}
                onPress={() => scrollBooks("right")}
                disabled={!canScrollRight}
              >
                <Text style={styles.arrowButtonText}>›</Text>
              </Pressable>
            </View>
            <Text style={styles.selectedBookMeta}>
              Selected: {selectedBook.title} by {selectedBook.author}
            </Text>
          </View>

          <Pressable style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startText}>Create Action Plan</Text>
            <Text style={styles.startArrow}>→</Text>
          </Pressable>
        </ScrollView>
      )}

      {screen === "loading" && (
        <View style={styles.loadingWrap}>
          <View style={styles.loadingBrand}>
            <Image source={require("./assets/icon.png")} style={styles.loadingBrandImage} resizeMode="cover" />
          </View>
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
            <View style={styles.topBarLeft}>
              <Pressable onPress={() => setScreen("home")}>
                <Text style={styles.topLink}>← Back</Text>
              </Pressable>
            </View>
            <Pressable style={styles.homeBtn} onPress={() => setScreen("home")}>
              <Image source={require("./assets/icon.png")} style={styles.homeBtnIconImage} resizeMode="cover" />
            </Pressable>
          </View>

          <View style={styles.resultHeader}>
            <Text style={styles.resultLabel}>YOUR ACTION PLAN</Text>
            <Text style={styles.resultBook}>{selectedBook.title}</Text>
            <Text style={styles.resultAuthor}>by {selectedBook.author}</Text>
            <Text style={styles.resultGoal}>
              Your plan for{" "}
              {selectedGoalLabels.join(", ")}
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
              const goalMetaLabel = selectedGoalLabels.join(" + ");
              const result = resultForSelection;
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
                      {tabTitle} - {goalMetaLabel}
                    </Text>
                    {activeTab === "summary" && result ? (
                      <Pressable
                        onPress={() => speakSummary(speakingKey, result.summary, result.quotes)}
                        style={[styles.audioIconButton, speakingGoalId === speakingKey && styles.audioIconButtonActive]}
                      >
                        <Text style={styles.audioIcon}>{speakingGoalId === speakingKey ? "⏹" : "🔊"}</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  {activeTab === "summary" && result ? (
                    <>
                      {lines.map((line, index) => {
                        if (line.trim() === "---") {
                          return <View key={`summary-divider-${index}`} style={styles.hierarchyDivider} />;
                        }
                        const isHeading = line.endsWith(":");
                        return (
                          <Text
                            key={`summary-${index}-${line}`}
                            style={isHeading ? styles.hierarchyHeadingText : styles.sectionText}
                          >
                            {line}
                          </Text>
                        );
                      })}
                      <View style={styles.quoteBlock}>
                        <Text style={styles.quoteHeading}>Notable lines</Text>
                        {result.quotes.map((quote, index) => (
                          <Text key={`quote-${index}-${quote}`} style={styles.quoteText}>
                            "{quote.replace(/^"|"$/g, "")}"
                          </Text>
                        ))}
                      </View>
                    </>
                  ) : activeTab === "framework" || activeTab === "plan" ? (
                    lines.map((line, index) => {
                      if (line.trim() === "---") {
                        return <View key={`divider-${activeTab}-${index}`} style={styles.hierarchyDivider} />;
                      }

                      const isSubPoint = line.startsWith("  - ");
                      if (isSubPoint) {
                        return (
                          <View key={`sub-${activeTab}-${index}-${line}`} style={styles.hierarchySubRow}>
                            <Text style={styles.hierarchySubBullet}>•</Text>
                            <Text style={styles.hierarchySubText}>{line.replace("  - ", "")}</Text>
                          </View>
                        );
                      }

                      const isHeading = line.endsWith(":");
                      const isFrameworkName =
                        activeTab === "framework" &&
                        !isSubPoint &&
                        !isHeading &&
                        !line.includes(":") &&
                        line.trim().length > 0;
                      return (
                        <Text
                          key={`hierarchy-${activeTab}-${index}-${line}`}
                          style={
                            isFrameworkName
                              ? styles.hierarchyFrameworkNameText
                              : activeTab === "plan" && isHeading
                                ? styles.hierarchyPlanTitleText
                              : isHeading
                                ? styles.hierarchyHeadingText
                                : styles.hierarchyBodyText
                          }
                        >
                          {line}
                        </Text>
                      );
                    })
                  ) : activeTab === "ideas" || activeTab === "mistakes" ? (
                    lines.map((line, index) => {
                      if (line.trim() === "---") {
                        return <View key={`divider-${activeTab}-${index}`} style={styles.hierarchyDivider} />;
                      }
                      const isSubPoint = line.startsWith("  - ");
                      if (isSubPoint) {
                        return (
                          <View key={`sub-${activeTab}-${index}-${line}`} style={styles.hierarchySubRow}>
                            <Text style={styles.hierarchySubBullet}>•</Text>
                            <Text style={styles.hierarchySubText}>{line.replace("  - ", "")}</Text>
                          </View>
                        );
                      }
                      const isHeading = line.endsWith(":");
                      if (isHeading) {
                        return (
                          <Text key={`heading-${activeTab}-${index}-${line}`} style={styles.hierarchyHeadingText}>
                            {line}
                          </Text>
                        );
                      }
                      return (
                        <Text key={`bullet-${activeTab}-${index}-${line}`} style={styles.bulletText}>
                          • {line}
                        </Text>
                      );
                    })
                  ) : null}
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
    backgroundColor: "#f3f4f6",
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  hero: {
    alignItems: "center",
    marginBottom: 12,
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
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  title: {
    fontSize: Platform.OS === "web" ? 24 : 22,
    lineHeight: Platform.OS === "web" ? 28 : 26,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.4,
    color: "#111827",
  },
  subtitle: {
    marginTop: 2,
    fontSize: Platform.OS === "web" ? 14 : 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#4b5563",
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: Platform.OS === "web" ? 14 : 13,
    marginBottom: 12,
    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: Platform.OS === "web" ? 20 : 19,
    lineHeight: Platform.OS === "web" ? 26 : 24,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.35,
    color: "#111827",
    marginBottom: 4,
    textAlign: "left",
  },
  sectionCaption: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "Manrope_600SemiBold",
    marginBottom: 10,
    textAlign: "left",
  },
  categoryScroll: {
    marginHorizontal: -2,
  },
  categoryScrollContent: {
    paddingRight: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#e8edff",
    borderColor: "#84a0ff",
  },
  categoryChipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: "#1f2937",
    fontFamily: "Manrope_700Bold",
  },
  categoryChipTextActive: {
    color: "#1d4ed8",
    fontFamily: "Manrope_700Bold",
  },
  booksScroll: {
    flex: 1,
  },
  booksScrollContent: {
    paddingHorizontal: 0,
    paddingRight: 0,
  },
  booksCarouselRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  arrowSide: {
    width: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDisabled: {
    opacity: 0.25,
  },
  arrowButtonText: {
    fontSize: 30,
    lineHeight: 30,
    color: "#111827",
    fontFamily: "Manrope_700Bold",
    marginTop: -2,
  },
  bookCard: {
    width: Platform.OS === "web" ? 170 : 150,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: 4,
    marginRight: 8,
  },
  bookCardActive: {
    borderColor: "#7e99ff",
    backgroundColor: "#edf2ff",
  },
  bookCoverPlaceholder: {
    height: Platform.OS === "web" ? 220 : 190,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  bookCoverImage: {
    height: Platform.OS === "web" ? 220 : 190,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  bookCoverPlaceholderText: {
    fontSize: 28,
    color: "#374151",
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.5,
  },
  selectedBookMeta: {
    marginTop: 10,
    fontSize: 13,
    color: "#4b5563",
    fontFamily: "Manrope_600SemiBold",
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
    fontSize: Platform.OS === "web" ? 14 : 14,
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
    fontSize: Platform.OS === "web" ? 14 : 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1f275b",
  },
  selectArrow: {
    fontSize: 20,
    color: "#6875a8",
  },
  startButton: {
    borderRadius: 999,
    backgroundColor: "#1665f5",
    paddingVertical: Platform.OS === "web" ? 13 : 14,
    paddingHorizontal: 28,
    minWidth: Platform.OS === "web" ? 260 : 220,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
    shadowColor: "#1665f5",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 0,
  },
  startText: {
    color: "#ffffff",
    fontSize: Platform.OS === "web" ? 16 : 16,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0,
  },
  startArrow: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    marginTop: -1,
  },
  logoutButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d2dcff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
  },
  logoutButtonText: {
    color: "#4253a8",
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
  },
  loadingWrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 110,
  },
  loadingBrand: {
    width: 68,
    height: 68,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 14,
    shadowColor: "#1d2559",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  loadingBrandImage: {
    width: "100%",
    height: "100%",
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
  topBarLeft: {
    minWidth: 84,
  },
  topLink: {
    color: "#3a477e",
    fontSize: Platform.OS === "web" ? 18 : 17,
    fontFamily: "Manrope_600SemiBold",
  },
  homeBtn: {
    borderRadius: 12,
    width: 42,
    height: 42,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1d2559",
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  homeBtnIconImage: {
    width: "100%",
    height: "100%",
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
    fontSize: Platform.OS === "web" ? 24 : 18,
    lineHeight: Platform.OS === "web" ? 32 : 24,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.35,
    marginBottom: 2,
  },
  resultAuthor: {
    color: "#5d6898",
    fontSize: Platform.OS === "web" ? 13 : 13,
    fontFamily: "Manrope_500Medium",
    marginBottom: 12,
  },
  resultGoal: {
    color: "#475489",
    fontSize: Platform.OS === "web" ? 13 : 14,
    fontFamily: "Manrope_500Medium",
    marginBottom: 10,
  },
  tabsWrap: {
    marginBottom: 16,
  },
  tabsContent: {
    paddingRight: Platform.OS === "web" ? 12 : 18,
    paddingLeft: Platform.OS === "web" ? 0 : 2,
    paddingBottom: 2,
  },
  tab: {
    borderWidth: 1,
    borderColor: "#ccd7ff",
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    paddingHorizontal: Platform.OS === "web" ? 9 : 8,
    paddingVertical: Platform.OS === "web" ? 6 : 5,
    marginRight: Platform.OS === "web" ? 6 : 4,
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
    fontSize: Platform.OS === "web" ? 12 : 11,
    fontFamily: "Manrope_600SemiBold",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  sectionTitle: {
    flex: 1,
    fontSize: Platform.OS === "web" ? 18 : 17,
    lineHeight: Platform.OS === "web" ? 25 : 23,
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
    fontSize: Platform.OS === "web" ? 14 : 14,
    lineHeight: Platform.OS === "web" ? 22 : 22,
    color: "#3f4b7c",
    marginBottom: 10,
    fontFamily: "Manrope_500Medium",
  },
  bulletText: {
    fontSize: Platform.OS === "web" ? 14 : 14,
    lineHeight: Platform.OS === "web" ? 22 : 22,
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
    fontSize: Platform.OS === "web" ? 14 : 14,
    lineHeight: Platform.OS === "web" ? 22 : 22,
    color: "#2f3f86",
    fontFamily: "Manrope_700Bold",
  },
  structuredContent: {
    flex: 1,
  },
  structuredTitle: {
    fontSize: Platform.OS === "web" ? 14 : 14,
    color: "#2f3f86",
    fontFamily: "Manrope_700Bold",
    marginBottom: 4,
  },
  structuredBody: {
    fontSize: Platform.OS === "web" ? 14 : 14,
    lineHeight: Platform.OS === "web" ? 22 : 22,
    color: "#3f4b7c",
    fontFamily: "Manrope_500Medium",
  },
  hierarchyHeadingText: {
    fontSize: Platform.OS === "web" ? 15 : 15,
    lineHeight: Platform.OS === "web" ? 23 : 21,
    color: "#2f3f86",
    fontFamily: "Manrope_700Bold",
    marginBottom: 8,
    marginTop: 4,
  },
  hierarchyFrameworkNameText: {
    fontSize: Platform.OS === "web" ? 18 : 17,
    lineHeight: Platform.OS === "web" ? 26 : 23,
    color: "#1f275b",
    fontFamily: "Manrope_700Bold",
    marginBottom: 10,
    marginTop: 8,
  },
  hierarchyPlanTitleText: {
    fontSize: Platform.OS === "web" ? 18 : 17,
    lineHeight: Platform.OS === "web" ? 26 : 23,
    color: "#1f275b",
    fontFamily: "Manrope_700Bold",
    marginBottom: 10,
    marginTop: 8,
  },
  hierarchyBodyText: {
    fontSize: Platform.OS === "web" ? 14 : 14,
    lineHeight: Platform.OS === "web" ? 22 : 22,
    color: "#3f4b7c",
    fontFamily: "Manrope_500Medium",
    marginBottom: 8,
  },
  hierarchyDivider: {
    borderTopWidth: 1,
    borderTopColor: "#c7d4ff",
    marginVertical: 10,
  },
  hierarchySubRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 14,
    marginBottom: 8,
  },
  hierarchySubBullet: {
    width: 14,
    fontSize: Platform.OS === "web" ? 13 : 13,
    lineHeight: Platform.OS === "web" ? 22 : 22,
    color: "#2f3f86",
    fontFamily: "Manrope_700Bold",
  },
  hierarchySubText: {
    flex: 1,
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
