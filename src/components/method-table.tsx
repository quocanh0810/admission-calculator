import { MethodResult } from "@/types/admission"

const SUBJECT_LABELS: Record<string, string> = {
  toan: "Toán",
  van: "Văn",
  anh: "Anh",
  ly: "Lý",
  hoa: "Hóa",
  su: "Sử",
  dia: "Địa",
  gdktpl: "GDKT&PL",
  tinhoc: "Tin học",
  congnghecongnghiep: "Công nghệ công nghiệp",
  congnghenongnghiep: "Công nghệ nông nghiệp",
  tiengphap: "Tiếng Pháp",
  tiengtrung: "Tiếng Trung",
}

function formatSubjectsVietnamese(subjects: string[]) {
  return subjects.map((subject) => SUBJECT_LABELS[subject] ?? subject).join(" + ")
}

function getMethodLabel(method: string) {
  switch (method) {
    case "100":
      return "Điểm thi THPT"
    case "409":
      return "Chứng chỉ ngoại ngữ + THPT"
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Mã PTXT
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Tên phương thức
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Điểm
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Tổ hợp tốt nhất
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Chứng chỉ dùng
              </th>
              {/* <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Ghi chú
              </th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {methods.map((method) => (
              <tr key={method.method}>
                <td className="px-6 py-6 align-top text-xl font-bold text-slate-900">
                  {method.method}
                </td>

                <td className="px-6 py-6 align-top text-slate-700">
                  {getMethodLabel(method.method)}
                </td>

                <td className="px-6 py-6 align-top">
                  {method.eligible ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                        Đủ điều kiện
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
                        Chưa đủ điều kiện
                    </span>
                  )}
                </td>

                <td className="px-6 py-6 align-top text-2xl font-semibold text-slate-900">
                  {method.scoreDisplay ?? "-"}
                </td>

                <td className="px-6 py-6 align-top">
                  {method.bestCombination ? (
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {method.bestCombination.combination}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 whitespace-nowrap">
                        {formatSubjectsVietnamese(method.bestCombination.subjects)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                <td className="px-6 py-6 align-top">
                  {method.certificateUsed ? (
                    <div>
                      <p className="text-xl font-semibold text-slate-900">
                        {method.certificateUsed.certificateType}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Điểm: {String(method.certificateUsed.rawValue)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                {/* <td className="px-6 py-6 align-top text-slate-600">
                  {method.note ?? "-"}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}