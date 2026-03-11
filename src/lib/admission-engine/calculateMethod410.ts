import {
  CandidateInput,
  MethodResult,
  Major,
  TranscriptSubject,
  CombinationCode,
} from "@/types/admission"
import { getBestCertificateConversion } from "@/data/certificateRules"
import { getAwardScore } from "@/data/awardRules"
import {
  calculateTotalBonus30,
  getTranscriptAverage,
  round2,
} from "./helpers"
import { combinations } from "@/data/combinations"

export function calculateMethod410(
  input: CandidateInput,
  availableMajors: Major[],
): MethodResult {
  const cert = getBestCertificateConversion(input.certificates)

  if (!cert) {
    return {
      method: "410",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: "Chưa có chứng chỉ ngoại ngữ đủ điều kiện để quy đổi cho PTXT 410.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
    }
  }

  const combinationsFromMajors = [
    ...new Set(availableMajors.flatMap((m) => m.combinations)),
  ] as CombinationCode[]

  const allCombinations: CombinationCode[] =
    combinationsFromMajors.length > 0
      ? combinationsFromMajors
      : ["A01", "D01", "D07", "D09", "D10", "X25", "X26", "X27", "X28"]

  const awardBase = getAwardScore(input.awards)
  const bonusSpecialSchool = input.isSpecializedSchool ? 0.5 : 0
  const award = Math.min(awardBase + bonusSpecialSchool, 1.5)

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
    if (nonLanguage === "tiengphap" || nonLanguage === "tiengtrung") continue

    const toanAvg = getTranscriptAverage(input, "toan")
    const otherAvg = getTranscriptAverage(
      input,
      nonLanguage as TranscriptSubject,
    )

    if (toanAvg == null || otherAvg == null) continue

    const baseWithoutBonus = toanAvg + otherAvg + cert.convertedScore

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
      method: "410",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: "Chưa đủ dữ liệu học bạ 3 năm cho các tổ hợp xét PTXT 410",
      certificateUsed: cert,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
    }
  }

  return {
    method: "410",
    eligible: true,
    scoreRaw: best.score,
    scoreDisplay: best.score,
    maxScale: 30,
    bestCombination: best,
    certificateUsed: cert,
    priorityBase: input.priorityScore,
    priorityAdjusted: bestBonus.priorityAdjusted,
    awardScore: bestBonus.awardScore,
    encouragementScore: bestBonus.encouragementScore,
    totalBonus30: bestBonus.totalBonus30,
  }
}