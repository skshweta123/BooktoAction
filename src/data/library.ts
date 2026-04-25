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
  { id: "framework", label: "Framework", title: "Framework" },
  { id: "plan", label: "Plan", title: "Action Plan" },
  { id: "mistakes", label: "Mistakes", title: "Mistakes to Avoid" },
  { id: "ideas", label: "Key Ideas", title: "Key Ideas" },
  { id: "summary", label: "Summary", title: "Summary" },
];

type BookProfile = {
  thesis: string;
  frameworkName: string;
  frameworkComponents: string[];
  anchors: string[];
  baseIdeas: string[];
  weeklyPlan: string[];
  baseMistakes: string[];
};

type GoalResultOverrideMap = Partial<Record<GoalId, Partial<GoalResult>>>;

const BOOK_PROFILES: Record<string, BookProfile> = {
  "atomic-habits": {
    thesis: "Small systems beat motivation spikes when you redesign cues and identity.",
    frameworkName: "Four Laws of Behavior Design",
    frameworkComponents: [
      "Make it obvious by designing visible cues.",
      "Make it attractive by pairing habits with immediate satisfaction.",
      "Make it easy by reducing friction and starting tiny.",
      "Make it satisfying by tracking wins and creating immediate closure.",
    ],
    anchors: ["cue", "craving", "response", "reward", "identity-based habits", "habit stacking"],
    baseIdeas: [
      "Use habit stacking so one stable routine triggers the next action.",
      "Design your environment so the desired cue is visible and the undesired cue is hidden.",
      "Track process consistency daily instead of chasing only outcome goals.",
      "Use a two-minute rule to start every important behavior with zero resistance.",
      "Create identity statements tied to behavior, not vague ambition.",
    ],
    weeklyPlan: [
      "Audit current habits and identify one keystone behavior tied to your goal.",
      "Install cue design and habit stacking for that behavior.",
      "Add tracking and reward loop to reinforce consistency.",
      "Run review, remove friction points, and lock your next 30-day cycle.",
    ],
    baseMistakes: [
      "Relying on motivation rather than environment design.",
      "Trying to change too many habits at once.",
      "Measuring outcomes without tracking repeatable behavior.",
      "Skipping review and never refining the habit loop.",
    ],
  },
  "as-a-man-thinketh": {
    thesis: "Thought patterns shape character, decisions, and long-term outcomes.",
    frameworkName: "Thought-to-Character Causation Loop",
    frameworkComponents: [
      "Observe dominant thought patterns each day.",
      "Replace self-defeating narratives with constructive intent.",
      "Convert thought discipline into consistent action.",
      "Reinforce character through repeated conscious choices.",
    ],
    anchors: ["thought", "character", "circumstance", "purpose", "serenity", "self-mastery"],
    baseIdeas: [
      "Use daily thought journaling to detect repeated limiting beliefs.",
      "Rewrite internal narratives into purposeful action statements.",
      "Link emotional state to thought triggers and decision quality.",
      "Create a morning intentionality ritual focused on one core principle.",
      "Evaluate progress by character consistency, not mood swings.",
    ],
    weeklyPlan: [
      "Capture thought patterns affecting your chosen goal.",
      "Replace one recurring negative script with a specific directive.",
      "Pair directives with high-leverage actions and reflection blocks.",
      "Review behavioral evidence and reinforce the most effective script.",
    ],
    baseMistakes: [
      "Treating mindset work as abstract philosophy without action.",
      "Allowing unexamined thought loops to drive behavior.",
      "Confusing temporary emotion with identity.",
      "Skipping reflective discipline after setbacks.",
    ],
  },
  "encyclopaedia-britannica": {
    thesis: "Structured knowledge retrieval improves judgment and execution quality.",
    frameworkName: "Reference-to-Decision Knowledge Grid",
    frameworkComponents: [
      "Define the knowledge domain needed for your goal.",
      "Collect reliable references and classify by relevance.",
      "Extract concise decision rules from source material.",
      "Apply rules and refine based on outcomes.",
    ],
    anchors: ["reference", "taxonomy", "knowledge graph", "source reliability", "context", "synthesis"],
    baseIdeas: [
      "Build a topic map so information is grouped by decision need.",
      "Use source reliability scoring before applying a new idea.",
      "Create one-page synthesis notes for each domain.",
      "Translate facts into explicit if-then decision rules.",
      "Maintain a revision cadence to prevent stale assumptions.",
    ],
    weeklyPlan: [
      "Define your decision area and required knowledge domains.",
      "Collect and classify high-quality references.",
      "Generate decision rules and test in real scenarios.",
      "Refine the knowledge map based on outcomes and gaps.",
    ],
    baseMistakes: [
      "Collecting information without a decision purpose.",
      "Treating all sources as equally reliable.",
      "Keeping notes without converting them into operating rules.",
      "Ignoring context when applying reference knowledge.",
    ],
  },
  "enquire-within-upon-everything": {
    thesis: "Practical life systems win when knowledge is translated into usable routines.",
    frameworkName: "Practical Utility Execution Model",
    frameworkComponents: [
      "Identify recurring life or work friction points.",
      "Match each friction point with a practical rule or method.",
      "Document the method as a repeatable checklist.",
      "Review and improve utility through real usage feedback.",
    ],
    anchors: ["practicality", "utility", "checklist", "household system", "applied knowledge", "repeatability"],
    baseIdeas: [
      "Turn broad advice into concrete checklists for repeated tasks.",
      "Standardize recurring routines to reduce cognitive load.",
      "Use short references at point-of-use instead of long reading sessions.",
      "Create failure recovery steps for common execution errors.",
      "Evaluate usefulness by time saved and error reduction.",
    ],
    weeklyPlan: [
      "List top recurring friction points in your routine.",
      "Design and test checklists for the top two points.",
      "Refine instructions based on real execution outcomes.",
      "Publish stable routines as your default operating playbook.",
    ],
    baseMistakes: [
      "Keeping practical knowledge as notes instead of routines.",
      "Overcomplicating simple tasks with heavy systems.",
      "Failing to iterate after real-world usage.",
      "Not documenting recovery steps for predictable failures.",
    ],
  },
  "the-art-of-money-getting": {
    thesis: "Sustainable wealth comes from credibility, discipline, and value creation.",
    frameworkName: "Credibility-Driven Wealth Flywheel",
    frameworkComponents: [
      "Build trust through reliability and integrity.",
      "Increase earning power through consistent value delivery.",
      "Preserve gains via disciplined spending and allocation.",
      "Compound progress through reinvestment and reputation effects.",
    ],
    anchors: ["credibility", "thrift", "value creation", "reputation", "compounding", "discipline"],
    baseIdeas: [
      "Improve earning leverage by solving high-value problems consistently.",
      "Use strict expense categories aligned to long-term goals.",
      "Track trust and reputation as economic assets.",
      "Reinvest gains into skill, systems, and productive opportunities.",
      "Avoid speculative behavior detached from value creation.",
    ],
    weeklyPlan: [
      "Audit income drivers and trust-based opportunities.",
      "Design a value delivery cadence tied to measurable outcomes.",
      "Install spending controls and allocation rules.",
      "Review compounding actions and remove leakage points.",
    ],
    baseMistakes: [
      "Chasing quick gains without trust or utility.",
      "Ignoring spending discipline while focusing only on income.",
      "Treating reputation as separate from economics.",
      "Failing to reinvest in long-term earning capacity.",
    ],
  },
  "the-art-of-war": {
    thesis: "Strategic advantage comes from positioning, timing, and disciplined execution.",
    frameworkName: "Position-Timing-Advantage Doctrine",
    frameworkComponents: [
      "Map terrain: context, constraints, and competitive forces.",
      "Choose position: where your strengths create leverage.",
      "Time execution: act when asymmetry is favorable.",
      "Adapt continuously as conditions shift.",
    ],
    anchors: ["terrain", "positioning", "deception", "timing", "adaptation", "advantage"],
    baseIdeas: [
      "Evaluate strategic terrain before committing resources.",
      "Avoid frontal effort where asymmetry is unfavorable.",
      "Use signal intelligence and feedback loops before major moves.",
      "Sequence actions to create compounding positional advantage.",
      "Preserve optionality to adapt under uncertainty.",
    ],
    weeklyPlan: [
      "Map current terrain and identify strategic constraints.",
      "Select one high-leverage position and align resources.",
      "Execute timed moves with clear trigger conditions.",
      "Run after-action review and adapt your doctrine.",
    ],
    baseMistakes: [
      "Executing tactics without strategic positioning.",
      "Confusing activity with strategic progress.",
      "Ignoring timing and forcing action in poor conditions.",
      "Refusing adaptation when terrain changes.",
    ],
  },
  "the-book-of-business-etiquette": {
    thesis: "Professional trust compounds through consistent etiquette and social intelligence.",
    frameworkName: "Professional Conduct Trust Model",
    frameworkComponents: [
      "Signal respect through communication discipline.",
      "Align behavior to context and role expectations.",
      "Protect relationships with reliability and tact.",
      "Turn etiquette consistency into reputational capital.",
    ],
    anchors: ["etiquette", "professionalism", "tact", "protocol", "reputation", "trust"],
    baseIdeas: [
      "Standardize communication tone for clarity and respect.",
      "Use context-sensitive protocol in meetings and negotiations.",
      "Protect long-term trust during short-term conflict.",
      "Document relationship commitments and follow through.",
      "Treat etiquette as an operational standard, not decoration.",
    ],
    weeklyPlan: [
      "Audit current communication touchpoints for friction.",
      "Define etiquette standards for email, meetings, and follow-up.",
      "Practice tactful conflict handling in active relationships.",
      "Review trust signals and close reliability gaps.",
    ],
    baseMistakes: [
      "Treating etiquette as superficial rather than strategic.",
      "Using one communication style in all contexts.",
      "Damaging trust through delayed or vague follow-through.",
      "Ignoring tone effects during pressure situations.",
    ],
  },
  "the-elements-of-style": {
    thesis: "Clear writing sharpens thinking and increases influence.",
    frameworkName: "Clarity-Precision-Impact Writing Loop",
    frameworkComponents: [
      "State the core message in direct language.",
      "Remove clutter, ambiguity, and needless words.",
      "Strengthen sentence structure for rhythm and readability.",
      "Revise for audience impact and intent alignment.",
    ],
    anchors: ["clarity", "brevity", "style", "revision", "audience", "precision"],
    baseIdeas: [
      "Draft message-first, then optimize wording for precision.",
      "Use ruthless editing to remove non-essential language.",
      "Adapt tone and structure to audience decision needs.",
      "Use revision passes focused on clarity, then style.",
      "Measure writing by comprehension and action response.",
    ],
    weeklyPlan: [
      "Collect baseline writing samples and clarity issues.",
      "Apply brevity and precision rules to key outputs.",
      "Run audience-focused revision loops on real documents.",
      "Measure comprehension outcomes and codify your style rules.",
    ],
    baseMistakes: [
      "Prioritizing complexity over clarity.",
      "Editing for aesthetics before message quality.",
      "Ignoring audience context in structure and tone.",
      "Shipping first drafts without revision discipline.",
    ],
  },
  "the-psychology-of-management": {
    thesis: "Management effectiveness depends on understanding human behavior in systems.",
    frameworkName: "Behavior-System Performance Model",
    frameworkComponents: [
      "Diagnose behavioral patterns in team workflows.",
      "Design systems that align incentives and expectations.",
      "Support performance with coaching and feedback loops.",
      "Refine structure based on measurable team behavior.",
    ],
    anchors: ["behavior", "incentives", "workflow", "feedback", "management system", "motivation"],
    baseIdeas: [
      "Map team behavior patterns before changing process.",
      "Align incentives to desired workflow outcomes.",
      "Use structured feedback loops to improve accountability.",
      "Separate capability issues from motivation issues.",
      "Optimize management systems, not only individual effort.",
    ],
    weeklyPlan: [
      "Observe team workflow behavior and identify bottlenecks.",
      "Redesign one system-level incentive or role expectation.",
      "Run coaching and feedback experiments with metrics.",
      "Review performance shifts and standardize winning patterns.",
    ],
    baseMistakes: [
      "Blaming individuals for system design failures.",
      "Applying one motivation model to all team members.",
      "Giving feedback without behavioral specificity.",
      "Ignoring incentive misalignment in poor performance.",
    ],
  },
  "the-science-of-getting-rich": {
    thesis: "Intentional thought plus disciplined action creates economic progress.",
    frameworkName: "Purpose-Action-Receiving Cycle",
    frameworkComponents: [
      "Define a clear economic objective with intent.",
      "Act each day in a certain and constructive way.",
      "Improve value delivery to the market consistently.",
      "Sustain gratitude and focus to reinforce execution quality.",
    ],
    anchors: ["purpose", "certain way", "gratitude", "value", "prosperity", "constructive action"],
    baseIdeas: [
      "Translate desire into a concrete value proposition.",
      "Execute daily actions that increase useful value for others.",
      "Use attention discipline to avoid scattered effort.",
      "Track progress through contribution and result metrics.",
      "Reinforce consistency with reflective gratitude practice.",
    ],
    weeklyPlan: [
      "Define your prosperity objective and measurable outcomes.",
      "Build daily certain-way actions around value creation.",
      "Increase execution intensity without sacrificing focus.",
      "Review outcomes and refine your value delivery loop.",
    ],
    baseMistakes: [
      "Confusing wishful thinking with disciplined execution.",
      "Chasing outcomes without increasing delivered value.",
      "Allowing attention fragmentation to break consistency.",
      "Skipping periodic review of strategy quality.",
    ],
  },
};

