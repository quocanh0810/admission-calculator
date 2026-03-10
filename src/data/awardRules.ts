import { AwardInput } from "@/types/admission"

export function getAwardScore(awards?: AwardInput[]): number {
  if (!awards || awards.length === 0) return 0

  const best = awards.reduce((max, item) => {
    const score =
      item.level === "nhat" ? 1.5 : item.level === "nhi" ? 1.25 : 1.0
    return Math.max(max, score)
  }, 0)

  return Math.min(best, 1.5)
}