import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Công cụ tính điểm xét tuyển đại học 2026 - TMU",
  description: "Tính điểm xét tuyển các phương thức 100, 402, 409, 410, 500",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}