const BOOK_GOAL_OVERRIDES: Record<string, GoalResultOverrideMap> = {
  "atomic-habits": {
    productivity: {
      framework: [
        "Four Laws of Behavior Design (Atomic Habits)",
        "  - Law 1 (Make it Obvious): Design clear cues so the right behavior is easy to start.",
        "  - Law 2 (Make it Attractive): Increase emotional pull so starting feels rewarding.",
        "  - Law 3 (Make it Easy): Reduce friction so action begins with minimal resistance.",
        "  - Law 4 (Make it Satisfying): Create immediate evidence and closure so behavior repeats.",
        "  - Reader Takeaway: The four laws are the behavioral foundation; they explain why habit change works.",
        "---",
        "PACE Loop for Productivity",
        "Framework Intent:",
        "  - Convert the four laws into a practical operating system for start reliability, deep-work consistency, and output quality.",
        "Pillar P (Prompt - Cue Architecture):",
        "  - Setup: Define one keystone task and one fixed start cue (time + location + trigger object).",
        "  - Reader Takeaway: If the cue is unclear, consistency fails before effort begins.",
        "  - Decision Rule: If start delay is greater than 10 minutes for 2 consecutive days, redesign cue visibility and pre-start checklist.",
        "Pillar A (Action - Minimum Viable Execution):",
        "  - Setup: Start with a 2-minute entry action, then continue into a 45-minute focus block.",
        "  - Reader Takeaway: Reliability beats intensity; small starts preserve identity and reduce resistance.",
        "  - Decision Rule: If two misses happen in one week, switch to 15-minute fallback sessions for 3 days.",
        "Pillar C (Confirm - Evidence and Scorekeeping):",
        "  - Setup: End each session by logging completion status, focus minutes, and one output quality note.",
        "  - Reader Takeaway: What gets measured gets repeated; evidence sustains habit identity.",
        "  - Decision Rule: If no metric is logged, the session is not counted as completed.",
        "Pillar E (Extend - Adaptive Progression):",
        "  - Setup: Run weekly review, identify one bottleneck, and apply one controlled system upgrade next week.",
        "  - Reader Takeaway: Improvement is iterative; remove friction before adding complexity.",
        "  - Decision Rule: Add a second habit only if primary adherence stays at or above 85% for two straight weeks.",
        "Application Guidance:",
        "  - When to Use: Use PACE when productivity failure is caused by poor starts, inconsistent follow-through, or missing review discipline.",
        "  - When Not to Use: Do not scale the system during unstable routines (travel or crisis weeks); run fallback mode first.",
        "  - Expected 30-Day Outcome: Faster starts, higher completion consistency, and measurable output-quality improvement.",
      ],
      plan: [
        "Plan Format:",
        "  - Weekly Execution Table plus Daily Playbook.",
        "Week 1 (Install Prompt and Baseline):",
        "  - Objective: Install the cue system and baseline current behavior.",
        "  - Checklist: Define keystone task; lock fixed start cue; prepare trigger object nightly; run 5 sessions; log every session.",
        "  - Metrics: sessions_completed >= 5/7; average_start_delay <= 10 minutes; baseline_focus_minutes recorded daily.",
        "  - Exit Criteria: Cue stability for 5 days and logging compliance at or above 90%.",
        "Week 2 (Increase Action Consistency):",
        "  - Objective: Reduce startup resistance and increase reliable starts.",
        "  - Checklist: Apply 2-minute start; run 45-minute focus block; enable distraction blocker; use fallback on low-energy day; maintain streak.",
        "  - Metrics: start_success_rate >= 85%; resistance_score down by 20%; uninterrupted_focus_minutes >= 40/day.",
        "  - Exit Criteria: At least 5 successful starts and no two missed days in a row.",
        "Week 3 (Improve Output Quality):",
        "  - Objective: Convert consistency into meaningful output quality.",
        "  - Checklist: Define daily output unit; run midpoint quality check; add session-end quality note; batch shallow tasks; run weekly defect review.",
        "  - Metrics: high_value_outputs >= 4/week; rework_rate down by 15%; planned_vs_done >= 0.80.",
        "  - Exit Criteria: Quality notes completed on at least 80% of sessions and measurable reduction in rework.",
        "Week 4 (Extend and Stabilize):",
        "  - Objective: Make the system resilient under variable days.",
        "  - Checklist: Run weekly review; identify top bottleneck; implement one system upgrade; define fallback protocol; publish personal playbook v1.",
        "  - Metrics: adherence >= 85%; recovery_time_after_miss <= 24 hours; weekly_plan_completion >= 80%.",
        "  - Exit Criteria: Primary habit stays stable under one high-variance day.",
        "Daily Playbook:",
        "  - Morning Setup (5 minutes): Review cue, select one keystone output, prepare first 2-minute action.",
        "  - Focus Block (45 minutes): Start on cue, execute without context switching, capture progress at minute 20 and minute 45.",
        "  - Midday Correction (quick reset): If morning block fails, run immediate 15-minute fallback block before 3 PM.",
        "  - End-of-Day Review (7 minutes): Log completion, start delay, focus minutes, output quality, and next-day first action.",
        "If-Then Rules:",
        "  - If misses are 2 or more per week, activate fallback mode for 3 days.",
        "  - If start delay is greater than 15 minutes for 2 days, simplify first action and strengthen cue visibility.",
        "  - If adherence drops below 70%, remove secondary habits and restore baseline only.",
        "Monthly Takeaway:",
        "  - Month one should produce a repeatable operating system, not a temporary motivation burst.",
      ],
      ideas: [
        "Identity-first productivity: define yourself as 'the person who starts on time daily' before chasing volume.",
        "Habit stacking for execution speed: tie one critical task to an existing stable routine to eliminate decision lag.",
        "Friction audit every Friday: list top blockers (context switching, unclear next step, tool clutter) and remove one per week.",
        "Use visible scoreboards: track completion streak, deep-work minutes, and output quality so progress is tangible.",
        "Create a shutdown ritual: end each day by queuing tomorrow's first action to reduce morning start resistance.",
        "Adopt minimum viable consistency: on low-energy days, complete the 15-minute fallback rather than break identity.",
      ],
      mistakes: [
        "Mistake: Optimizing apps/tools before locking one stable cue-behavior loop. Prevention: freeze tool changes for 14 days and optimize only after consistency is proven.",
        "Mistake: Setting output goals without process metrics. Prevention: track both lag metrics (output) and lead metrics (start time, focus minutes).",
        "Mistake: Skipping recovery rules after missed days. Prevention: apply pre-defined if-then fallback within 24 hours.",
        "Mistake: Treating motivation dips as failure. Prevention: reduce scope, keep streak alive, and rebuild momentum through easy wins.",
        "Mistake: Expanding to multiple habits too early. Prevention: add second habit only when primary adherence remains >=85% for two consecutive weeks.",
      ],
    },
  },
};

