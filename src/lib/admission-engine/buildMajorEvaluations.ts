import { majors } from "@/data/majors"
import { MajorMethodEvaluation, MethodResult } from "@/types/admission"

export function buildMajorEvaluations(methods: MethodResult[]): MajorMethodEvaluation[] {
  const byCode = new Map(methods.map((m) => [m.method, m]))

  const rows: MajorMethodEvaluation[] = []

  for (const major of majors) {
    for (const methodCode of major.allowedMethods) {
      if (methodCode === "301") continue

      const method = byCode.get(methodCode)
      if (!method?.eligible || method.scoreDisplay == null) continue

      rows.push({
        majorCode: major.code,
        majorName: major.name,
        method: method.method,
        scoreDisplay: method.scoreDisplay,
        benchmark2025: major.benchmark2025,
        marginVsBenchmark:
          typeof major.benchmark2025 === "number"
            ? Math.round((method.scoreDisplay - major.benchmark2025) * 100) / 100
            : null,
      })
    }
  }

  return rows.sort((a, b) => {
    const marginA = a.marginVsBenchmark ?? -999
    const marginB = b.marginVsBenchmark ?? -999
    return marginB - marginA
  })
}