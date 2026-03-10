import { CandidateInput, MethodResult, Major } from "@/types/admission"
import { getBestCertificateConversion } from "@/data/certificateRules"
import { getAwardScore } from "@/data/awardRules"
import {
  calculateTotalBonus30,
  getBestCombinationExamScore,
  round2,
} from "./helpers"

export function calculateMethod500(
  input: CandidateInput,
  availableMajors: Major[],
): MethodResult {
  const allCombinations = [
    ...new Set(availableMajors.flatMap((m) => m.combinations)),
  ]

  const cert = getBestCertificateConversion(input.certificates)
  const encouragement = cert?.encouragementScore ?? 0
  const award = getAwardScore(input.awards)

  let best: MethodResult["bestCombination"] | undefined
  let bestBonus = {
    priorityAdjusted: 0,
    awardScore: 0,
    encouragementScore: encouragement,
    totalBonus30: 0,
  }

  for (const code of allCombinations) {
    const trial = getBestCombinationExamScore(input, [code], 0)
    if (!trial) continue

    const baseScore = trial.score

    const bonus = calculateTotalBonus30({
      priorityBase: input.priorityScore,
      totalScoreBeforePriority: baseScore,
      maxScaleForPriorityRule: 30,
      awardScore: award,
      encouragementScore: encouragement,
    })

    const finalScore = round2(baseScore + bonus.totalBonus30)

    if (!best || finalScore > best.score) {
      best = {
        ...trial,
        score: finalScore,
      }
      bestBonus = bonus
    }
  }

  return {
    method: "500",
    eligible: best != null && award > 0,
    scoreRaw: best?.score ?? null,
    scoreDisplay: best?.score ?? null,
    maxScale: 30,
    note:
      award > 0
        ? "Cần nộp minh chứng giải HSG và chứng chỉ (nếu có) để trường kiểm tra."
        : "PTXT 500 cần có giải HSG cấp tỉnh/thành phố phù hợp.",
    bestCombination: best ?? undefined,
    certificateUsed: cert ?? undefined,
    priorityBase: input.priorityScore,
    priorityAdjusted: bestBonus.priorityAdjusted,
    awardScore: bestBonus.awardScore,
    encouragementScore: bestBonus.encouragementScore,
    totalBonus30: bestBonus.totalBonus30,
  }
}