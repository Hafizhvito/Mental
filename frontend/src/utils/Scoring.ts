// src/utils/Scoring.ts
import { questions } from "../data/questions";
import { categories } from "../data/categories";

/**
 * Map jawaban (string) -> skor numerik (dengan reverse support untuk kategori I-VIII)
 * Returns 0 if not found.
 */
function mapAnswerToScore(categoryKey: string, answer: string): number {
  const cat = categories[categoryKey];
  if (!cat) return 0;

  const idx = cat.options.findIndex((o: string) => o.toLowerCase() === answer.toLowerCase());
  if (idx < 0) return 0;

  const rawScore = idx + 1; // index 0 → 1, dst
  const maxScore = cat.options.length;

  // 🔁 Perbaikan arah pembalikan
  // Jika kategori "reversed: true", berarti skalanya sudah dibalik di definisi,
  // jadi tidak perlu dibalik lagi. Kita hanya balik untuk kategori non-reversed.
  if (!cat.reversed) {
    const reversedScore = maxScore - rawScore + 1;
    console.log(`Q-${categoryKey}: "${answer}" → raw=${rawScore} → reversed=${reversedScore}`);
    return reversedScore;
  }

  console.log(`Q-${categoryKey}: "${answer}" → raw=${rawScore}`);
  return rawScore;
}


/* --- Helper rumus (sama seperti rumus lama) --- */
/* makeFormulaSubtract: (max - sum)/divisor   - metric used in cutoff
   makeFormulaReverse: 5 - X
   makeFormulaDirect: X */
function makeFormulaSubtract(max: number, divisor: number) {
  return (scores: number[]) => {
    return (max - scores.reduce((a, b) => a + b, 0)) / divisor;
  };
}
function makeFormulaReverse() {
  return (scores: number[]) => 5 - scores[0];
}
function makeFormulaDirect() {
  return (scores: number[]) => scores[0];
}

/* WFC (64-81) classification reused (1..5) */
function classifyWFC(q64to81: number[]): 1 | 2 | 3 | 4 | 5 {
  const X = q64to81.reduce((a, b) => a + b, 0);
  const maxScore = q64to81.length * 4; // 18 * 4 = 72
  const percentage = (X / maxScore) * 100;
  if (percentage > 75) return 5;
  if (percentage > 60) return 4;
  if (percentage > 40) return 3;
  if (percentage > 20) return 2;
  return 1;
}

/* Stress index Q82-109 (mean-based) -> 0..4 */
function classifyStressLevel(scores: number[]): 0 | 1 | 2 | 3 | 4 {
  if (scores.length === 0) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 4.0) return 4;
  if (avg >= 3.5) return 3;
  if (avg >= 2.5) return 2;
  if (avg >= 2.0) return 1;
  return 0;
}

/* --- Formulas mapping for Q1..Q63 as in kode lama --- */
const formulas: Record<number, (scores: number[]) => number> = {
  1: (s) => makeFormulaDirect()(s), // metric = X
  2: (s) => makeFormulaDirect()(s),
  3: makeFormulaSubtract(10, 2),
  4: makeFormulaSubtract(10, 2),
  8: makeFormulaReverse(),
  9: makeFormulaReverse(),
  10: (s) => makeFormulaDirect()(s),
  11: (s) => makeFormulaDirect()(s),
  12: (s) => makeFormulaDirect()(s),
  13: makeFormulaSubtract(15, 3),
  14: makeFormulaSubtract(15, 3),
  15: makeFormulaSubtract(15, 3),
  16: makeFormulaSubtract(15, 3),
  17: makeFormulaSubtract(15, 3),
  18: makeFormulaSubtract(15, 3),
  19: makeFormulaSubtract(15, 3),
  20: makeFormulaSubtract(15, 3),
  21: makeFormulaSubtract(15, 3),
  22: makeFormulaSubtract(30, 6),
  23: makeFormulaSubtract(30, 6),
  24: makeFormulaSubtract(30, 6),
  25: makeFormulaSubtract(30, 6),
  26: makeFormulaSubtract(30, 6),
  27: makeFormulaSubtract(30, 6),
  28: makeFormulaSubtract(55, 11),
  29: makeFormulaSubtract(55, 11),
  30: makeFormulaSubtract(55, 11),
  31: makeFormulaSubtract(55, 11),
  32: makeFormulaSubtract(55, 11),
  33: makeFormulaSubtract(55, 11),
  34: makeFormulaSubtract(55, 11),
  35: makeFormulaSubtract(55, 11),
  36: makeFormulaSubtract(55, 11),
  37: makeFormulaSubtract(55, 11),
  38: makeFormulaSubtract(55, 11),
  39: makeFormulaSubtract(10, 2),
  40: makeFormulaSubtract(10, 2),
  41: makeFormulaReverse(),
  42: makeFormulaReverse(),
  43: makeFormulaDirect(),
  44: makeFormulaDirect(),
  45: makeFormulaReverse(),
  46: makeFormulaReverse(),
  47: makeFormulaReverse(),
  48: makeFormulaReverse(),
  49: makeFormulaReverse(),
  50: makeFormulaReverse(),
  51: makeFormulaReverse(),
  52: makeFormulaReverse(),
  53: makeFormulaReverse(),
  54: makeFormulaReverse(),
  55: makeFormulaReverse(),
  56: makeFormulaReverse(),
  57: makeFormulaReverse(),
  58: makeFormulaReverse(),
  59: makeFormulaReverse(),
  60: makeFormulaDirect(),
  61: makeFormulaReverse(),
  62: makeFormulaSubtract(10, 2),
  63: makeFormulaSubtract(10, 2),
};

