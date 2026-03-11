"use client"

import { useMemo, useState } from "react"
import ResultCard from "./result-card"
import { CalculationResponse } from "@/types/admission"

const EXAM_SUBJECTS = [
    { key: "toan", label: "Toán" },
    { key: "van", label: "Ngữ văn" },
    { key: "anh", label: "Tiếng Anh" },
    { key: "ly", label: "Vật lý" },
    { key: "hoa", label: "Hóa học" },
    { key: "su", label: "Lịch sử" },
    { key: "dia", label: "Địa lý" },
    { key: "gdktpl", label: "GDKT&PL" },
    { key: "tinhoc", label: "Tin học" },
    { key: "congnghecongnghiep", label: "Công nghệ công nghiệp" },
    { key: "congnghenongnghiep", label: "Công nghệ nông nghiệp" },
  ] as const

  const TRANSCRIPT_410_SUBJECTS = [
    { key: "toan", label: "Toán" },
    { key: "ly", label: "Vật lý" },
    { key: "hoa", label: "Hóa học" },
    { key: "van", label: "Ngữ văn" },
    { key: "su", label: "Lịch sử" },
    { key: "dia", label: "Địa lý" },
    { key: "gdktpl", label: "GDKT&PL" },
    { key: "tinhoc", label: "Tin học" },
    { key: "congnghecongnghiep", label: "Công nghệ công nghiệp" },
    { key: "congnghenongnghiep", label: "Công nghệ nông nghiệp" },
  ] as const

const AWARD_SUBJECT_OPTIONS = [
  { value: "toan", label: "Toán" },
  { value: "ly", label: "Vật lý" },
  { value: "hoa", label: "Hóa học" },
  { value: "anh", label: "Tiếng Anh" },
  { value: "van", label: "Ngữ văn" },
  { value: "su", label: "Lịch sử" },
  { value: "dia", label: "Địa lý" },
  { value: "gdktpl", label: "Giáo dục kinh tế và pháp luật" },
  { value: "tiengphap", label: "Tiếng Pháp" },
  { value: "tiengtrung", label: "Tiếng Trung Quốc" },
  { value: "tinhoc", label: "Tin học" },
] as const

const AWARD_SCOPE_WARNINGS: Record<string, string | null> = {
    toan: null,
    ly: null,
    hoa: null,
    anh: null,
    van: null,
  
    su: "Giải này chỉ áp dụng cho tất cả các CTĐT tiên tiến, song bằng quốc tế và CTĐT định hướng chuyên sâu nghề nghiệp quốc tế. Chương trình chuẩn sẽ không được cộng điểm xét thưởng.",
    dia: "Giải này chỉ áp dụng cho tất cả các CTĐT tiên tiến, song bằng quốc tế và CTĐT định hướng chuyên sâu nghề nghiệp quốc tế. Chương trình chuẩn sẽ không được cộng điểm xét thưởng.",
    gdktpl:
      "Giải này chỉ áp dụng cho tất cả các CTĐT tiên tiến, song bằng quốc tế và CTĐT định hướng chuyên sâu nghề nghiệp quốc tế. Chương trình chuẩn sẽ không được cộng điểm xét thưởng.",
  
    tiengphap:
      "Giải này chỉ áp dụng cho TM42 - Quản trị kinh doanh (Tiếng Pháp thương mại). Các ngành khác sẽ không được cộng điểm xét thưởng.",
  
    tiengtrung:
      "Giải này chỉ áp dụng cho TM40, TM41 - Ngôn ngữ Trung Quốc. Các ngành khác sẽ không được cộng điểm xét thưởng.",
  
    tinhoc:
      "Giải này chỉ áp dụng cho TM31, TM32 - Hệ thống thông tin quản lý (Quản trị hệ thống thông tin), TM39 - Kinh tế số (Phân tích kinh doanh trong môi trường số) và TM51 - Khoa học máy tính (Ứng dụng trí tuệ nhân tạo trong kinh doanh). Các ngành khác sẽ không được cộng điểm xét thưởng.",
  }

