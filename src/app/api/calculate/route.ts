import { NextResponse } from "next/server"
import { candidateInputSchema } from "@/lib/validators/candidateInputSchema"
import { calculateAllMethods } from "@/lib/admission-engine/calculateAllMethods"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = candidateInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu đầu vào không hợp lệ.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      )
    }

    const result = calculateAllMethods(parsed.data)

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