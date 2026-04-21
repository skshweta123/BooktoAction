export type GoalId =
  | "productivity"
  | "leadership"
  | "career-growth"
  | "personal-development";

export type ResultTabId = "summary" | "ideas" | "framework" | "plan" | "mistakes";

export type Goal = {
  id: GoalId;
  label: string;
  icon: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  pdfAssetPath: string;
};

export type GoalResult = {
  summary: string[];
  quotes: string[];
  ideas: string[];
  framework: string[];
  plan: string[];
  mistakes: string[];
};

export const GOALS: Goal[] = [
  { id: "productivity", label: "Productivity", icon: "⚡" },
  { id: "leadership", label: "Leadership", icon: "🏆" },
  { id: "career-growth", label: "Career Growth", icon: "📈" },
  { id: "personal-development", label: "Personal Development", icon: "🚀" },
];

export const BOOKS: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    pdfAssetPath: "assets/books/Atomic_habits.pdf",
  },
  {
    id: "as-a-man-thinketh",
    title: "As a Man Thinketh",
    author: "James Allen",
    pdfAssetPath: "assets/books/As_a_man_thinketh.pdf",
  },
  {
    id: "encyclopaedia-britannica",
    title: "Encyclopaedia Britannica",
    author: "Various",
    pdfAssetPath: "assets/books/Encyclopaedia_Britannica.pdf",
  },
  {
    id: "enquire-within-upon-everything",
    title: "Enquire Within Upon Everything",
    author: "Robert Kemp Philp",
    pdfAssetPath: "assets/books/Enquire within upon everything.pdf",
  },
  {
    id: "the-art-of-money-getting",
    title: "The Art of Money Getting",
    author: "P. T. Barnum",
    pdfAssetPath: "assets/books/The_art_of_money_getting.pdf",
  },
  {
    id: "the-art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    pdfAssetPath: "assets/books/The_Art_of_War.pdf",
  },
  {
    id: "the-book-of-business-etiquette",
    title: "The Book of Business Etiquette",
    author: "Nella Henney",
    pdfAssetPath: "assets/books/The_Book_of_Business_Etiquette.pdf",
  },
  {
    id: "the-elements-of-style",
    title: "The Elements of Style",
    author: "William Strunk Jr. and E. B. White",
    pdfAssetPath: "assets/books/The_Elements_of_Style.pdf",
  },
  {
    id: "the-psychology-of-management",
    title: "The Psychology of Management",
    author: "L. M. Gilbreth",
    pdfAssetPath: "assets/books/The_Psychology_of_Management.pdf",
  },
  {
    id: "the-science-of-getting-rich",
    title: "The Science of Getting Rich",
    author: "Wallace D. Wattles",
    pdfAssetPath: "assets/books/The_Science_of_Getting_Rich.pdf",
  },
];

export const TAB_META: Array<{ id: ResultTabId; label: string; title: string }> = [
  { id: "summary", label: "Summary", title: "3-Minute Summary" },
  { id: "ideas", label: "Key Ideas", title: "Key Ideas" },
  { id: "framework", label: "Framework", title: "Framework" },
  { id: "plan", label: "Plan", title: "Action Plan" },
  { id: "mistakes", label: "Mistakes", title: "Mistakes to Avoid" },
];

const BOOK_THEMES: Record<string, string> = {
  "atomic-habits": "habit formation and behavior design",
  "as-a-man-thinketh": "thought discipline and mindset",
  "encyclopaedia-britannica": "structured knowledge and reference learning",
  "enquire-within-upon-everything": "practical life guidance and utility",
  "the-art-of-money-getting": "ethical wealth creation and money behavior",
  "the-art-of-war": "strategy, positioning, and decision advantage",
  "the-book-of-business-etiquette": "professional conduct and business relationships",
  "the-elements-of-style": "clear writing and communication craft",
  "the-psychology-of-management": "human behavior in management systems",
  "the-science-of-getting-rich": "wealth mindset and intentional action",
};

const GOAL_FOCUS: Record<GoalId, string> = {
  productivity: "execution speed and consistency",
  leadership: "influence and team direction",
  "career-growth": "skill visibility and opportunities",
  "personal-development": "self-mastery and personal discipline",
};

