// ─── Spaced Repetition Review System ────────────────────────────────────────
// Tracks wrong/struggled questions and schedules reviews at increasing intervals.

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]; // days
export const REVIEW_XP_BONUS = 5; // extra XP per successful review

export interface ReviewItem {
  questionId: number;
  /** How many times this question has been successfully reviewed */
  stage: number; // 0 = first review due, 1 = reviewed once, etc.
  /** Date string (YYYY-MM-DD) when the next review is due */
  dueDate: string;
  /** Date added */
  addedDate: string;
}

/**
 * Calculate the next due date based on current stage.
 */
export function getNextDueDate(stage: number, fromDate?: string): string {
  const now = fromDate ? new Date(fromDate + "T12:00:00") : new Date();
  const interval = REVIEW_INTERVALS[Math.min(stage, REVIEW_INTERVALS.length - 1)];
  now.setDate(now.getDate() + interval);
  return now.toISOString().slice(0, 10);
}

/**
 * Create a new review item for a question answered incorrectly.
 */
export function createReviewItem(questionId: number): ReviewItem {
  const today = new Date().toISOString().slice(0, 10);
  return {
    questionId,
    stage: 0,
    dueDate: getNextDueDate(0, today),
    addedDate: today,
  };
}

/**
 * Advance a review item after successful review.
 * Returns null if the item has completed all stages (mastered).
 */
export function advanceReviewItem(item: ReviewItem): ReviewItem | null {
  const nextStage = item.stage + 1;
  if (nextStage >= REVIEW_INTERVALS.length) {
    return null; // mastered — remove from queue
  }
  return {
    ...item,
    stage: nextStage,
    dueDate: getNextDueDate(nextStage),
  };
}

/**
 * Reset a review item back to stage 0 (got it wrong again).
 */
export function resetReviewItem(item: ReviewItem): ReviewItem {
  const today = new Date().toISOString().slice(0, 10);
  return {
    ...item,
    stage: 0,
    dueDate: getNextDueDate(0, today),
  };
}

/**
 * Get all items that are due for review today or earlier.
 */
export function getDueReviews(items: ReviewItem[]): ReviewItem[] {
  const today = new Date().toISOString().slice(0, 10);
  return items.filter((item) => item.dueDate <= today);
}
