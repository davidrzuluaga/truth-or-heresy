/**
 * Sound effects & haptics module.
 *
 * - Web: synthesises short tones via the Web Audio API.
 * - Native (iOS / Android): triggers expo-haptics for tactile feedback.
 *
 * Every public function is fire-and-forget and never throws.
 */

import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

// ── Mute toggle ──────────────────────────────────────────────────────────────

const SOUND_KEY = "toh_sound_enabled";
let soundEnabled = true;

// Load persisted preference on startup
AsyncStorage.getItem(SOUND_KEY).then((val) => {
  if (val !== null) soundEnabled = val === "true";
}).catch(() => {});

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  AsyncStorage.setItem(SOUND_KEY, String(enabled)).catch(() => {});
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

// ── Web Audio helpers ────────────────────────────────────────────────────────

type OscType = OscillatorType;

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== "web") return null;
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

/**
 * Play a single synthesised tone (web only).
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscType = "sine",
  volume = 0.3,
  ctx?: AudioContext,
  startOffset = 0,
): void {
  if (Platform.OS !== "web") return;
  const audioCtx = ctx ?? getAudioContext();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const start = audioCtx.currentTime + startOffset;
  osc.start(start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.stop(start + duration + 0.01);
}

/**
 * Schedule a sequence of tones that share one AudioContext.
 */
function playSequence(
  notes: { freq: number; dur: number; offset: number; type?: OscType; vol?: number }[],
): void {
  if (Platform.OS !== "web") return;
  const ctx = getAudioContext();
  if (!ctx) return;
  for (const n of notes) {
    playTone(n.freq, n.dur, n.type ?? "sine", n.vol ?? 0.3, ctx, n.offset);
  }
}

// ── Haptic helpers ───────────────────────────────────────────────────────────

async function hapticLight(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

async function hapticMedium(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

async function hapticHeavy(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {}
}

async function hapticSuccess(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}

async function hapticError(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {}
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Pleasant ascending two-tone chime (C5 -> E5).
 */
export async function playCorrect(): Promise<void> {
  if (!soundEnabled) return;
  // Web: ascending chime
  playSequence([
    { freq: 523.25, dur: 0.15, offset: 0 },       // C5
    { freq: 659.25, dur: 0.2, offset: 0.12 },      // E5
  ]);
  // Native: success haptic
  await hapticSuccess();
}

/**
 * Low descending buzz (E3 -> C3).
 */
export async function playWrong(): Promise<void> {
  if (!soundEnabled) return;
  // Web: descending buzz
  playSequence([
    { freq: 164.81, dur: 0.2, offset: 0, type: "sawtooth", vol: 0.2 },   // E3
    { freq: 130.81, dur: 0.25, offset: 0.15, type: "sawtooth", vol: 0.2 }, // C3
  ]);
  // Native: error haptic
  await hapticError();
}

/**
 * Single short click tone.
 */
export async function playTap(): Promise<void> {
  if (!soundEnabled) return;
  // Web: short click
  playTone(880, 0.06, "sine", 0.15);
  // Native: light impact
  await hapticLight();
}

/**
 * Ascending arpeggio (C5 -> E5 -> G5 -> C6).
 */
export async function playLevelUp(): Promise<void> {
  if (!soundEnabled) return;
  // Web: arpeggio
  playSequence([
    { freq: 523.25, dur: 0.15, offset: 0 },        // C5
    { freq: 659.25, dur: 0.15, offset: 0.12 },     // E5
    { freq: 783.99, dur: 0.15, offset: 0.24 },     // G5
    { freq: 1046.5, dur: 0.3, offset: 0.36 },      // C6
  ]);
  // Native: heavy haptic
  await hapticHeavy();
}

/**
 * Quick ascending triple beep.
 */
export async function playStreak(): Promise<void> {
  if (!soundEnabled) return;
  // Web: triple beep
  playSequence([
    { freq: 587.33, dur: 0.08, offset: 0 },        // D5
    { freq: 739.99, dur: 0.08, offset: 0.1 },      // F#5
    { freq: 880.0, dur: 0.12, offset: 0.2 },       // A5
  ]);
  // Native: light haptic
  await hapticLight();
}
