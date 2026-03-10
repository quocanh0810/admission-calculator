import { Major } from "@/types/admission"

export const majors: Major[] = [
  {
    code: "TM01",
    name: "Quản trị kinh doanh (Quản trị kinh doanh)",
    programType: "Chuẩn",
    allowedMethods: ["100", "301", "402", "409", "410", "500"],
    combinations: ["A00", "A01", "D01", "D03", "D04", "D07", "D09", "D10", "X25", "X26", "X27", "X28"],
    benchmark2025: 24,
  },
  {
    code: "TM03",
    name: "Quản trị kinh doanh (Khởi nghiệp và phát triển kinh doanh)",
    programType: "Chuẩn",
    allowedMethods: ["100", "301", "402", "409", "410", "500"],
    combinations: ["A00", "A01", "D01", "D03", "D04", "D07", "D09", "D10", "X25", "X26", "X27", "X28"],
    benchmark2025: 23.2,
  },
  {
    code: "TM04",
    name: "Quản trị khách sạn (Quản trị khách sạn)",
    programType: "Chuẩn",
    allowedMethods: ["100", "301", "402", "409", "410", "500"],
    combinations: ["A00", "A01", "D01", "D03", "D04", "D07", "D09", "D10", "X25", "X26", "X27", "X28"],
    benchmark2025: 23.5,
  },
]