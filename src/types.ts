// ─── Core domain types ────────────────────────────────────────────────────────

export type HeresyName =
  | "Arianism"
  | "Pelagianism"
  | "Gnosticism"
  | "Modalism"
  | "Docetism"
  | "Nestorianism"
  | "Marcionism";

export interface Question {
  id: number;
  /** The theological statement the player must judge. */
  statement: string;
  /** true → orthodox; false → heresy */
  isTruth: boolean;
  /** Which heresy this is, or null if it's orthodox or uncategorized. */
  correctHeresy: HeresyName | null;
  /** Pre-written explanation shown after the player answers. */
  explanation?: string;
}

// ─── Game state ───────────────────────────────────────────────────────────────

export interface GameScore {
  correct: number;
  attempted: number;
  streak: number;
  bestStreak: number;
}

export interface GameState {
  questions: Question[];
  currentIndex: number;
  score: GameScore;
  /** What the player tapped on the Quiz screen. */
  userChoice: "truth" | "heresy" | null;
  /** The heresy the player selected (if they tapped "Heresy"). */
  selectedHeresy: HeresyName | null;
  /** Whether the player answered correctly. null = not yet judged. */
  isCorrect: boolean | null;
}

// ─── Context interface ────────────────────────────────────────────────────────

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  currentQuestion: Question | undefined;
}

// ─── Reducer actions ──────────────────────────────────────────────────────────

export type GameAction =
  | { type: "START_GAME"; accuracy?: number; totalAnswered?: number; filterQuestionIds?: number[] }
  | { type: "ANSWER_TRUTH" }
  | { type: "ANSWER_HERESY" }
  | { type: "SELECT_HERESY"; heresy: HeresyName }
  | { type: "NEXT_QUESTION" };
