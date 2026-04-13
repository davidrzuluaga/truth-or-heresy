// ─── Mastery Paths ──────────────────────────────────────────────────────────
// 8 themed tracks based on question ID ranges. Progress is tracked by correctly
// answering questions whose IDs fall within each path's range.

export interface MasteryPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Inclusive question ID range [min, max] */
  questionRange: [number, number];
  /** Total questions in this path */
  totalQuestions: number;
}

export const MASTERY_PATHS: MasteryPath[] = [
  {
    id: "trinity",
    name: "Trinity Mastery",
    description: "The Triune God — Father, Son & Spirit",
    icon: "🔺",
    questionRange: [1, 70],
    totalQuestions: 70,
  },
  {
    id: "theology_proper",
    name: "Theology Proper",
    description: "God's nature, attributes & sovereignty",
    icon: "👑",
    questionRange: [71, 150],
    totalQuestions: 80,
  },
  {
    id: "christology",
    name: "Christology Deep Dive",
    description: "The person & work of Jesus Christ",
    icon: "✝️",
    questionRange: [151, 350],
    totalQuestions: 200,
  },
  {
    id: "soteriology",
    name: "Soteriology",
    description: "Salvation, grace, faith & justification",
    icon: "🕊️",
    questionRange: [351, 500],
    totalQuestions: 150,
  },
  {
    id: "eschatology",
    name: "Eschatology",
    description: "End times, resurrection & new creation",
    icon: "🌅",
    questionRange: [501, 600],
    totalQuestions: 100,
  },
  {
    id: "creation_ethics",
    name: "Creation & Ethics",
    description: "Humanity, creation, moral theology",
    icon: "🌿",
    questionRange: [601, 700],
    totalQuestions: 100,
  },
  {
    id: "ecclesiology",
    name: "Ecclesiology",
    description: "The church, creeds & worship",
    icon: "⛪",
    questionRange: [701, 850],
    totalQuestions: 150,
  },
  {
    id: "integration",
    name: "Grand Theology",
    description: "Advanced integration across all doctrines",
    icon: "📜",
    questionRange: [851, 1000],
    totalQuestions: 150,
  },
  {
    id: "modern_heresies",
    name: "Modern Heresies",
    description: "Prosperity gospel, deconstruction & pop theology",
    icon: "📱",
    questionRange: [1001, 1200],
    totalQuestions: 200,
  },
];

export interface MasteryProgress {
  /** Number of questions correctly answered in this path */
  correct: number;
  /** Set of question IDs answered correctly */
  answeredIds: number[];
}

/** Get which mastery path a question belongs to (by ID) */
export function getMasteryPathForQuestion(questionId: number): MasteryPath | null {
  return (
    MASTERY_PATHS.find(
      (p) => questionId >= p.questionRange[0] && questionId <= p.questionRange[1]
    ) ?? null
  );
}

/** Milestone thresholds for each path */
export function getMasteryMilestone(
  correct: number,
  total: number
): { pct: number; label: string | null } {
  const pct = total > 0 ? correct / total : 0;
  if (pct >= 1) return { pct, label: "Master" };
  if (pct >= 0.75) return { pct, label: "Expert" };
  if (pct >= 0.5) return { pct, label: "Adept" };
  return { pct, label: null };
}
