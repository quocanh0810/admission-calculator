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
import {
  calculateTotalBonus30,
  getBestCombinationExamScore,
  round2,
} from "./helpers"

type TrackCalcResult = ProgramTrackScore

export function calculateMethod500(input: CandidateInput): MethodResult {
  const cert = getBestCertificateConversion(input.certificates)
  const encouragement = cert?.encouragementScore ?? 0
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
      encouragementScore: encouragement,
      totalBonus30: 0,
    }

    for (const code of allowedCombinations) {
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

      if (best.scoreDisplay == null || finalScore > best.scoreDisplay) {
        best = {
          track,
          trackLabel,
          scoreDisplay: finalScore,
          baseScoreBeforeBonus: baseScore,
          bestCombination: {
            ...trial,
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

  const eligible =
    award > 0 && allTrackScores.some((item) => item.scoreDisplay != null)

  return {
    method: "500",
    eligible,
    scoreRaw: eligible ? bestTrack?.scoreDisplay ?? null : null,
    scoreDisplay: eligible ? bestTrack?.scoreDisplay ?? null : null,
    maxScale: 30,
    note: eligible
      ? "Cần nộp minh chứng giải HSG và chứng chỉ (nếu có) để trường kiểm tra."
      : "PTXT 500 cần có giải HSG cấp tỉnh/thành phố phù hợp.",
    bestCombination: bestTrack?.bestCombination,
    certificateUsed: cert ?? undefined,
    priorityBase: bestTrack?.priorityBase ?? input.priorityScore,
    priorityAdjusted: bestTrack?.priorityAdjusted ?? 0,
    awardScore: bestTrack?.awardScore ?? 0,
    encouragementScore: bestTrack?.encouragementScore ?? 0,
    totalBonus30: bestTrack?.totalBonus30 ?? 0,
    programTrackScores: allTrackScores,
  }
}