const initialPayload: any = {
  graduationYear: 2026,
  priorityScore: 0,
  priorityAreaScore: undefined,
  priorityObjectScore: undefined,
  isSpecializedSchool: false,

  examScores: {
    toan: undefined,
    van: undefined,
    anh: undefined,
    ly: undefined,
    hoa: undefined,
    su: undefined,
    dia: undefined,
    gdktpl: undefined,
    tinhoc: undefined,
    congnghecongnghiep: undefined,
    congnghenongnghiep: undefined,
  },

  transcript10: {
    toan: undefined,
    ly: undefined,
    hoa: undefined,
    van: undefined,
    su: undefined,
    dia: undefined,
    gdktpl: undefined,
    tinhoc: undefined,
    congnghecongnghiep: undefined,
    congnghenongnghiep: undefined,
  },
  
  transcript11: {
    toan: undefined,
    ly: undefined,
    hoa: undefined,
    van: undefined,
    su: undefined,
    dia: undefined,
    gdktpl: undefined,
    tinhoc: undefined,
    congnghecongnghiep: undefined,
    congnghenongnghiep: undefined,
  },
  
  transcript12: {
    toan: undefined,
    ly: undefined,
    hoa: undefined,
    van: undefined,
    su: undefined,
    dia: undefined,
    gdktpl: undefined,
    tinhoc: undefined,
    congnghecongnghiep: undefined,
    congnghenongnghiep: undefined,
  },

  hsa: undefined,
  tsa: undefined,
  sat: undefined,
  act: undefined,

  certificates: {
    ielts: undefined,
    toeflIbt: undefined,
    vstep: undefined,
    aptis: undefined,
    toeic4Skills: undefined,
    hskLevel: undefined,
    hskScore: undefined,
    tcf: undefined,
    delf: undefined,
  },

  awards: [],
}

function InputField({
  label,
  value,
  onChange,
  step = "0.01",
  min = 0,
  max,
  placeholder,
}: {
  label: string
  value: number | string | undefined
  onChange: (value: string) => void
  step?: string
  min?: number
  max?: number
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  )
}

