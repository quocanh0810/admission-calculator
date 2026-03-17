import { CertificateType, CombinationCode, MethodCode } from "@/types/admission"

export const CHINESE_LANGUAGE_MAJOR_CODES: string[] = ["TM40", "TM41"]
export const FRENCH_BUSINESS_MAJOR_CODES: string[] = ["TM42"]
export const TOEIC_EXCLUDED_MAJOR_CODES: string[] = ["TM41", "TM45"]
export const GENERAL_CERT_EXCLUDED_MAJOR_CODES: string[] = ["TM41"]

export function isCertificateAllowedForMajor(
  certificateType: CertificateType,
  majorCode: string,
): boolean {
  switch (certificateType) {
    case "IELTS":
    case "TOEFL_IBT":
    case "VSTEP":
    case "APTIS":
      return !GENERAL_CERT_EXCLUDED_MAJOR_CODES.includes(majorCode)

    case "TOEIC_4_SKILLS":
      return !TOEIC_EXCLUDED_MAJOR_CODES.includes(majorCode)

    case "HSK":
      return CHINESE_LANGUAGE_MAJOR_CODES.includes(majorCode)

    case "TCF":
    case "DELF":
      return FRENCH_BUSINESS_MAJOR_CODES.includes(majorCode)

    default:
      return false
  }
}

type MajorMethodCombinationRule = {
  majorCode: string
  method: MethodCode
  combinations: CombinationCode[]
}

export const MAJOR_METHOD_COMBINATION_RULES: MajorMethodCombinationRule[] = [
  // TM40 - Ngôn ngữ Trung Quốc (Chuẩn)
  { majorCode: "TM40", method: "100", combinations: ["A01", "D01", "D04", "D07"] },
  { majorCode: "TM40", method: "409", combinations: ["A01", "D01", "D04", "D07"] },
  { majorCode: "TM40", method: "500", combinations: ["A01", "D01", "D04", "D07"] },

  // TM41 - Ngôn ngữ Trung Quốc (IPOP)
  { majorCode: "TM41", method: "100", combinations: ["D04"] },
  { majorCode: "TM41", method: "409", combinations: ["D04"] },
  { majorCode: "TM41", method: "410", combinations: ["D04"] },
  { majorCode: "TM41", method: "500", combinations: ["D04"] },

  // TM33 - Ngôn ngữ Anh (Chuẩn)
  { majorCode: "TM33", method: "100", combinations: ["A01", "D01", "D07"] },
  { majorCode: "TM33", method: "409", combinations: ["A01", "D01", "D07"] },
  { majorCode: "TM33", method: "410", combinations: ["A01", "D01", "D07"] },
  { majorCode: "TM33", method: "500", combinations: ["A01", "D01", "D07"] },
]

export function getAllowedCombinationsForMajorMethod(
    majorCode: string,
    method: MethodCode,
    fallbackCombinations: CombinationCode[],
  ): CombinationCode[] {
    const rule = MAJOR_METHOD_COMBINATION_RULES.find(
      (item) => item.majorCode === majorCode && item.method === method,
    )
  
    return rule?.combinations ?? fallbackCombinations
  }