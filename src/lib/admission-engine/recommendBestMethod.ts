import { MethodResult } from "@/types/admission"

export function recommendBestMethod(methods: MethodResult[]): MethodResult | null {
  const eligible = methods.filter((m) => m.eligible && typeof m.scoreDisplay === "number")
  if (eligible.length === 0) return null

  return eligible.sort((a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0))[0]
}