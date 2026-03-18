import { Subject, CandidateInput, CertificateConversionResult, Toeic4Skills } from "@/types/admission"
import { isCertificateAllowedForMajor } from "@/data/admissionRules"

export function convertIelts(
  value?: number,
): CertificateConversionResult | null {
  if (value == null) return null

  if (value >= 7.0) {
    return {
      certificateType: "IELTS",
      rawValue: value,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (value >= 6.5) {
    return {
      certificateType: "IELTS",
      rawValue: value,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (value >= 6.0) {
    return {
      certificateType: "IELTS",
      rawValue: value,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (value >= 5.5) {
    return {
      certificateType: "IELTS",
      rawValue: value,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  if (value >= 5.0) {
    return {
      certificateType: "IELTS",
      rawValue: value,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertToeflIbt(
  value?: number,
): CertificateConversionResult | null {
  if (value == null) return null

  if (value >= 85) {
    return {
      certificateType: "TOEFL_IBT",
      rawValue: value,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (value >= 75) {
    return {
      certificateType: "TOEFL_IBT",
      rawValue: value,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (value >= 65) {
    return {
      certificateType: "TOEFL_IBT",
      rawValue: value,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (value >= 51) {
    return {
      certificateType: "TOEFL_IBT",
      rawValue: value,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  if (value >= 45) {
    return {
      certificateType: "TOEFL_IBT",
      rawValue: value,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertVstep(
  value?: number,
): CertificateConversionResult | null {
  if (value == null) return null

  if (value >= 8.5) {
    return {
      certificateType: "VSTEP",
      rawValue: value,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (value >= 8.0) {
    return {
      certificateType: "VSTEP",
      rawValue: value,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (value >= 7.0) {
    return {
      certificateType: "VSTEP",
      rawValue: value,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (value >= 6.0) {
    return {
      certificateType: "VSTEP",
      rawValue: value,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  if (value >= 5.5) {
    return {
      certificateType: "VSTEP",
      rawValue: value,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertAptis(
  value?: number,
): CertificateConversionResult | null {
  if (value == null) return null

  if (value >= 180) {
    return {
      certificateType: "APTIS",
      rawValue: value,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (value >= 170) {
    return {
      certificateType: "APTIS",
      rawValue: value,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (value >= 160) {
    return {
      certificateType: "APTIS",
      rawValue: value,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (value >= 150) {
    return {
      certificateType: "APTIS",
      rawValue: value,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  if (value >= 140) {
    return {
      certificateType: "APTIS",
      rawValue: value,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertToeic4Skills(
  value?: Toeic4Skills,
): CertificateConversionResult | null {
  if (!value) return null

  const lr = value.listeningReading
  const sw = value.speakingWriting

  if (lr >= 830 && sw >= 320) {
    return {
      certificateType: "TOEIC_4_SKILLS",
      rawValue: `${lr} + ${sw}`,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (lr >= 780 && sw >= 300) {
    return {
      certificateType: "TOEIC_4_SKILLS",
      rawValue: `${lr} + ${sw}`,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (lr >= 680 && sw >= 280) {
    return {
      certificateType: "TOEIC_4_SKILLS",
      rawValue: `${lr} + ${sw}`,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (lr >= 560 && sw >= 260) {
    return {
      certificateType: "TOEIC_4_SKILLS",
      rawValue: `${lr} + ${sw}`,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  if (lr >= 440 && sw >= 240) {
    return {
      certificateType: "TOEIC_4_SKILLS",
      rawValue: `${lr} + ${sw}`,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertHsk(
  level?: 3 | 4 | 5 | 6,
  score?: number,
): CertificateConversionResult | null {
  if (level == null) return null

  if (level === 6) {
    return {
      certificateType: "HSK",
      rawValue: `Cấp độ 6${score != null ? ` (${score})` : ""}`,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (level === 5) {
    return {
      certificateType: "HSK",
      rawValue: `Cấp độ 5${score != null ? ` (${score})` : ""}`,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (level === 4) {
    return {
      certificateType: "HSK",
      rawValue: `Cấp độ 4${score != null ? ` (${score})` : ""}`,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (level === 3) {
    return {
      certificateType: "HSK",
      rawValue: `Cấp độ 3${score != null ? ` (${score})` : ""}`,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertTcf(
  value?: number,
): CertificateConversionResult | null {
  if (value == null) return null

  if (value >= 500) {
    return {
      certificateType: "TCF",
      rawValue: value,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (value >= 450) {
    return {
      certificateType: "TCF",
      rawValue: value,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (value >= 400) {
    return {
      certificateType: "TCF",
      rawValue: value,
      convertedScore: 9,
      encouragementScore: 1.0,
    }
  }

  if (value >= 350) {
    return {
      certificateType: "TCF",
      rawValue: value,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  if (value >= 300) {
    return {
      certificateType: "TCF",
      rawValue: value,
      convertedScore: 8,
      encouragementScore: 0.5,
    }
  }

  return null
}

export function convertDelf(
  value?: "B1" | "B2" | "C1" | "C2",
): CertificateConversionResult | null {
  if (!value) return null

  if (value === "C1" || value === "C2") {
    return {
      certificateType: "DELF",
      rawValue: value,
      convertedScore: 10,
      encouragementScore: 1.5,
    }
  }

  if (value === "B2") {
    return {
      certificateType: "DELF",
      rawValue: value,
      convertedScore: 9.5,
      encouragementScore: 1.25,
    }
  }

  if (value === "B1") {
    return {
      certificateType: "DELF",
      rawValue: value,
      convertedScore: 8.5,
      encouragementScore: 0.75,
    }
  }

  return null
}

/**
 * Chọn chứng chỉ có điểm quy đổi cao nhất trong số chứng chỉ người dùng nhập.
 * Nếu bằng nhau thì ưu tiên chứng chỉ có điểm khuyến khích cao hơn.
 */

export function getBestCertificateConversion(certificates?: {
  ielts?: number
  toeflIbt?: number
  vstep?: number
  aptis?: number
  toeic4Skills?: Toeic4Skills
  hskLevel?: 3 | 4 | 5 | 6
  hskScore?: number
  tcf?: number
  delf?: "B1" | "B2" | "C1" | "C2"
}): CertificateConversionResult | null {
  if (!certificates) return null

  const results = [
    convertIelts(certificates.ielts),
    convertToeflIbt(certificates.toeflIbt),
    convertVstep(certificates.vstep),
    convertAptis(certificates.aptis),
    convertToeic4Skills(certificates.toeic4Skills),
    convertHsk(certificates.hskLevel, certificates.hskScore),
    convertTcf(certificates.tcf),
    convertDelf(certificates.delf),
  ].filter(Boolean) as CertificateConversionResult[]

  if (!results.length) return null

  return results.sort((a, b) => {
    if (b.convertedScore !== a.convertedScore) {
      return b.convertedScore - a.convertedScore
    }
    return b.encouragementScore - a.encouragementScore
  })[0]
}

export function getBestCertificateConversionForMajor(
  certificates: CandidateInput["certificates"],
  majorCode: string,
): CertificateConversionResult | null {
  if (!certificates) return null

  const results = [
    convertIelts(certificates.ielts),
    convertToeflIbt(certificates.toeflIbt),
    convertVstep(certificates.vstep),
    convertAptis(certificates.aptis),
    convertToeic4Skills(certificates.toeic4Skills),
    convertHsk(certificates.hskLevel),
    convertTcf(certificates.tcf),
    convertDelf(certificates.delf),
  ]
    .filter(Boolean)
    .filter((item) =>
      isCertificateAllowedForMajor(
        (item as CertificateConversionResult).certificateType,
        majorCode,
      ),
    ) as CertificateConversionResult[]

  if (!results.length) return null

  return results.sort((a, b) => {
    if (b.convertedScore !== a.convertedScore) {
      return b.convertedScore - a.convertedScore
    }
    return b.encouragementScore - a.encouragementScore
  })[0]
}

function getEnglishCertificateResults(
  certificates: CandidateInput["certificates"],
): CertificateConversionResult[] {
  if (!certificates) return []

  return [
    convertIelts(certificates.ielts),
    convertToeflIbt(certificates.toeflIbt),
    convertVstep(certificates.vstep),
    convertAptis(certificates.aptis),
    convertToeic4Skills(certificates.toeic4Skills),
  ].filter(Boolean) as CertificateConversionResult[]
}

function getChineseCertificateResults(
  certificates: CandidateInput["certificates"],
): CertificateConversionResult[] {
  if (!certificates) return []

  return [
    convertHsk(certificates.hskLevel),
  ].filter(Boolean) as CertificateConversionResult[]
}

function getFrenchCertificateResults(
  certificates: CandidateInput["certificates"],
): CertificateConversionResult[] {
  if (!certificates) return []

  return [
    convertTcf(certificates.tcf),
    convertDelf(certificates.delf),
  ].filter(Boolean) as CertificateConversionResult[]
}

function pickBestCertificate(
  results: CertificateConversionResult[],
): CertificateConversionResult | null {
  if (!results.length) return null

  return [...results].sort((a, b) => {
    if (b.convertedScore !== a.convertedScore) {
      return b.convertedScore - a.convertedScore
    }
    return b.encouragementScore - a.encouragementScore
  })[0]
}

export function getBestCertificateConversionForCombination(params: {
  certificates: CandidateInput["certificates"]
  majorCode: string
  subjects: Subject[]
}): CertificateConversionResult | null {
  const { certificates, majorCode, subjects } = params
  if (!certificates) return null

  let candidates: CertificateConversionResult[] = []

  if (subjects.includes("tiengtrung")) {
    candidates = getChineseCertificateResults(certificates)
  } else if (subjects.includes("tiengphap")) {
    candidates = getFrenchCertificateResults(certificates)
  } else if (subjects.includes("anh")) {
    candidates = getEnglishCertificateResults(certificates)
  } else {
    return null
  }

  const allowed =
    majorCode
      ? candidates.filter((item) =>
          isCertificateAllowedForMajor(item.certificateType, majorCode),
        )
      : candidates

  return pickBestCertificate(allowed)
}