import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { celebrities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Admin key for basic protection (in production, use proper auth)
const ADMIN_KEY = process.env.ADMIN_KEY || "hala-baghdad-admin-2026";

// Validation schema for celebrity
const celebritySchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  image: z.string().min(1, "الصورة مطلوبة"),
  description: z.string().min(10, "الوصف مطلوب"),
  category: z.string().min(1, "التصنيف مطلوب"),
  socialLinks: z
    .array(
      z.object({
        type: z.enum(["instagram", "facebook", "twitter", "youtube", "tiktok"]),
        url: z.string().url("رابط غير صالح"),
      })
    )
    .optional()
    .default([]),
  isActive: z.boolean().optional().default(true),
});

function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-key");
  return authHeader === ADMIN_KEY;
}

// POST - Add new celebrity
export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = celebritySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0]?.message || "بيانات غير صالحة",
        },
        { status: 400 }
      );
    }

    const [newCelebrity] = await db
      .insert(celebrities)
      .values(validation.data)
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "تم إضافة المشهور بنجاح",
        data: newCelebrity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding celebrity:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في إضافة المشهور" },
      { status: 500 }
    );
  }
}

// PUT - Update celebrity
export async function PUT(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المشهور مطلوب" },
        { status: 400 }
      );
    }

    const validation = celebritySchema.partial().safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0]?.message || "بيانات غير صالحة",
        },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(celebrities)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(celebrities.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "المشهور غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث المشهور بنجاح",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating celebrity:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في تحديث المشهور" },
      { status: 500 }
    );
  }
}

// DELETE - Delete celebrity
export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المشهور مطلوب" },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(celebrities)
      .where(eq(celebrities.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "المشهور غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف المشهور بنجاح",
    });
  } catch (error) {
    console.error("Error deleting celebrity:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في حذف المشهور" },
      { status: 500 }
    );
  }
}
