import { CandidateInput, MethodResult } from "@/types/admission"
import { getBestCertificateConversion } from "@/data/certificateRules"
import { getAwardScore } from "@/data/awardRules"
import {
  calculateTotalBonus30,
  round2,
  scaleBonus30ToScaleN,
} from "./helpers"

export function calculateMethod402(input: CandidateInput): MethodResult {
  const cert = getBestCertificateConversion(input.certificates)
  const encouragement = cert?.encouragementScore ?? 0
  const award = getAwardScore(input.awards)

  const candidates = [
    input.hsa != null && input.hsa >= 80
      ? { branch: "HSA" as const, rawBase: input.hsa, maxScale: 150 as const }
      : null,
    input.tsa != null && input.tsa >= 50
      ? { branch: "TSA" as const, rawBase: input.tsa, maxScale: 100 as const }
      : null,
    input.sat != null && input.sat >= 1000
      ? { branch: "SAT" as const, rawBase: input.sat, maxScale: 1600 as const }
      : null,
    input.act != null && input.act >= 20
      ? { branch: "ACT" as const, rawBase: input.act, maxScale: 36 as const }
      : null,
  ].filter(Boolean) as {
    branch: "HSA" | "TSA" | "SAT" | "ACT"
    rawBase: number
    maxScale: 150 | 100 | 1600 | 36
  }[]

  if (!candidates.length) {
    return {
      method: "402",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: "Không đủ ngưỡng HSA/TSA/SAT/ACT.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      branches402: [],
    }
  }

  const branches402 = candidates.map((candidate) => {
    const bonus30 = calculateTotalBonus30({
      priorityBase: input.priorityScore,
      totalScoreBeforePriority: candidate.rawBase,
      maxScaleForPriorityRule: candidate.maxScale,
      awardScore: award,
      encouragementScore: encouragement,
    })

    const totalBonusScaled = scaleBonus30ToScaleN(
      bonus30.totalBonus30,
      candidate.maxScale,
    )

    const finalScore = round2(candidate.rawBase + totalBonusScaled)

    return {
      branch: candidate.branch,
      maxScale: candidate.maxScale,
      rawBase: candidate.rawBase,
      priorityBase: input.priorityScore,
      priorityAdjusted: bonus30.priorityAdjusted,
      awardScore: bonus30.awardScore,
      encouragementScore: bonus30.encouragementScore,
      totalBonus30: bonus30.totalBonus30,
      totalBonusScaled,
      finalScore,
    }
  })

  const best = [...branches402].sort((a, b) => b.finalScore - a.finalScore)[0]

  return {
    method: "402",
    eligible: true,
    scoreRaw: best.finalScore,
    scoreDisplay: best.finalScore,
    maxScale: best.maxScale,
    priorityBase: best.priorityBase,
    priorityAdjusted: best.priorityAdjusted,
    awardScore: best.awardScore,
    encouragementScore: best.encouragementScore,
    totalBonus30: best.totalBonus30,
    certificateUsed: cert ?? undefined,
    branches402,
    bestBranch402: best.branch,
  }
}