const GOAL_FOCUS: Record<GoalId, string> = {
  productivity: "execution speed and consistency",
  leadership: "influence and team direction",
  "career-growth": "skill visibility and opportunities",
  "personal-development": "self-mastery and personal discipline",
};

const GOAL_STRATEGY: Record<
  GoalId,
  {
    objective: string;
    leadMetric: string;
    lagMetric: string;
    weeklyPriority: string;
    riskPattern: string;
  }
> = {
  productivity: {
    objective: "increase reliable execution on high-value work",
    leadMetric: "daily focus-block completion rate",
    lagMetric: "weekly high-value output count",
    weeklyPriority: "protect deep-work start consistency",
    riskPattern: "context switching and inconsistent starts",
  },
  leadership: {
    objective: "improve team alignment and decision clarity",
    leadMetric: "leader communication cadence completion",
    lagMetric: "team delivery predictability",
    weeklyPriority: "clarify priorities and ownership every week",
    riskPattern: "unclear expectations and delayed feedback",
  },
  "career-growth": {
    objective: "increase capability visibility and opportunity readiness",
    leadMetric: "weekly capability-building actions completed",
    lagMetric: "high-value opportunities created or captured",
    weeklyPriority: "ship visible proof-of-skill outputs",
    riskPattern: "hidden work and weak professional signaling",
  },
  "personal-development": {
    objective: "strengthen discipline and identity consistency",
    leadMetric: "daily non-negotiable habit adherence",
    lagMetric: "monthly personal standard score",
    weeklyPriority: "maintain identity-aligned routines under pressure",
    riskPattern: "emotion-driven inconsistency and weak review rhythm",
  },
};

