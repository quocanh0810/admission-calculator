import {
  CandidateInput,
  CombinationCode,
  Major,
  MethodResult,
  ProgramTrackScore,
  Subject,
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
import { calculateTotalBonus30, round2 } from "./helpers"
import { combinations } from "@/data/combinations"

type TrackCalcResult = ProgramTrackScore

function resolveLanguageSubjectForCertificate(
  subjects: Subject[],
  certificateType?: string,
): Subject | null {
  if (!certificateType) return null

  if (certificateType === "HSK") {
    if (subjects.includes("tiengtrung")) return "tiengtrung"
    if (subjects.includes("anh")) return "anh"
    return null
  }

  if (certificateType === "TCF" || certificateType === "DELF") {
    return subjects.includes("tiengphap") ? "tiengphap" : null
  }

  return subjects.includes("anh") ? "anh" : null
}

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

export function calculateMethod409(
  input: CandidateInput,
  major?: Major,
): MethodResult {
  const cert = major
    ? getBestCertificateConversionForMajor(input.certificates, major.code)
    : getBestCertificateConversion(input.certificates)

  if (!cert) {
    return {
      method: "409",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Chưa có chứng chỉ ngoại ngữ hợp lệ cho ngành ${major.code} để quy đổi PTXT 409.`
        : "Chưa có chứng chỉ ngoại ngữ đủ điều kiện để quy đổi cho PTXT 409.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      programTrackScores: [],
    }
  }

  const validCert = cert
  const award = getAwardScoreForMajor(input.awards, major)

  const standardAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "409",
        getFallbackCombinations("standard", major),
      )
    : getFallbackCombinations("standard")

  const specialAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "409",
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
    }

    for (const code of allowedCombinations) {
      const subjects = combinations[code]
      if (!subjects) continue

      if (!subjects.includes("toan")) continue

      const languageSubject = resolveLanguageSubjectForCertificate(
        subjects,
        validCert.certificateType,
      )
      if (!languageSubject) continue

      const nonLanguage = subjects.find(
        (subject) => subject !== "toan" && subject !== languageSubject,
      )
      if (!nonLanguage) continue

      const toan = input.examScores.toan
      const other = input.examScores[nonLanguage]

      if (typeof toan !== "number" || typeof other !== "number") continue

      const baseWithoutBonus = toan + other + validCert.convertedScore

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
      method: "409",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Chưa đủ dữ liệu điểm thi hoặc chưa có tổ hợp hợp lệ cho ngành ${major.code} ở PTXT 409.`
        : "Chưa đủ dữ liệu điểm thi THPT cho các tổ hợp xét PTXT 409.",
      certificateUsed: validCert,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      programTrackScores: [],
    }
  }

  return {
    method: "409",
    eligible: true,
    scoreRaw: bestTrack.scoreDisplay,
    scoreDisplay: bestTrack.scoreDisplay,
    maxScale: 30,
    note: major
      ? `Kết quả PTXT 409 được tính theo chứng chỉ hợp lệ và tổ hợp được phép của ngành ${major.code}.`
      : "Cần nộp minh chứng chứng chỉ ngoại ngữ để trường kiểm tra và quy đổi chính thức.",
    bestCombination: bestTrack.bestCombination,
    certificateUsed: validCert,
    priorityBase: bestTrack.priorityBase ?? input.priorityScore,
    priorityAdjusted: bestTrack.priorityAdjusted ?? 0,
    awardScore: bestTrack.awardScore ?? 0,
    encouragementScore: bestTrack.encouragementScore ?? 0,
    totalBonus30: bestTrack.totalBonus30 ?? 0,
    programTrackScores: allTrackScores,
  }
}