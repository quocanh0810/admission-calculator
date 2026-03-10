import { CombinationCode, Subject } from "@/types/admission"

export const combinations: Record<CombinationCode, Subject[]> = {
  A00: ["toan", "ly", "hoa"],
  A01: ["toan", "ly", "anh"],
  D01: ["toan", "van", "anh"],
  D03: ["toan", "van", "tiengphap"],
  D04: ["toan", "van", "tiengtrung"],
  D07: ["toan", "hoa", "anh"],
  D09: ["toan", "su", "anh"],
  D10: ["toan", "dia", "anh"],
  X25: ["toan", "gdktpl", "anh"],
  X26: ["toan", "tinhoc", "anh"],
  X27: ["toan", "congnghecongnghiep", "anh"],
  X28: ["toan", "congnghenongnghiep", "anh"],
}

export const combinationLabels: Record<CombinationCode, string> = {
  A00: "Toán, Vật lí, Hóa học",
  A01: "Toán, Vật lí, Tiếng Anh",
  D01: "Toán, Ngữ văn, Tiếng Anh",
  D03: "Toán, Ngữ văn, Tiếng Pháp",
  D04: "Toán, Ngữ văn, Tiếng Trung Quốc",
  D07: "Toán, Hóa học, Tiếng Anh",
  D09: "Toán, Lịch sử, Tiếng Anh",
  D10: "Toán, Địa lí, Tiếng Anh",
  X25: "Toán, Giáo dục kinh tế và pháp luật, Tiếng Anh",
  X26: "Toán, Tin học, Tiếng Anh",
  X27: "Toán, Công nghệ công nghiệp, Tiếng Anh",
  X28: "Toán, Công nghệ nông nghiệp, Tiếng Anh",
}