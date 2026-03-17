import {
  CandidateInput,
  CombinationCode,
  Major,
  MethodResult,
  ProgramTrackScore,
  Subject,
  TranscriptSubject,
} from "@/types/admission"
import {
  getBestCertificateConversion,
  getBestCertificateConversionForMajor,
  getBestCertificateConversionForCombination,
} from "@/data/certificateRules"
import { getAwardScoreForMajor } from "@/data/awardRules"
import {
  STANDARD_PROGRAM_COMBINATIONS,
  SPECIAL_PROGRAM_COMBINATIONS,
} from "@/data/scoreBuckets"
import { getAllowedCombinationsForMajorMethod } from "@/data/admissionRules"
import {
  calculateTotalBonus30,
  getTranscriptAverage,
  round2,
} from "./helpers"
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

function isTranscriptCompatibleSubject(
  subject: Subject,
): subject is TranscriptSubject {
  return (
    subject === "toan" ||
    subject === "van" ||
    subject === "anh" ||
    subject === "ly" ||
    subject === "hoa" ||
    subject === "sinh" ||
    subject === "su" ||
    subject === "dia" ||
    subject === "gdktpl" ||
    subject === "tinhoc" ||
    subject === "congnghecongnghiep" ||
    subject === "congnghenongnghiep"
  )
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

export function calculateMethod410(
  input: CandidateInput,
  major?: Major,
): MethodResult {
  const fallbackCert = major
    ? getBestCertificateConversionForMajor(input.certificates, major.code)
    : getBestCertificateConversion(input.certificates)

  if (!fallbackCert) {
    return {
      method: "410",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Chưa có chứng chỉ ngoại ngữ hợp lệ cho ngành ${major.code} để quy đổi PTXT 410.`
        : "Chưa có chứng chỉ ngoại ngữ đủ điều kiện để quy đổi cho PTXT 410.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      programTrackScores: [],
    }
  }

  const awardBase = getAwardScoreForMajor(input.awards, major)
  const bonusSpecialSchool = input.isSpecializedSchool ? 0.5 : 0
  const award = Math.min(awardBase + bonusSpecialSchool, 1.5)

  const standardAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "410",
        getFallbackCombinations("standard", major),
      )
    : getFallbackCombinations("standard")

  const specialAllowed: CombinationCode[] = major
    ? getAllowedCombinationsForMajorMethod(
        major.code,
        "410",
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

      const certForCombination = getBestCertificateConversionForCombination({
        certificates: input.certificates,
        majorCode: major?.code ?? "",
        subjects,
      })

      if (!certForCombination) continue

      const languageSubject = resolveLanguageSubjectForCertificate(
        subjects,
        certForCombination.certificateType,
      )
      if (!languageSubject) continue

      const nonLanguage = subjects.find(
        (subject) => subject !== "toan" && subject !== languageSubject,
      )
      if (!nonLanguage) continue

      if (!isTranscriptCompatibleSubject(nonLanguage)) continue

      const toanAvg = getTranscriptAverage(input, "toan")
      const otherAvg = getTranscriptAverage(input, nonLanguage)

      if (toanAvg == null || otherAvg == null) continue

      const baseWithoutBonus =
        toanAvg + otherAvg + certForCombination.convertedScore

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
      method: "410",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Chưa đủ dữ liệu học bạ hoặc chưa có tổ hợp hợp lệ cho ngành ${major.code} ở PTXT 410.`
        : "Chưa đủ dữ liệu học bạ 3 năm cho các tổ hợp xét PTXT 410.",
      certificateUsed: fallbackCert,
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      programTrackScores: [],
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
    method: "410",
    eligible: true,
    scoreRaw: bestTrack.scoreDisplay,
    scoreDisplay: bestTrack.scoreDisplay,
    maxScale: 30,
    note: major
      ? `Kết quả PTXT 410 được tính theo đúng chứng chỉ hợp lệ của từng tổ hợp và tổ hợp được phép của ngành ${major.code}.`
      : "Kết quả PTXT 410 được tính theo đúng chứng chỉ hợp lệ của từng tổ hợp.",
    bestCombination: bestTrack.bestCombination,
    certificateUsed: bestCert,
    priorityBase: bestTrack.priorityBase ?? input.priorityScore,
    priorityAdjusted: bestTrack.priorityAdjusted ?? 0,
    awardScore: bestTrack.awardScore ?? 0,
    encouragementScore: bestTrack.encouragementScore ?? 0,
    totalBonus30: bestTrack.totalBonus30 ?? 0,
    programTrackScores: allTrackScores,
  }
}