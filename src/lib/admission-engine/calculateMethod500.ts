import {
  CandidateInput,
  CombinationCode,
  Major,
  MethodResult,
  ProgramTrackScore,
} from "@/types/admission"
import {
  getBestCertificateConversion,
  getBestCertificateConversionForMajor,
} from "@/data/certificateRules"
import { getAwardScoreForMajor } from "@/data/awardRules"
import {
  STANDARD_PROGRAM_COMBINATIONS,
  SPECIAL_PROGRAM_COMBINATIONS,
} from "@/data/scoreBuckets"
import { getAllowedCombinationsForMajorMethod } from "@/data/admissionRules"
import {
  calculateTotalBonus30,
  getBestCombinationExamScore,
  round2,
} from "./helpers"

type TrackCalcResult = ProgramTrackScore

function getFallbackCombinations(
  track: "standard" | "special",
  major?: Major,
): CombinationCode[] {
  if (major?.combinations?.length) {
    return [...major.combinations]
  }

  return track === "standard"
    ? [...STANDARD_PROGRAM_COMBINATIONS]
    : [...SPECIAL_PROGRAM_COMBINATIONS]
}

export function calculateMethod500(
  input: CandidateInput,
  major?: Major,
): MethodResult {
  const award = getAwardScoreForMajor(input.awards, major)

  if (award <= 0) {
    return {
      method: "500",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `PTXT 500 của ngành ${major.code} yêu cầu có giải HSG cấp tỉnh/thành phố phù hợp với ngành/chương trình đào tạo này.`
        : "PTXT 500 cần có giải HSG cấp tỉnh/thành phố phù hợp.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      programTrackScores: [],
    }
  }

  const cert = major
    ? getBestCertificateConversionForMajor(input.certificates, major.code)
    : getBestCertificateConversion(input.certificates)

  const encouragement = cert?.encouragementScore ?? 0

  const standardAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "500",
        getFallbackCombinations("standard", major),
      )
    : getFallbackCombinations("standard")

  const specialAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "500",
        getFallbackCombinations("special", major),
      )
    : getFallbackCombinations("special")

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
      awardScore: award,
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
    major
      ? `Tổng điểm đạt được tối đa 30 điểm - Chương trình chuẩn (${major.code})`
      : "Tổng điểm đạt được tối đa 30 điểm - Chương trình chuẩn",
    standardAllowed,
  )

  const specialTrack = buildTrackScore(
    "special",
    major
      ? `Tổng điểm đạt được tối đa 30 điểm - IPOP / Song bằng / Tiên tiến (${major.code})`
      : "Tổng điểm đạt được tối đa 30 điểm - IPOP / Song bằng / Tiên tiến",
    specialAllowed,
  )

  const allTrackScores: TrackCalcResult[] = [standardTrack, specialTrack]

  const bestTrack = allTrackScores
    .filter((item) => item.scoreDisplay != null)
    .sort((a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0))[0]

  if (!bestTrack || bestTrack.scoreDisplay == null) {
    return {
      method: "500",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Chưa đủ dữ liệu điểm thi hoặc chưa có tổ hợp hợp lệ cho ngành ${major.code} ở PTXT 500.`
        : "Chưa đủ dữ liệu điểm thi THPT cho các tổ hợp xét PTXT 500.",
      certificateUsed: cert ?? undefined,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: award,
      encouragementScore: encouragement,
      totalBonus30: 0,
      programTrackScores: [],
    }
  }

  return {
    method: "500",
    eligible: true,
    scoreRaw: bestTrack.scoreDisplay,
    scoreDisplay: bestTrack.scoreDisplay,
    maxScale: 30,
    note: major
      ? `Kết quả PTXT 500 được tính theo giải HSG hợp lệ, chứng chỉ hợp lệ và tổ hợp được phép của ngành ${major.code}.`
      : "Cần nộp minh chứng giải HSG và chứng chỉ (nếu có) để trường kiểm tra.",
    bestCombination: bestTrack.bestCombination,
    certificateUsed: cert ?? undefined,
    priorityBase: bestTrack.priorityBase ?? input.priorityScore,
    priorityAdjusted: bestTrack.priorityAdjusted ?? 0,
    awardScore: bestTrack.awardScore ?? award,
    encouragementScore: bestTrack.encouragementScore ?? encouragement,
    totalBonus30: bestTrack.totalBonus30 ?? 0,
    programTrackScores: allTrackScores,
  }
}