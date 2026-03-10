import { CandidateInput, MethodResult, Major } from "@/types/admission"
import { getBestCertificateConversion } from "@/data/certificateRules"
import { getAwardScore } from "@/data/awardRules"
import { calculateTotalBonus30, round2 } from "./helpers"
import { combinations } from "@/data/combinations"

export function calculateMethod409(
  input: CandidateInput,
  availableMajors: Major[],
): MethodResult {
  const cert = getBestCertificateConversion(input.certificates)

  if (!cert) {
    return {
      method: "409",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: "Chưa có chứng chỉ ngoại ngữ đủ điều kiện để quy đổi cho PTXT 409.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
    }
  }

  const allCombinations = [
    ...new Set(availableMajors.flatMap((m) => m.combinations)),
  ]

  const award = getAwardScore(input.awards)

  let best: MethodResult["bestCombination"] | undefined
  let bestBonus = {
    priorityAdjusted: 0,
    awardScore: 0,
    encouragementScore: 0,
    totalBonus30: 0,
  }

  for (const code of allCombinations) {
    const subjects = combinations[code]
    if (!subjects.includes("toan") || !subjects.includes("anh")) continue

    const nonLanguage = subjects.find((s) => s !== "toan" && s !== "anh")
    if (!nonLanguage) continue

    const toan = input.examScores.toan
    const other = input.examScores[nonLanguage]
    if (typeof toan !== "number" || typeof other !== "number") continue

    const baseWithoutBonus = round2(toan + other + cert.convertedScore)

    const bonus = calculateTotalBonus30({
      priorityBase: input.priorityScore,
      totalScoreBeforePriority: baseWithoutBonus,
      maxScaleForPriorityRule: 30,
      awardScore: award,
      encouragementScore: 0,
    })

    const finalScore = round2(baseWithoutBonus + bonus.totalBonus30)

    if (!best || finalScore > best.score) {
      best = {
        combination: code,
        subjects,
        score: finalScore,
      }
      bestBonus = bonus
    }
  }

  if (!best) {
    return {
      method: "409",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: "Không đủ dữ liệu để tính PTXT 409.",
      certificateUsed: cert,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
    }
  }

  return {
    method: "409",
    eligible: true,
    scoreRaw: best.score,
    scoreDisplay: best.score,
    maxScale: 30,
    note: "Cần nộp minh chứng chứng chỉ ngoại ngữ để trường kiểm tra và quy đổi chính thức.",
    bestCombination: best,
    certificateUsed: cert,
    priorityBase: input.priorityScore,
    priorityAdjusted: bestBonus.priorityAdjusted,
    awardScore: bestBonus.awardScore,
    encouragementScore: bestBonus.encouragementScore,
    totalBonus30: bestBonus.totalBonus30,
  }
}