function SelectField({
    label,
    value,
    onChange,
    options,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
    options: readonly { value: string; label: string }[]
  }) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Chọn</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export default function ScoreForm() {
  const [payload, setPayload] = useState<any>(initialPayload)
  const [result, setResult] = useState<CalculationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transcriptYears = useMemo(
    () =>
      [
        { key: "transcript10", label: "Kết quả học tập lớp 10" },
        { key: "transcript11", label: "Kết quả học tập lớp 11" },
        { key: "transcript12", label: "Kết quả học tập lớp 12" },
      ] as const,
    [],
  )

  const hasAward = payload.awards && payload.awards.length > 0

  const selectedAwardSubject = payload.awards?.[0]?.subject
  const awardScopeWarning =
  selectedAwardSubject ? AWARD_SCOPE_WARNINGS[selectedAwardSubject] : null

  function setExamScore(subject: string, value: string) {
    setPayload((prev: any) => ({
      ...prev,
      examScores: {
        ...prev.examScores,
        [subject]: value === "" ? undefined : Number(value),
      },
    }))
  }

  function setTranscriptScore(
    yearKey: "transcript10" | "transcript11" | "transcript12",
    subject: string,
    value: string,
  ) {
    setPayload((prev: any) => ({
      ...prev,
      [yearKey]: {
        ...prev[yearKey],
        [subject]: value === "" ? undefined : Number(value),
      },
    }))
  }

  function setCertificateField(field: string, value: string) {
    setPayload((prev: any) => ({
      ...prev,
      certificates: {
        ...prev.certificates,
        [field]: value === "" ? undefined : Number(value),
      },
    }))
  }

  function toggleAward(enabled: boolean) {
    setPayload((prev: any) => ({
      ...prev,
      awards: enabled
        ? [
            {
              subject: "toan",
              level: "ba",
            },
          ]
        : [],
    }))
  }

  function setAwardSubject(value: string) {
    setPayload((prev: any) => ({
      ...prev,
      awards: [
        {
          ...(prev.awards?.[0] ?? {}),
          subject: value,
          level: prev.awards?.[0]?.level ?? "ba",
        },
      ],
    }))
  }

  function setAwardLevel(value: string) {
    setPayload((prev: any) => ({
      ...prev,
      awards: [
        {
          ...(prev.awards?.[0] ?? {}),
          subject: prev.awards?.[0]?.subject ?? "toan",
          level: value,
        },
      ],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
  
    try {
  
        const requestPayload = {
            ...payload,
            priorityScore:
              (payload.priorityAreaScore ?? 0) + (payload.priorityObjectScore ?? 0),
          }
  
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        setError(data?.error ?? "Có lỗi xảy ra khi tính điểm.")
        setLoading(false)
        return
      }
  
      setResult(data)
  
    } catch {
      setError("Không thể kết nối tới hệ thống tính điểm.")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="1. Điểm thi THPT 2026"
          description="Nhập các môn bạn có điểm thi. Những môn chưa có có thể để trống."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {EXAM_SUBJECTS.map((subject) => (
              <InputField
                key={subject.key}
                label={subject.label}
                value={payload.examScores?.[subject.key]}
                onChange={(value) => setExamScore(subject.key, value)}
                max={10}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
            title="2. Bài thi đánh giá riêng"
            >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InputField
                label="HSA"
                value={payload.hsa}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    hsa: value === "" ? undefined : Number(value),
                    }))
                }
                max={150}
                />

                <InputField
                label="TSA"
                value={payload.tsa}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    tsa: value === "" ? undefined : Number(value),
                    }))
                }
                max={100}
                />

                <InputField
                label="SAT"
                value={payload.sat}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    sat: value === "" ? undefined : Number(value),
                    }))
                }
                max={1600}
                step="1"
                />

                <InputField
                label="ACT"
                value={payload.act}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    act: value === "" ? undefined : Number(value),
                    }))
                }
                max={36}
                step="1"
                />
            </div>
            </SectionCard>

        <SectionCard
          title="3. Điểm học bạ 3 năm lớp 10,11,12 "
          description="Tính phương thức học bạ kết hợp chứng chỉ ngoại ngữ."
        >
          <div className="space-y-6">
            {transcriptYears.map((year) => (
              <div
                key={year.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="mb-4 text-base font-semibold text-slate-800">
                  {year.label}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {TRANSCRIPT_410_SUBJECTS.map((subject) => (
                    <InputField
                      key={`${year.key}-${subject.key}`}
                      label={subject.label}
                      value={payload[year.key]?.[subject.key]}
                      onChange={(value) =>
                        setTranscriptScore(year.key, subject.key, value)
                      }
                      max={10}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
            title="4. Điểm ưu tiên"
            description="Nhập riêng điểm ưu tiên khu vực và điểm ưu tiên đối tượng."
            >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                label="Điểm ưu tiên khu vực"
                value={payload.priorityAreaScore ?? ""}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    priorityAreaScore: value === "" ? undefined : Number(value),
                    }))
                }
                max={1}
                />

                <InputField
                label="Điểm ưu tiên đối tượng"
                value={payload.priorityObjectScore ?? ""}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    priorityObjectScore: value === "" ? undefined : Number(value),
                    }))
                }
                max={2}
                />
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-600">
                Tổng điểm ưu tiên = điểm khu vực + điểm đối tượng
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                {(
                    (payload.priorityAreaScore ?? 0) +
                    (payload.priorityObjectScore ?? 0)
                )
                    .toString()
                    .replace(".", ",")}
                </p>
            </div>
        </SectionCard>

        <SectionCard
            title="5. Chứng chỉ ngoại ngữ"
            description="Nhập các chứng chỉ ngoại ngữ theo đúng bảng quy đổi."
            >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <InputField
                label="IELTS Academic"
                value={payload.certificates?.ielts}
                onChange={(value) => setCertificateField("ielts", value)}
                step="0.5"
                max={9}
                />

                <InputField
                label="TOEFL iBT"
                value={payload.certificates?.toeflIbt}
                onChange={(value) => setCertificateField("toeflIbt", value)}
                step="1"
                max={120}
                />

                <InputField
                label="VSTEP"
                value={payload.certificates?.vstep}
                onChange={(value) => setCertificateField("vstep", value)}
                step="0.5"
                max={10}
                />

                <InputField
                label="APTIS ESOL"
                value={payload.certificates?.aptis}
                onChange={(value) => setCertificateField("aptis", value)}
                step="1"
                max={200}
                />

                <InputField
                label="TCF"
                value={payload.certificates?.tcf}
                onChange={(value) => setCertificateField("tcf", value)}
                step="1"
                max={699}
                />

                <SelectField
                label="DELF"
                value={payload.certificates?.delf ?? ""}
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    certificates: {
                        ...prev.certificates,
                        delf: value === "" ? undefined : value,
                    },
                    }))
                }
                options={[
                    { value: "B1", label: "B1" },
                    { value: "B2", label: "B2" },
                    { value: "C1", label: "C1" },
                    { value: "C2", label: "C2" },
                ]}
                />

                <SelectField
                label="HSK cấp độ"
                value={
                    payload.certificates?.hskLevel != null
                    ? String(payload.certificates.hskLevel)
                    : ""
                }
                onChange={(value) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    certificates: {
                        ...prev.certificates,
                        hskLevel: value === "" ? undefined : Number(value),
                    },
                    }))
                }
                options={[
                    { value: "3", label: "Cấp độ 3" },
                    { value: "4", label: "Cấp độ 4" },
                    { value: "5", label: "Cấp độ 5" },
                    { value: "6", label: "Cấp độ 6" },
                ]}
                />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-800">
                TOEIC 4 kỹ năng
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                    label="Nghe đọc (Listening + Reading)"
                    value={payload.certificates?.toeic4Skills?.listeningReading}
                    onChange={(value) =>
                    setPayload((prev: any) => ({
                        ...prev,
                        certificates: {
                        ...prev.certificates,
                        toeic4Skills: {
                            listeningReading:
                            value === "" ? undefined : Number(value),
                            speakingWriting:
                            prev.certificates?.toeic4Skills?.speakingWriting,
                        },
                        },
                    }))
                    }
                    step="1"
                    max={990}
                />

                <InputField
                    label="Nói viết (Speaking + Writing)"
                    value={payload.certificates?.toeic4Skills?.speakingWriting}
                    onChange={(value) =>
                    setPayload((prev: any) => ({
                        ...prev,
                        certificates: {
                        ...prev.certificates,
                        toeic4Skills: {
                            listeningReading:
                            prev.certificates?.toeic4Skills?.listeningReading,
                            speakingWriting:
                            value === "" ? undefined : Number(value),
                        },
                        },
                    }))
                    }
                    step="1"
                    max={400}
                />
                </div>
            </div>
            </SectionCard>

        <SectionCard
          title="6. Giải học sinh giỏi cấp tỉnh / thành phố"
          description="Nếu có giải, hãy bật mục này và chọn đúng môn đạt giải cùng mức giải."
        >
          <label className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasAward}
              onChange={(e) => toggleAward(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Tôi có giải HSG cấp tỉnh / thành phố
          </label>

          {hasAward ? (
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                    label="Môn đạt giải"
                    value={payload.awards?.[0]?.subject ?? "toan"}
                    onChange={setAwardSubject}
                    options={AWARD_SUBJECT_OPTIONS}
                />
            
                <SelectField
                    label="Mức giải"
                    value={payload.awards?.[0]?.level ?? "ba"}
                    onChange={setAwardLevel}
                    options={[
                    { value: "nhat", label: "Giải Nhất (1.5 điểm)" },
                    { value: "nhi", label: "Giải Nhì (1.25 điểm)" },
                    { value: "ba", label: "Giải Ba (1.0 điểm)" },
                    ]}
                />
                </div>
            
                {awardScopeWarning ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                    {awardScopeWarning}
                </div>
                ) : null}
          </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Thí sinh không có giải thì không chọn mục này.
            </div>
          )}
        </SectionCard>

        <SectionCard
            title="7. Thông tin trường THPT"
            description="Nếu không học trường THPT chuyên / trọng điểm quốc gia vui lòng không chọn mục này"
            >
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                type="checkbox"
                checked={payload.isSpecializedSchool}
                onChange={(e) =>
                    setPayload((prev: any) => ({
                    ...prev,
                    isSpecializedSchool: e.target.checked,
                    }))
                }
                className="h-4 w-4 rounded border-slate-300"
                />
                Tôi học trường THPT chuyên / trọng điểm quốc gia
            </label>
        </SectionCard>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang tính điểm..." : "Tính tất cả phương thức"}
          </button>

          <button
            type="button"
            onClick={() => {
              setPayload(initialPayload)
              setResult(null)
              setError(null)
            }}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đặt lại dữ liệu mẫu
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </form>

      {result ? <ResultCard result={result} /> : null}
    </div>
  )
}