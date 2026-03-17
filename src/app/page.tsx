import ScoreForm from "@/components/score-form"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-3xl whitespace-nowrap">
            Công cụ tính điểm xét tuyển Trường Đại học Thương mại 2026
          </h1>
        </div>
      </section>

      {/* Note */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">
            Lưu ý khi nhập dữ liệu
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            Những mục không có thông tin thì có thể để trống. Hệ thống sẽ chỉ
            tính các phương thức và tổ hợp đủ điều kiện theo dữ liệu đã nhập.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <ScoreForm />
      </section>

    </main>
  )
}