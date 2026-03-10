import { MethodResult } from "@/types/admission"

function getMethodLabel(method: string) {
  switch (method) {
    case "100":
      return "Điểm thi THPT"
    case "301":
      return "Xét tuyển thẳng / ưu tiên xét tuyển"
    case "402":
      return "HSA / TSA / SAT / ACT"
    case "409":
      return "Chứng chỉ ngoại ngữ + THPT"
    case "410":
      return "Chứng chỉ ngoại ngữ + học bạ"
    case "500":
      return "THPT + giải HSG"
    default:
      return method
  }
}

export default function MethodTable({
  methods,
}: {
  methods: MethodResult[]
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Mã PTXT
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Tên phương thức
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Điểm
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Tổ hợp tốt nhất
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Chứng chỉ dùng
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Ghi chú
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {methods.map((method) => (
              <tr key={method.method} className="align-top">
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {method.method}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {getMethodLabel(method.method)}
                </td>

                <td className="px-4 py-4">
                  {method.eligible ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Đủ điều kiện
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      Chưa đủ
                    </span>
                  )}
                </td>

                <td className="px-4 py-4 font-medium text-slate-900">
                  {method.scoreDisplay ?? "-"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {method.bestCombination ? (
                    <div>
                      <p className="font-medium text-slate-900">
                        {method.bestCombination.combination}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {method.bestCombination.subjects.join(" + ")}
                      </p>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {method.certificateUsed ? (
                    <div>
                      <p className="font-medium text-slate-900">
                        {method.certificateUsed.certificateType}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Giá trị: {method.certificateUsed.rawValue}
                      </p>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="max-w-sm px-4 py-4 text-slate-600">
                  {method.note ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}