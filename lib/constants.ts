// Navigation Links
export const NAV_LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#activities", label: "الفعاليات" },
  { href: "#marathon", label: "الماراثون" },
  { href: "#partners", label: "الشركاء" },
  { href: "#register", label: "التسجيل" },
] as const;

// Social Media Links
export const SOCIAL_LINKS = [
  { platform: "facebook", url: "https://facebook.com/halabaghdad", label: "فيسبوك" },
  { platform: "instagram", url: "https://instagram.com/halabaghdad", label: "انستغرام" },
  { platform: "twitter", url: "https://twitter.com/halabaghdad", label: "تويتر" },
  { platform: "youtube", url: "https://youtube.com/halabaghdad", label: "يوتيوب" },
] as const;

// Activity Icons mapping
export const ACTIVITY_ICONS: Record<string, string> = {
  parade: "🚶",
  marathon: "🏃",
  martial_arts: "🥋",
  competition: "🏆",
  environmental_campaign: "🌱",
  ceremony: "🎉",
} as const;

// Animation Variants
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
} as const;

export const FADE_IN_DOWN = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
} as const;

export const FADE_IN_LEFT = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
} as const;

export const FADE_IN_RIGHT = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
} as const;

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
} as const;

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

// Stats Data
export const STATS = [
  { value: 3120, label: "مشارك في النسخة السابقة", suffix: "+" },
  { value: 14, label: "بلدية مشاركة", suffix: "" },
  { value: 10000, label: "شجرة ستُزرع", suffix: "" },
  { value: 50, label: "صانع محتوى", suffix: "+" },
] as const;
