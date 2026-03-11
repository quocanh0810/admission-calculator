import {
  CandidateInput,
  CombinationCode,
  MethodResult,
  ProgramTrackScore,
} from "@/types/admission"
import { getBestCertificateConversion } from "@/data/certificateRules"
import { getAwardScore } from "@/data/awardRules"
import {
  STANDARD_PROGRAM_COMBINATIONS,
  SPECIAL_PROGRAM_COMBINATIONS,
} from "@/data/scoreBuckets"
import { calculateTotalBonus30, round2 } from "./helpers"
import { combinations } from "@/data/combinations"

type TrackCalcResult = ProgramTrackScore

export function calculateMethod409(input: CandidateInput): MethodResult {
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
      programTrackScores: [],
    }
  }

  const validCert = cert
  const award = getAwardScore(input.awards)

  function buildTrackScore(
    track: "standard" | "special",
    trackLabel: string,
    allowedCombinations: readonly CombinationCode[],
  ): TrackCalcResult {
    let best: TrackCalcResult = {
      track,
      trackLabel,
      scoreDisplay: null,
      baseScoreBeforeBonus: null,
      bestCombination: undefined,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
    }

    for (const code of allowedCombinations) {
      const subjects = combinations[code]

      if (!subjects.includes("toan") || !subjects.includes("anh")) continue

      const nonLanguage = subjects.find((s) => s !== "toan" && s !== "anh")
      if (!nonLanguage) continue

      const toan = input.examScores.toan
      const other = input.examScores[nonLanguage]

      if (typeof toan !== "number" || typeof other !== "number") continue

      const baseWithoutBonus =
        (toan as number) + (other as number) + validCert.convertedScore

      const bonus = calculateTotalBonus30({
        priorityBase: input.priorityScore,
        totalScoreBeforePriority: baseWithoutBonus,
        maxScaleForPriorityRule: 30,
        awardScore: award,
        encouragementScore: 0,
      })

      const finalScore = round2(baseWithoutBonus + bonus.totalBonus30)

      if (best.scoreDisplay == null || finalScore > best.scoreDisplay) {
        best = {
          track,
          trackLabel,
          scoreDisplay: finalScore,
          baseScoreBeforeBonus: baseWithoutBonus,
          bestCombination: {
            combination: code,
            subjects,
            score: finalScore,
          },
          priorityBase: input.priorityScore,
          priorityAdjusted: bonus.priorityAdjusted,
          awardScore: bonus.awardScore,
          encouragementScore: bonus.encouragementScore,
          totalBonus30: bonus.totalBonus30,
        }
      }
    }

    return best
  }

  const standardTrack = buildTrackScore(
    "standard",
    "Tổng điểm đạt được tối đa 30 điểm - Chương trình chuẩn",
    STANDARD_PROGRAM_COMBINATIONS,
  )

  const specialTrack = buildTrackScore(
    "special",
    "Tổng điểm đạt được tối đa 30 điểm - IPOP / Song bằng / Tiên tiến",
    SPECIAL_PROGRAM_COMBINATIONS,
  )

  const allTrackScores: TrackCalcResult[] = [standardTrack, specialTrack]

  const bestTrack = allTrackScores
    .filter((item) => item.scoreDisplay != null)
    .sort((a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0))[0]

  return {
    method: "409",
    eligible: allTrackScores.some((item) => item.scoreDisplay != null),
    scoreRaw: bestTrack?.scoreDisplay ?? null,
    scoreDisplay: bestTrack?.scoreDisplay ?? null,
    maxScale: 30,
    note: "Cần nộp minh chứng chứng chỉ ngoại ngữ để trường kiểm tra và quy đổi chính thức.",
    bestCombination: bestTrack?.bestCombination,
    certificateUsed: validCert,
    priorityBase: bestTrack?.priorityBase ?? input.priorityScore,
    priorityAdjusted: bestTrack?.priorityAdjusted ?? 0,
    awardScore: bestTrack?.awardScore ?? 0,
    encouragementScore: bestTrack?.encouragementScore ?? 0,
    totalBonus30: bestTrack?.totalBonus30 ?? 0,
    programTrackScores: allTrackScores,
  }
}