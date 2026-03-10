import {
  CandidateInput,
  CombinationCode,
  CombinationScoreResult,
  TranscriptSubject,
} from "@/types/admission"
import { combinations } from "@/data/combinations"

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/**
 * Điểm ưu tiên giảm dần theo quy chế.
 * Thang 30: mốc 22.5, mẫu số 7.5
 * Tổng quát: mốc = 75% maxScale, mẫu số = 25% maxScale
 */

export function calculateAdjustedPriority(
  basePriority: number,
  totalScoreBeforePriority: number,
  maxScale: number,
  shouldRound = true,
): number {
  if (basePriority <= 0) return 0

  const threshold = maxScale * 0.75
  const denominator = maxScale * 0.25

  if (totalScoreBeforePriority <= threshold) {
    return shouldRound ? round2(basePriority) : basePriority
  }

  if (totalScoreBeforePriority >= maxScale) {
    return 0
  }

  const rawValue = Math.max(
    0,
    ((maxScale - totalScoreBeforePriority) / denominator) * basePriority,
  )

  return shouldRound ? round2(rawValue) : rawValue
}

/**
 * Chuẩn hóa điểm cộng đúng đề án trên thang 30.
 * - award tối đa 1.5
 * - encouragement tối đa 1.5
 * - total bonus = priorityAdjusted + award + encouragement tối đa 3
 */
export function calculateTotalBonus30(params: {
  priorityBase: number
  totalScoreBeforePriority: number
  maxScaleForPriorityRule: number
  awardScore: number
  encouragementScore: number
  roundPriorityAdjusted?: boolean
}) {
  const {
    priorityBase,
    totalScoreBeforePriority,
    maxScaleForPriorityRule,
    awardScore,
    encouragementScore,
    roundPriorityAdjusted = true,
  } = params

  const priorityAdjusted = calculateAdjustedPriority(
    priorityBase,
    totalScoreBeforePriority,
    maxScaleForPriorityRule,
    roundPriorityAdjusted,
  )

  const safeAward = Math.min(awardScore, 1.5)
  const safeEncouragement = Math.min(encouragementScore, 1.5)

  const totalBonus30 = Math.min(
    priorityAdjusted + safeAward + safeEncouragement,
    3,
  )

  return {
    priorityAdjusted,
    awardScore: round2(safeAward),
    encouragementScore: round2(safeEncouragement),
    totalBonus30: round2(totalBonus30),
  }
}

export function scaleBonus30ToScaleN(
  totalBonus30: number,
  maxScale: number,
): number {
  return round2((totalBonus30 * maxScale) / 30)
}

export function getTranscriptAverage(
  input: CandidateInput,
  subject: TranscriptSubject,
): number | null {
  const y10 = input.transcript10[subject]
  const y11 = input.transcript11[subject]
  const y12 = input.transcript12[subject]

  if (
    typeof y10 !== "number" ||
    typeof y11 !== "number" ||
    typeof y12 !== "number"
  ) {
    return null
  }

  return round2((y10 + y11 + y12) / 3)
}

export function getBestCombinationExamScore(
  input: CandidateInput,
  allowedCombinationCodes: CombinationCode[],
  extra: number,
): CombinationScoreResult | null {
  let best: CombinationScoreResult | null = null

  for (const code of allowedCombinationCodes) {
    const subjects = combinations[code]
    const scores = subjects.map((s) => input.examScores[s])

    if (scores.some((s) => typeof s !== "number")) continue

    const score = round2(
      (scores[0] as number) +
        (scores[1] as number) +
        (scores[2] as number) +
        extra,
    )

    if (!best || score > best.score) {
      best = { combination: code, subjects, score }
    }
  }

  return best
}

export function getBestCombinationFor409(
  input: CandidateInput,
  allowedCombinationCodes: CombinationCode[],
  certificateConvertedScore: number,
  extra: number,
): CombinationScoreResult | null {
  let best: CombinationScoreResult | null = null

  for (const code of allowedCombinationCodes) {
    const subjects = combinations[code]
    if (!subjects.includes("toan") || !subjects.includes("anh")) continue

    const nonLanguage = subjects.find((s) => s !== "toan" && s !== "anh")
    if (!nonLanguage) continue

    const toan = input.examScores.toan
    const other = input.examScores[nonLanguage]

    if (typeof toan !== "number" || typeof other !== "number") continue

    const score = round2(toan + other + certificateConvertedScore + extra)

    if (!best || score > best.score) {
      best = { combination: code, subjects, score }
    }
  }

  return best
}

export function getBestCombinationFor410(
  input: CandidateInput,
  allowedCombinationCodes: CombinationCode[],
  certificateConvertedScore: number,
  extra: number,
): CombinationScoreResult | null {
  let best: CombinationScoreResult | null = null

  for (const code of allowedCombinationCodes) {
    const subjects = combinations[code]
    if (!subjects.includes("toan") || !subjects.includes("anh")) continue

    const nonLanguage = subjects.find((s) => s !== "toan" && s !== "anh")
    if (!nonLanguage) continue
    if (nonLanguage === "tiengphap" || nonLanguage === "tiengtrung") continue

    const toanAvg = getTranscriptAverage(input, "toan")
    const otherAvg = getTranscriptAverage(
      input,
      nonLanguage as TranscriptSubject,
    )

    if (toanAvg == null || otherAvg == null) continue

    const score = round2(toanAvg + otherAvg + certificateConvertedScore + extra)

    if (!best || score > best.score) {
      best = { combination: code, subjects, score }
    }
  }

  return best
}