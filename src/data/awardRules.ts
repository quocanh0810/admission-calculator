import { AwardInput, HighSchoolAwardLevel, Major } from "@/types/admission"

const CHINESE_AWARD_MAJOR_CODES = ["TM40", "TM41"]
const FRENCH_AWARD_MAJOR_CODES = ["TM42"]
const IT_AWARD_MAJOR_CODES = ["TM31", "TM39", "TM51"]

function isSpecialProgram(major?: Major): boolean {
  if (!major?.programType) return false

  const value = major.programType.toLowerCase()

  return (
    value.includes("ipop") ||
    value.includes("song bằng") ||
    value.includes("song bang") ||
    value.includes("tiên tiến") ||
    value.includes("tien tien") ||
    value.includes("định hướng chuyên sâu nghề nghiệp quốc tế") ||
    value.includes("dinh huong chuyen sau nghe nghiep quoc te")
  )
}

function getAwardLevelScore(level: HighSchoolAwardLevel): number {
  switch (level) {
    case "nhat":
      return 1.5
    case "nhi":
      return 1.25
    case "ba":
      return 1.0
    default:
      return 0
  }
}

export function isAwardAllowedForMajor(
  award: AwardInput,
  major?: Major,
): boolean {
  switch (award.subject) {
    case "toan":
    case "ly":
    case "hoa":
    case "anh":
    case "van":
      return true

    case "su":
    case "dia":
    case "gdktpl":
      return isSpecialProgram(major)

    case "tiengphap":
      return !!major && FRENCH_AWARD_MAJOR_CODES.includes(major.code)

    case "tiengtrung":
      return !!major && CHINESE_AWARD_MAJOR_CODES.includes(major.code)

    case "tinhoc":
      return !!major && IT_AWARD_MAJOR_CODES.includes(major.code)

    default:
      return false
  }
}

export function getAwardScoreForMajor(
  awards?: AwardInput[],
  major?: Major,
): number {
  if (!awards || awards.length === 0) return 0

  const validAwards = awards.filter((award) =>
    isAwardAllowedForMajor(award, major),
  )

  if (!validAwards.length) return 0

  const best = validAwards.reduce((max, item) => {
    return Math.max(max, getAwardLevelScore(item.level))
  }, 0)

  return Math.min(best, 1.5)
}

export function getAwardScore(awards?: AwardInput[]): number {
  return getAwardScoreForMajor(awards, undefined)
}