import { CombinationCode } from "@/types/admission"

export const STANDARD_PROGRAM_COMBINATIONS: CombinationCode[] = [
  "A00",
  "A01",
  "D01",
  "D07",
]

export const SPECIAL_PROGRAM_COMBINATIONS: CombinationCode[] = [
  "A01",
  "D01",
  "D07",
  "D09",
  "D10",
  "X25",
  "X26",
  "X27",
  "X28",
]

export const SCORE_BUCKETS = {
  standard: {
    key: "standard" as const,
    title: "Tổng điểm đạt được tối đa 30 điểm - Chương trình chuẩn",
    combinations: STANDARD_PROGRAM_COMBINATIONS,
  },
  special: {
    key: "special" as const,
    title: "Tổng điểm đạt được tối đa 30 điểm - CTĐT IPOP, Song bằng, Tiên tiến",
    combinations: SPECIAL_PROGRAM_COMBINATIONS,
  },
}