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
  getBestCertificateConversionForCombination,
} from "@/data/certificateRules"
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

export function calculateMethod100(
  input: CandidateInput,
  major?: Major,
): MethodResult {
  const fallbackCert = major
    ? getBestCertificateConversionForMajor(input.certificates, major.code)
    : getBestCertificateConversion(input.certificates)

  const standardAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "100",
        getFallbackCombinations("standard", major),
      )
    : getFallbackCombinations("standard")

  const specialAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "100",
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
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      combinationAudits: [],
    }

    const audits: NonNullable<TrackCalcResult["combinationAudits"]> = []

    for (const code of allowedCombinations) {
      const trial = getBestCombinationExamScore(input, [code], 0)

      if (!trial) {
        audits.push({
          combination: code,
          subjects: [],
          isEligible: false,
          reason: "Thiếu điểm để tính tổ hợp này.",
          baseScoreBeforeBonus: null,
          finalScore: null,
          priorityBase: input.priorityScore,
          priorityAdjusted: 0,
          awardScore: 0,
          encouragementScore: 0,
          totalBonus30: 0,
        })
        continue
      }

      const certForCombination = getBestCertificateConversionForCombination({
        certificates: input.certificates,
        majorCode: major?.code ?? "",
        subjects: trial.subjects,
      })

      const encouragement = certForCombination?.encouragementScore ?? 0
      const baseScore = trial.score

      const bonus = calculateTotalBonus30({
        priorityBase: input.priorityScore,
        totalScoreBeforePriority: baseScore,
        maxScaleForPriorityRule: 30,
        awardScore: 0,
        encouragementScore: encouragement,
      })

      const finalScore = round2(baseScore + bonus.totalBonus30)

      audits.push({
        combination: trial.combination,
        subjects: trial.subjects,
        isEligible: true,
        baseScoreBeforeBonus: baseScore,
        finalScore,
        priorityBase: input.priorityScore,
        priorityAdjusted: bonus.priorityAdjusted,
        awardScore: bonus.awardScore,
        encouragementScore: bonus.encouragementScore,
        totalBonus30: bonus.totalBonus30,
      })

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
          combinationAudits: [...audits],
        }
      }
    }

    if (best.scoreDisplay == null) {
      return {
        ...best,
        combinationAudits: audits,
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
    .filter((item) => typeof item.scoreDisplay === "number")
    .sort((a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0))[0]

  const eligible = allTrackScores.some(
    (item) => typeof item.scoreDisplay === "number",
  )

  if (!eligible || !bestTrack) {
    return {
      method: "100",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Chưa đủ dữ liệu điểm thi hoặc chưa có tổ hợp hợp lệ cho ngành ${major.code} ở PTXT 100.`
        : "Chưa đủ dữ liệu điểm thi THPT cho các tổ hợp xét PTXT 100.",
      certificateUsed: fallbackCert ?? undefined,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      programTrackScores: allTrackScores,
    }
  }

  const bestCert =
    bestTrack.bestCombination && major
      ? getBestCertificateConversionForCombination({
          certificates: input.certificates,
          majorCode: major.code,
          subjects: bestTrack.bestCombination.subjects,
        }) ?? fallbackCert
      : bestTrack.bestCombination
        ? getBestCertificateConversionForCombination({
            certificates: input.certificates,
            majorCode: "",
            subjects: bestTrack.bestCombination.subjects,
          }) ?? fallbackCert
        : fallbackCert

  return {
    method: "100",
    eligible: true,
    scoreRaw: bestTrack.scoreDisplay,
    scoreDisplay: bestTrack.scoreDisplay,
    maxScale: 30,
    note: major
      ? `Kết quả PTXT 100 được tính theo các tổ hợp được phép của ngành ${major.code}; điểm khuyến khích chứng chỉ được xác định đúng theo từng tổ hợp.`
      : "Kết quả PTXT 100 được tính theo các tổ hợp hợp lệ; điểm khuyến khích chứng chỉ được xác định đúng theo từng tổ hợp.",
    bestCombination: bestTrack.bestCombination,
    certificateUsed: bestCert ?? undefined,
    priorityBase: bestTrack.priorityBase ?? input.priorityScore,
    priorityAdjusted: bestTrack.priorityAdjusted ?? 0,
    awardScore: bestTrack.awardScore ?? 0,
    encouragementScore: bestTrack.encouragementScore ?? 0,
    totalBonus30: bestTrack.totalBonus30 ?? 0,
    programTrackScores: allTrackScores,
  }
}