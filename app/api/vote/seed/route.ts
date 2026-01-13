import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { celebrities } from "@/lib/db/schema";

// Sample celebrities data - replace with real data
const sampleCelebrities = [
  {
    name: "أحمد البغدادي",
    image: "/demo.jpg",
    description: "صانع محتوى توعوي متخصص في قضايا البيئة والاستدامة، ساهم في زيادة الوعي البيئي لدى الشباب العراقي.",
    category: "content_creator",
    socialLinks: [
      { type: "instagram" as const, url: "https://instagram.com/" },
      { type: "twitter" as const, url: "https://twitter.com/" },
    ],
  },
  {
    name: "سارة الموسوي",
    image: "/demo.jpg",
    description: "ناشطة بيئية ومؤثرة اجتماعية، تقود حملات تطوعية لتنظيف الأماكن العامة وزراعة الأشجار.",
    category: "influencer",
    socialLinks: [
      { type: "instagram" as const, url: "https://instagram.com/" },
      { type: "youtube" as const, url: "https://youtube.com/" },
    ],
  },
  {
    name: "محمد الكاظمي",
    image: "/demo.jpg",
    description: "رياضي محترف ومحفز للشباب، يدعو للحياة الصحية والنشاط البدني من خلال محتواه المميز.",
    category: "athlete",
    socialLinks: [
      { type: "instagram" as const, url: "https://instagram.com/" },
      { type: "facebook" as const, url: "https://facebook.com/" },
      { type: "tiktok" as const, url: "https://tiktok.com/" },
    ],
  },
  {
    name: "زينب العلي",
    image: "/demo.jpg",
    description: "فنانة ورسامة تستخدم فنها للتوعية بالقضايا البيئية، أقامت معارض فنية متعددة حول الاستدامة.",
    category: "artist",
    socialLinks: [
      { type: "instagram" as const, url: "https://instagram.com/" },
    ],
  },
  {
    name: "علي الحسيني",
    image: "/demo.jpg",
    description: "يوتيوبر متخصص في المحتوى التعليمي والتوعوي، يقدم فيديوهات عن الحياة الصحية والبيئة النظيفة.",
    category: "content_creator",
    socialLinks: [
      { type: "youtube" as const, url: "https://youtube.com/" },
      { type: "twitter" as const, url: "https://twitter.com/" },
    ],
  },
  {
    name: "نور الهاشمي",
    image: "/demo.jpg",
    description: "مغنية وناشطة اجتماعية، تستخدم صوتها وفنها لنشر رسائل إيجابية حول البيئة والمجتمع.",
    category: "singer",
    socialLinks: [
      { type: "instagram" as const, url: "https://instagram.com/" },
      { type: "youtube" as const, url: "https://youtube.com/" },
      { type: "facebook" as const, url: "https://facebook.com/" },
    ],
  },
];

// POST - Seed celebrities (for development only)
export async function POST() {
  try {
    // Check if celebrities already exist
    const existing = await db.select().from(celebrities).limit(1);
    
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "المشاهير موجودون بالفعل" },
        { status: 400 }
      );
    }

    // Insert sample celebrities
    await db.insert(celebrities).values(sampleCelebrities);

    return NextResponse.json({
      success: true,
      message: "تم إضافة المشاهير بنجاح",
      count: sampleCelebrities.length,
    });
  } catch (error) {
    console.error("Error seeding celebrities:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في إضافة البيانات" },
      { status: 500 }
    );
  }
}
