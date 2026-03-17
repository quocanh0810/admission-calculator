import { NextResponse } from "next/server"
import { candidateInputSchema } from "@/lib/validators/candidateInputSchema"
import { calculateAllMethods } from "@/lib/admission-engine/calculateAllMethods"
import { buildAdmissionExcel } from "@/lib/exporters/exportAdmissionExcel"

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

    const buffer = await buildAdmissionExcel({
      input: parsed.data,
      result,
    })

    const fileBuffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="ket-qua-tinh-diem-tmu.xlsx"',
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("API /export-excel error:", error)

    return NextResponse.json(
      {
        error: "Không thể xuất file Excel.",
      },
      { status: 500 },
    )
  }
}