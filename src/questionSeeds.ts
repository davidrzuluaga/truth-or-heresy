import { Question, HeresyName } from "./types";

/**
 * Question metadata only — statements come from i18n (`questions.{id}.statement`).
 */
export const QUESTION_SEEDS: Omit<Question, "statement">[] = [
  { id: 1, isTruth: true, correctHeresy: null },
  { id: 2, isTruth: true, correctHeresy: null },
  { id: 3, isTruth: true, correctHeresy: null },
  { id: 4, isTruth: true, correctHeresy: null },
  { id: 5, isTruth: true, correctHeresy: null },
  { id: 6, isTruth: true, correctHeresy: null },
  { id: 7, isTruth: true, correctHeresy: null },
  { id: 8, isTruth: false, correctHeresy: "Arianism" },
  { id: 9, isTruth: false, correctHeresy: "Arianism" },
  { id: 10, isTruth: false, correctHeresy: "Pelagianism" },
  { id: 11, isTruth: false, correctHeresy: "Pelagianism" },
  { id: 12, isTruth: false, correctHeresy: "Gnosticism" },
  { id: 13, isTruth: false, correctHeresy: "Gnosticism" },
  { id: 14, isTruth: false, correctHeresy: "Modalism" },
  { id: 15, isTruth: false, correctHeresy: "Modalism" },
  { id: 16, isTruth: false, correctHeresy: "Docetism" },
  { id: 17, isTruth: false, correctHeresy: "Docetism" },
  { id: 18, isTruth: false, correctHeresy: "Nestorianism" },
  { id: 19, isTruth: false, correctHeresy: "Nestorianism" },
  { id: 20, isTruth: false, correctHeresy: "Marcionism" },
  { id: 21, isTruth: false, correctHeresy: "Marcionism" },
];
