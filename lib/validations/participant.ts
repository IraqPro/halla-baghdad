import { z } from "zod";

// Shared validation schema for both client and server
export const participantSchema = z.object({
  name: z
    .string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(255, "الاسم طويل جداً"),
  phoneNumber: z
    .string()
    .min(10, "رقم الهاتف غير صحيح")
    .max(20, "رقم الهاتف غير صحيح")
    .regex(/^[\d\s\-\+\(\)]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  residence: z
    .string()
    .min(2, "مكان الإقامة مطلوب")
    .max(255, "مكان الإقامة طويل جداً"),
  healthCondition: z
    .string()
    .min(2, "الحالة الصحية مطلوبة")
    .max(255, "الوصف طويل جداً"),
  sportLevel: z
    .string()
    .min(2, "المستوى الرياضي مطلوب")
    .max(100, "الوصف طويل جداً"),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;

// Sport level options
export const sportLevelOptions = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
  { value: "professional", label: "محترف" },
] as const;

// Health condition options
export const healthConditionOptions = [
  { value: "excellent", label: "ممتازة" },
  { value: "good", label: "جيدة" },
  { value: "moderate", label: "متوسطة" },
  { value: "has_conditions", label: "لدي حالات صحية خاصة" },
] as const;

// Iraqi cities for residence
export const iraqiCities = [
  "بغداد",
  "البصرة",
  "الموصل",
  "أربيل",
  "النجف",
  "كربلاء",
  "الحلة",
  "الناصرية",
  "كركوك",
  "السليمانية",
  "الديوانية",
  "العمارة",
  "الكوت",
  "دهوك",
  "الرمادي",
  "بعقوبة",
  "السماوة",
  "تكريت",
  "الفلوجة",
  "أخرى",
] as const;