function buildGoalResult(bookTitle: string, theme: string, goalId: GoalId): GoalResult {
  const focus = GOAL_FOCUS[goalId];
  const summaryLongA = `${bookTitle} presents a practical lens on ${theme}, and this action plan translates that lens into daily execution for ${focus}. Rather than treating progress as a one-time breakthrough, the book's logic is to design repeatable systems, measure what matters, and improve in loops. In this context, your goal is not only to complete tasks, but to build durable behaviors that produce predictable outcomes. By applying small but disciplined routines, you reduce decision fatigue, increase clarity, and create momentum that compounds every week. This approach is especially effective when you focus on one improvement track at a time, review it consistently, and make environment-level changes that support the desired behavior.`;
  const summaryLongB = `For practical use, treat the book as an operating manual: extract one principle, convert it into a concrete action, and attach it to a specific time window in your week. Then track evidence of execution, not intention. Over a month, this structured approach strengthens confidence, improves consistency, and makes progress visible across both performance and decision quality.`;
  return {
    summary: [summaryLongA, summaryLongB],
    quotes: [
      `"Small repeated actions become your long-term advantage."`,
      `"Clarity plus consistency beats intensity without direction."`,
      `"What you schedule, track, and review is what improves."`,
    ],
    ideas: [
      `Define a single weekly priority connected to ${focus}, and protect it with calendar boundaries.`,
      `Convert abstract lessons from ${bookTitle} into visible routines with a clear start trigger.`,
      `Measure output quality, not only output quantity, to avoid busy-work disguised as progress.`,
      `Use constraint-based planning: decide what to stop doing before adding new commitments.`,
      `Build reflection into your cycle so each week improves the design of the next week.`,
      `Treat your environment as leverage: tools, workspace, and defaults should make execution easier.`,
    ],
    framework: [
      `O-D-E-R Loop (Observe, Design, Execute, Review): Observe blockers, design a low-friction routine, execute at minimum viable scale, and review outcomes every 7 days.`,
      `Priority Stack Framework: One primary objective, two supporting tasks, and one measurable signal for ${focus}. This keeps attention narrow and progress visible.`,
      `Habit-to-Outcome Chain: Habit -> Process Metric -> Outcome Metric. This links daily behavior to real-world results and avoids motivational drift.`,
      `Recovery Buffer Rule: Reserve 15-20% schedule capacity for overruns and uncertainty so the system stays sustainable under pressure.`,
    ],
    plan: [
      `Week 1 - Setup: Select one core behavior from ${bookTitle}, define baseline metrics, and schedule fixed execution windows.`,
      `Week 2 - Stability: Run the behavior daily, remove friction points, and track adherence with simple yes/no completion.`,
      `Week 3 - Expansion: Add one supporting behavior that directly improves ${focus}; keep review cadence unchanged.`,
      `Week 4 - Optimization: Analyze trend data, document what worked, and create your next 30-day iteration plan.`,
      `Monthly checkpoint: Summarize wins, blockers, and one non-negotiable standard for the next month.`,
    ],
    mistakes: [
      `Copying ideas from ${bookTitle} without adapting to your context.`,
      `Trying too many behavior changes at once instead of one stable loop.`,
      `Skipping weekly review and losing visibility on progress.`,
      `Confusing activity volume with meaningful progress in ${focus}.`,
    ],
  };
}

export const BOOK_GOAL_RESULTS: Record<string, Record<GoalId, GoalResult>> = BOOKS.reduce(
  (allBooks, book) => {
    const theme = BOOK_THEMES[book.id] ?? "practical execution";
    allBooks[book.id] = {
      productivity: buildGoalResult(book.title, theme, "productivity"),
      leadership: buildGoalResult(book.title, theme, "leadership"),
      "career-growth": buildGoalResult(book.title, theme, "career-growth"),
      "personal-development": buildGoalResult(book.title, theme, "personal-development"),
    };
    return allBooks;
  },
  {} as Record<string, Record<GoalId, GoalResult>>,
);
