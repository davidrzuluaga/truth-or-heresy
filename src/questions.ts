import i18n from "./i18n/config";
import { QUESTION_SEEDS } from "./questionSeeds";
import { Question } from "./types";

export { QUESTION_SEEDS } from "./questionSeeds";

export function buildQuestions(): Question[] {
  return QUESTION_SEEDS.map((s) => ({
    ...s,
    statement: i18n.t(`questions.${s.id}.statement`),
  }));
}
