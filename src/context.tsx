import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import {
  GameState,
  GameAction,
  GameContextType,
  GameScore,
} from "./types";
import { QUESTIONS } from "./questions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const BLANK_SCORE: GameScore = {
  correct: 0,
  attempted: 0,
  streak: 0,
  bestStreak: 0,
};

function makeInitialState(): GameState {
  return {
    questions: shuffle(QUESTIONS),
    currentIndex: 0,
    score: { ...BLANK_SCORE },
    userChoice: null,
    selectedHeresy: null,
    isCorrect: null,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return makeInitialState();

    case "ANSWER_TRUTH": {
      const q = state.questions[state.currentIndex];
      const isCorrect = q.isTruth;
      const streak = isCorrect ? state.score.streak + 1 : 0;
      return {
        ...state,
        userChoice: "truth",
        isCorrect,
        score: {
          correct: state.score.correct + (isCorrect ? 1 : 0),
          attempted: state.score.attempted + 1,
          streak,
          bestStreak: Math.max(state.score.bestStreak, streak),
        },
      };
    }

    case "ANSWER_HERESY":
      // Just record the choice; correctness determined after heresy is named.
      return { ...state, userChoice: "heresy" };

    case "SELECT_HERESY": {
      const q = state.questions[state.currentIndex];
      const isCorrect =
        !q.isTruth && q.correctHeresy === action.heresy;
      const streak = isCorrect ? state.score.streak + 1 : 0;
      return {
        ...state,
        selectedHeresy: action.heresy,
        isCorrect,
        score: {
          correct: state.score.correct + (isCorrect ? 1 : 0),
          attempted: state.score.attempted + 1,
          streak,
          bestStreak: Math.max(state.score.bestStreak, streak),
        },
      };
    }

    case "NEXT_QUESTION": {
      // Wrap around and reshuffle when the pool is exhausted.
      let nextIndex = state.currentIndex + 1;
      let nextQuestions = state.questions;
      if (nextIndex >= state.questions.length) {
        nextIndex = 0;
        nextQuestions = shuffle(QUESTIONS);
      }
      return {
        ...state,
        questions: nextQuestions,
        currentIndex: nextIndex,
        userChoice: null,
        selectedHeresy: null,
        isCorrect: null,
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, makeInitialState);
  const currentQuestion = state.questions[state.currentIndex];

  return (
    <GameContext.Provider value={{ state, dispatch, currentQuestion }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
