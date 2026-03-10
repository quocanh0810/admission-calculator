import { CandidateInput, MethodResult, Major } from "@/types/admission"
import { getBestCertificateConversion } from "@/data/certificateRules"
import {
  calculateAdjustedPriority,
  getBestCombinationExamScore,
  round2,
} from "./helpers"

export function calculateMethod100(
  input: CandidateInput,
  availableMajors: Major[],
): MethodResult {
  const allCombinations = [
    ...new Set(availableMajors.flatMap((m) => m.combinations)),
  ]

  const cert = getBestCertificateConversion(input.certificates)
  const encouragement = cert?.encouragementScore ?? 0

  let best: MethodResult["bestCombination"] | undefined
  let bestPriorityAdjusted = 0

  for (const code of allCombinations) {
    const trial = getBestCombinationExamScore(input, [code], 0)
    if (!trial) continue

    const baseScore = trial.score
    const priorityAdjusted = calculateAdjustedPriority(
      input.priorityScore,
      baseScore,
      30,
    )
    const finalScore = round2(baseScore + priorityAdjusted + encouragement)

    if (!best || finalScore > best.score) {
      best = {
        ...trial,
        score: finalScore,
      }
      bestPriorityAdjusted = priorityAdjusted
    }
  }

  return {
    method: "100",
    eligible: best != null,
    scoreRaw: best?.score ?? null,
    scoreDisplay: best?.score ?? null,
    maxScale: 30,
    note: best
      ? "Đã cộng khuyến khích và áp dụng ưu tiên giảm dần."
      : "Chưa đủ dữ liệu điểm thi để tính PTXT 100.",
    bestCombination: best ?? undefined,
    certificateUsed: cert ?? undefined,
    priorityBase: input.priorityScore,
    priorityAdjusted: best ? bestPriorityAdjusted : 0,
    awardScore: 0,
    encouragementScore: encouragement,
  }
}