/* --- Type hasil --- */
type CalcResult = {
  perQuestion: Record<string, number>; // continuous problem-score per key (0..)
  perCategory: Record<string, number>;
  binaryVariableKeys: string[]; // unused in continuous mode but kept
  wfcIndex: 1 | 2 | 3 | 4 | 5;
  stressIndex: 0 | 1 | 2 | 3 | 4;
  totalBinaryFlags: number;
  stressLevel: "rendah" | "sedang" | "tinggi";
  score_total: number; // jumlah problemScore (angka mentah)
};

/* --- Main --- */
export function calculateScores(answers: Record<number, string>): CalcResult {
  console.log("=== MULAI PERHITUNGAN SCORES (HYBRID RAW) ===");

  const perQuestion: Record<string, number> = {};
  const perCategory: Record<string, number> = {};
  const rawScores: Record<number, number> = {}; // skor mentah tiap pertanyaan (1-4 / 1-5)

  const q5to7: number[] = [];
  const q64to81: number[] = [];
  const q82to109: number[] = [];

  // 1) kumpulkan skor mentah & hitung per-pertanyaan (untuk Q1..Q63 kecuali 5-7)
  for (const q of questions) {
    const ans = answers[q.id];
    if (!ans) continue;
    const s = mapAnswerToScore(q.category, ans);
    if (s === 0) continue;
    rawScores[q.id] = s;

    // handle grouped questions: 5-7, 64-81, 82-109 -> simpan dulu
    if ([5, 6, 7].includes(q.id)) {
      q5to7.push(s);
      continue;
    }
    if (q.id >= 64 && q.id <= 81) {
      q64to81.push(s);
      continue;
    }
    if (q.id >= 82 && q.id <= 109) {
      q82to109.push(s);
      continue;
    }

    // apply formula if exists; get metric (continuous)
    const formula = formulas[q.id];
    const metric = formula ? formula([s]) : s;

    // problemScore: positive when metric < 2.25 (worse). scale = (2.25 - metric), clamp >=0
    const problemScore = Math.max(0, 2.25 - metric);

    // store (round to 2 decimals for readability)
    const ps = Math.round(problemScore * 100) / 100;
    perQuestion[String(q.id)] = ps;
    perCategory[q.category] = (perCategory[q.category] || 0) + ps;
  }

  // 2) Q5-7 combined: metric = (x1 + x2 + (5 - x3)) / 3
  if (q5to7.length === 3) {
    const [x1, x2, x3] = q5to7;
    const metric57 = (x1 + x2 + (5 - x3)) / 3;
    const problemScore57 = Math.max(0, 2.25 - metric57);
    const ps = Math.round(problemScore57 * 100) / 100;
    perQuestion["5-7"] = ps;
    perCategory["I"] = (perCategory["I"] || 0) + ps;
  }

  // 3) WFC 64-81 -> classify (1..5) ; we will convert to a problem contribution.
  const wfcIndex = classifyWFC(q64to81);
  // Convert wfcIndex to problem contribution: scale so higher index -> higher contribution.
  // Simple: use (wfcIndex - 1) as severity (0..4).
  const wfcContribution = wfcIndex - 1;
  perQuestion["64-81"] = wfcIndex; // still keep index for details
  perCategory["VIII"] = (perCategory["VIII"] || 0) + wfcContribution;

  // 4) Stress 82-109 -> classifyStressLevel (0..4)
  const stressIndex = classifyStressLevel(q82to109);
  // Use stressIndex directly as contribution (0..4)
  perQuestion["82-109"] = stressIndex;
  perCategory["IX"] = (perCategory["IX"] || 0) + stressIndex;

  // 5) Score total = sum of all perCategory contributions (these are problem-scores continuous + wfc/stress contributions)
  const score_total = Object.values(perCategory).reduce((a, b) => a + b, 0);

  // 6) Determine stressLevel from score_total using thresholds (tweakable)
  //    thresholds chosen so that higher score_total => "tinggi"
  let stressLevel: "rendah" | "sedang" | "tinggi";
  // These thresholds can disesuaikan; saya gunakan:
  // <= 10 : rendah, >10 && <= 25 : sedang, >25 : tinggi
  if (score_total > 25) stressLevel = "tinggi";
  else if (score_total > 10) stressLevel = "sedang";
  else stressLevel = "rendah";

  // totalBinaryFlags is no longer primary but I'll compute how many perQuestion keys have positive problemScore
  const totalBinaryFlags = Object.values(perQuestion).filter((v) => v > 0).length;
  const binaryVariableKeys = Object.entries(perQuestion)
    .filter(([, v]) => v > 0)
    .map(([k]) => k);

  // debug
  console.log("=== DEBUG SUMMARY ===");
  console.log("rawScores count:", Object.keys(rawScores).length);
  console.log("perQuestion (sample):", perQuestion);
  console.log("perCategory:", perCategory);
  console.log("score_total:", +(Math.round(score_total * 100) / 100).toFixed(2));
  console.log("stressIndex:", stressIndex, "wfcIndex:", wfcIndex);
  console.log("derived stressLevel:", stressLevel);

  return {
    perQuestion,
    perCategory,
    binaryVariableKeys,
    wfcIndex,
    stressIndex,
    totalBinaryFlags,
    stressLevel,
    score_total: Math.round(score_total * 100) / 100, // 2dp
  };
}