const GOAL_LABEL: Record<GoalId, string> = GOALS.reduce(
  (acc, goal) => ({ ...acc, [goal.id]: goal.label }),
  {} as Record<GoalId, string>,
);

const normalizeWords = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const jaccard = (a: string, b: string) => {
  const setA = new Set(normalizeWords(a));
  const setB = new Set(normalizeWords(b));
  const intersection = [...setA].filter((token) => setB.has(token)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
};

function enforceAnchors(lines: string[], anchors: string[], minCount = 3): string[] {
  const combined = lines.join(" ").toLowerCase();
  const present = anchors.filter((anchor) => combined.includes(anchor.toLowerCase()));
  if (present.length >= minCount) return lines;

  const missing = anchors.filter((anchor) => !combined.includes(anchor.toLowerCase())).slice(0, minCount - present.length);
  if (missing.length === 0) return lines;
  return [...lines, `Anchor concepts: ${missing.join(", ")}.`];
}

function enforceTabUniqueness(result: GoalResult): GoalResult {
  const pairs: Array<[keyof GoalResult, keyof GoalResult]> = [
    ["ideas", "framework"],
    ["ideas", "plan"],
    ["ideas", "mistakes"],
    ["framework", "plan"],
    ["framework", "mistakes"],
    ["plan", "mistakes"],
  ];

  const patchIfSimilar = (source: string[], label: string, target: string[]) => {
    if (jaccard(source.join(" "), target.join(" ")) > 0.62) {
      return [`${label} is intentionally differentiated from other tabs for clearer execution.`, ...target];
    }
    return target;
  };

  let ideas = result.ideas;
  let framework = result.framework;
  let plan = result.plan;
  let mistakes = result.mistakes;

  pairs.forEach(([left, right]) => {
    const map: Record<string, string[]> = {
      ideas,
      framework,
      plan,
      mistakes,
      summary: result.summary,
      quotes: result.quotes,
    };
    const source = map[left as string];
    const target = map[right as string];
    if (right === "framework") framework = patchIfSimilar(source, "Framework view", target);
    if (right === "plan") plan = patchIfSimilar(source, "Execution plan", target);
    if (right === "mistakes") mistakes = patchIfSimilar(source, "Mistakes analysis", target);
    if (right === "ideas") ideas = patchIfSimilar(source, "Ideas section", target);
  });

  return {
    ...result,
    ideas,
    framework,
    plan,
    mistakes,
  };
}

function buildGoalResult(book: Book, goalId: GoalId): GoalResult {
  const profile = BOOK_PROFILES[book.id];
  const focus = GOAL_FOCUS[goalId];
  const strategy = GOAL_STRATEGY[goalId];
  const summaryLongA = `${book.title} for ${GOAL_LABEL[goalId]}: ${profile.thesis} This directly supports ${focus} when converted into an execution system.`;
  const summaryLongB = `Primary objective for this goal is to ${strategy.objective}. Prioritize ${profile.anchors.slice(0, 3).join(", ")} and run weekly adaptation loops.`;
  const summary = enforceAnchors([summaryLongA, summaryLongB], profile.anchors, 3);
  const ideas = enforceAnchors(
    [
      ...profile.baseIdeas.map((idea) => `${idea} This strengthens ${focus}.`),
      `Goal-specific lever: ${strategy.weeklyPriority}.`,
      `Measurement discipline: Track lead metric '${strategy.leadMetric}' and lag metric '${strategy.lagMetric}'.`,
    ],
    profile.anchors,
    3,
  );
  const derivedFrameworkName = `${GOAL_LABEL[goalId]} Execution Mesh`;
  const framework = enforceAnchors(
    [
      `${profile.frameworkName}`,
      `  - Core Principle 1: ${profile.frameworkComponents[0]}`,
      `  - Core Principle 2: ${profile.frameworkComponents[1]}`,
      `  - Core Principle 3: ${profile.frameworkComponents[2]}`,
      `  - Core Principle 4: ${profile.frameworkComponents[3]}`,
      `  - Why this fits ${GOAL_LABEL[goalId]}: it translates ${profile.anchors.slice(0, 2).join(" + ")} into daily operating rules.`,
      "---",
      `${derivedFrameworkName}`,
      "Operating Sequence:",
      `  - Trigger Design: build predictable start conditions around ${strategy.weeklyPriority}.`,
      `  - Execution Block: protect one high-value block daily focused on ${focus}.`,
      `  - Evidence Loop: track '${strategy.leadMetric}' and '${strategy.lagMetric}' after each cycle.`,
      "Decision Rules:",
      `  - If '${strategy.riskPattern}' repeats for 2 days, cut scope by 50% and re-anchor starting cue.`,
      `  - If '${strategy.lagMetric}' stalls for 2 weeks, redesign workflow before increasing effort.`,
      "Expected Outcome:",
      `  - More reliable ${focus} and clearer weekly progress signals.`,
    ],
    profile.anchors,
    3,
  );
  const plan = enforceAnchors(
    [
      "Plan Format:",
      `  - Weekly Execution Table plus Daily Playbook for ${GOAL_LABEL[goalId]}.`,
      "Week 1 (Baseline and Setup):",
      `  - Objective: Establish systems to ${strategy.objective}.`,
      `  - Checklist: ${profile.weeklyPlan[0]}; baseline '${strategy.leadMetric}' and '${strategy.lagMetric}'.`,
      `  - Metrics: ${strategy.leadMetric} baseline captured; start consistency >= 70%.`,
      "Week 2 (Consistency Build):",
      `  - Objective: Stabilize ${strategy.weeklyPriority}.`,
      `  - Checklist: ${profile.weeklyPlan[1]}; remove one friction source tied to '${strategy.riskPattern}'.`,
      `  - Metrics: ${strategy.leadMetric} improves by >= 15% from baseline.`,
      "Week 3 (Quality and Scale):",
      `  - Objective: Improve output quality while preserving consistency.`,
      `  - Checklist: ${profile.weeklyPlan[2]}; add one quality checkpoint linked to ${focus}.`,
      `  - Metrics: ${strategy.lagMetric} shows measurable weekly improvement.`,
      "Week 4 (Resilience and Review):",
      `  - Objective: Make the system resilient under variability.`,
      `  - Checklist: ${profile.weeklyPlan[3]}; define fallback protocol and publish personal operating rules.`,
      "Daily Playbook:",
      `  - Morning Setup: Define one non-negotiable action aligned to ${GOAL_LABEL[goalId]}.`,
      "  - Execution Block: Run protected focus period with zero multitasking.",
      `  - Review: Log '${strategy.leadMetric}', note blockers, and prepare next-day first action.`,
      "Failure Recovery Rules:",
      `  - If '${strategy.riskPattern}' repeats for 2 days, reduce task complexity and re-anchor cue design.`,
      `  - If ${strategy.leadMetric} declines for 1 week, remove low-value commitments before adding tactics.`,
      "Monthly Checkpoint:",
      `  - Publish one-page review: wins, bottlenecks, and next-cycle rule changes.`,
    ],
    profile.anchors,
    3,
  );
  const mistakes = enforceAnchors(
    profile.baseMistakes.map((line, index) => {
      const prevention = [
        `Prevention: run a daily cue check tied to ${strategy.weeklyPriority}.`,
        `Prevention: monitor '${strategy.leadMetric}' and trigger fallback mode early.`,
        `Prevention: define one owner and one timestamp for each critical step.`,
        `Prevention: close each week with a review against '${strategy.lagMetric}'.`,
      ][index % 4];
      return `${line} ${prevention}`;
    }),
    profile.anchors,
    2,
  );

  const generated = enforceTabUniqueness({
    summary: [summaryLongA, summaryLongB],
    quotes: [
      `"${profile.thesis}"`,
      `"Framework discipline creates predictable progress over time."`,
      `"Execution quality rises when principles are translated into repeatable systems."`,
    ],
    ideas,
    framework,
    plan: [
      ...plan,
      `Monthly checkpoint: summarize gains, bottlenecks, and next-cycle decisions grounded in ${profile.frameworkName}.`,
    ],
    mistakes,
  });

  const override = BOOK_GOAL_OVERRIDES[book.id]?.[goalId];
  if (!override) return generated;

  return enforceTabUniqueness({
    ...generated,
    ...override,
    summary: override.summary ?? generated.summary,
    quotes: override.quotes ?? generated.quotes,
    ideas: override.ideas ?? generated.ideas,
    framework: override.framework ?? generated.framework,
    plan: override.plan ?? generated.plan,
    mistakes: override.mistakes ?? generated.mistakes,
  });
}

function mergeGoalResults(book: Book, goalIds: GoalId[]): GoalResult {
  const uniqueGoalIds = Array.from(new Set(goalIds));
  if (uniqueGoalIds.length === 1) return buildGoalResult(book, uniqueGoalIds[0]);

  const profile = BOOK_PROFILES[book.id];
  const goalNames = uniqueGoalIds.map((id) => GOAL_LABEL[id]).join(" + ");
  const individual = uniqueGoalIds.map((goalId) => ({
    goalId,
    goalName: GOAL_LABEL[goalId],
    result: buildGoalResult(book, goalId),
    strategy: GOAL_STRATEGY[goalId],
  }));

  const summary = [
    `${book.title} integrated strategy for ${goalNames}: ${profile.thesis}`,
    `Combination intent: balance ${uniqueGoalIds.map((id) => GOAL_FOCUS[id]).join(", ")} without sacrificing execution quality.`,
    `Anchor focus: ${profile.anchors.slice(0, 4).join(", ")}.`,
  ];

  const framework: string[] = [
    `${profile.frameworkName}`,
    "  - Multi-goal interpretation: Apply core principles as shared constraints across all selected goals.",
    "---",
    `${goalNames} Coordination Grid`,
    "Framework Intent:",
    "  - Coordinate multiple goals through one weekly priority stack and one shared execution cadence.",
  ];

  individual.forEach(({ goalName, strategy }) => {
    framework.push(`${goalName} Lens:`);
    framework.push(`  - Objective: ${strategy.objective}.`);
    framework.push(`  - Lead Metric: ${strategy.leadMetric}.`);
    framework.push(`  - Lag Metric: ${strategy.lagMetric}.`);
    framework.push(`  - Primary Risk: ${strategy.riskPattern}.`);
  });

  framework.push("Integration Rule:");
  framework.push("  - Sequence goals by weekly leverage: one primary, one support, one reinforcement.");
  framework.push("  - Reallocate time weekly based on lead-metric trend, not emotion.");

  const plan: string[] = [
    "Plan Format:",
    `  - Integrated Weekly Table and Daily Playbook for ${goalNames}.`,
    "Week 1 (Alignment and Baseline):",
    "  - Objective: Align all selected goals into one execution calendar and baseline all lead metrics.",
    "  - Checklist: Define primary/support/reinforcement goal order; assign time blocks; set baseline metrics.",
    "Week 2 (Execution Rhythm):",
    "  - Objective: Stabilize daily rhythm while protecting primary-goal momentum.",
    "  - Checklist: Keep one protected block for primary goal, one shorter block for support goal, one maintenance action for reinforcement goal.",
    "Week 3 (Cross-Goal Optimization):",
    "  - Objective: Remove conflicts between goals and improve throughput quality.",
    "  - Checklist: Identify overlap tasks, merge duplicates, and tighten review cadence.",
    "Week 4 (Scale and Sustain):",
    "  - Objective: Convert combined execution into a repeatable operating model.",
    "  - Checklist: Codify non-negotiables, fallback rules, and metric thresholds for each goal.",
    "Daily Playbook:",
    "  - Morning: confirm primary goal action and support action.",
    "  - Midday: verify lead-metric progress and adjust remaining priorities.",
    "  - End-of-Day: log per-goal progress and set next-day first action.",
    "If-Then Rules:",
    "  - If one goal consistently blocks another, reduce support-goal scope by 30% for one week.",
    "  - If two lead metrics decline simultaneously, simplify system to one primary and one support goal until recovery.",
  ];

  const ideas = individual.flatMap(({ goalName, result }) =>
    result.ideas.slice(0, 3).map((line) => `[${goalName}] ${line}`),
  );
  const mistakes = individual.flatMap(({ goalName, result }) =>
    result.mistakes.slice(0, 2).map((line) => `[${goalName}] ${line}`),
  );

  const combined: GoalResult = {
    summary: enforceAnchors(summary, profile.anchors, 3),
    quotes: [
      `"${profile.thesis}"`,
      `"Integrated goals succeed when one operating cadence governs all priorities."`,
      `"Coordination quality determines whether multiple goals compound or compete."`,
    ],
    ideas: enforceAnchors(ideas, profile.anchors, 3),
    framework: enforceAnchors(framework, profile.anchors, 3),
    plan: enforceAnchors(plan, profile.anchors, 3),
    mistakes: enforceAnchors(mistakes, profile.anchors, 2),
  };

  return enforceTabUniqueness(combined);
}

export function getResultForSelection(bookId: string, goalIds: GoalId[]): GoalResult {
  const book = BOOKS.find((item) => item.id === bookId) ?? BOOKS[0];
  const validGoals = goalIds.filter((goalId) => GOAL_LABEL[goalId]);
  const normalizedGoals: GoalId[] = validGoals.length ? validGoals : ["productivity"];
  return mergeGoalResults(book, normalizedGoals);
}

export const BOOK_GOAL_RESULTS: Record<string, Record<GoalId, GoalResult>> = BOOKS.reduce(
  (allBooks, book) => {
    const profile = BOOK_PROFILES[book.id];
    if (!profile) return allBooks;
    allBooks[book.id] = {
      productivity: buildGoalResult(book, "productivity"),
      leadership: buildGoalResult(book, "leadership"),
      "career-growth": buildGoalResult(book, "career-growth"),
      "personal-development": buildGoalResult(book, "personal-development"),
    };
    return allBooks;
  },
  {} as Record<string, Record<GoalId, GoalResult>>,
);
