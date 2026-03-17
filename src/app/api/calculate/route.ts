import { NextResponse } from "next/server"
import { candidateInputSchema } from "@/lib/validators/candidateInputSchema"
import { calculateAllMethods } from "@/lib/admission-engine/calculateAllMethods"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("API raw body:")
    console.dir(body, { depth: null })

    const parsed = candidateInputSchema.safeParse(body)

    if (!parsed.success) {
      const flattened = parsed.error.flatten()

      console.error("Schema parse error - flattened:")
      console.dir(flattened, { depth: null })

      console.error("Schema parse error - issues:")
      console.dir(parsed.error.issues, { depth: null })

      return NextResponse.json(
        {
          error: "Dữ liệu đầu vào không hợp lệ.",
          details: flattened,
          issues: parsed.error.issues,
        },
        { status: 400 },
      )
    }

    console.log("API parsed data:")
    console.dir(parsed.data, { depth: null })

    const result = calculateAllMethods(parsed.data)

    console.log("API result selectedMajorResults:")
    console.dir(result.selectedMajorResults, { depth: null })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("API /calculate error:", error)

    return NextResponse.json(
      {
        error: "Không thể xử lý yêu cầu tính điểm.",
      },
      { status: 500 },
    )
  }
}