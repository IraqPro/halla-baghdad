import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { celebrities, SocialLink } from "@/lib/db/schema";
import { protectApiRoute } from "@/lib/auth/middleware";
import { desc, eq, sql } from "drizzle-orm";

// Social link schema
const socialLinkSchema = z.object({
  type: z.enum(["instagram", "facebook", "twitter", "youtube", "tiktok"]),
  url: z.string().url("رابط غير صالح"),
});

// Custom image validation - accepts URL or local path
const imageSchema = z.string().max(500).refine(
  (val) => {
    // Accept local paths starting with /
    if (val.startsWith("/")) {
      return true;
    }
    // Accept valid URLs
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "رابط الصورة غير صالح" }
);

// Celebrity create/update schema
const celebritySchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً").max(255, "الاسم طويل جداً"),
  image: imageSchema,
  description: z.string().min(10, "الوصف قصير جداً").max(1000, "الوصف طويل جداً"),
  category: z.string().min(2, "التصنيف قصير جداً").max(100, "التصنيف طويل جداً"),
  socialLinks: z.array(socialLinkSchema).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

// GET - List all celebrities with pagination
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await protectApiRoute(request);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(celebrities)
      .where(
        search 
          ? sql`${celebrities.name} ILIKE ${"%" + search + "%"}`
          : undefined
      );

    // Get paginated results
    const results = await db
      .select()
      .from(celebrities)
      .where(
        search 
          ? sql`${celebrities.name} ILIKE ${"%" + search + "%"}`
          : undefined
      )
      .orderBy(desc(celebrities.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error("Get celebrities error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في جلب المشاهير" },
      { status: 500 }
    );
  }
}

// POST - Create new celebrity
export async function POST(request: NextRequest) {
  try {
    // Verify authentication (only admin and super_admin can create)
    const authResult = await protectApiRoute(request, ["admin", "super_admin"]);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Parse and validate body
    const body = await request.json();
    const validation = celebritySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "بيانات غير صالحة",
          details: validation.error.issues.map(issue => issue.message)
        },
        { status: 400 }
      );
    }

    const { name, image, description, category, socialLinks, isActive } = validation.data;

    // Create celebrity
    const [newCelebrity] = await db
      .insert(celebrities)
      .values({
        name,
        image,
        description,
        category,
        socialLinks: socialLinks as SocialLink[],
        isActive,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCelebrity,
      message: "تم إضافة المشهور بنجاح",
    }, { status: 201 });
  } catch (error) {
    console.error("Create celebrity error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في إضافة المشهور" },
      { status: 500 }
    );
  }
}

// PUT - Update celebrity
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await protectApiRoute(request, ["admin", "super_admin"]);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Parse body
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "معرف المشهور مطلوب" },
        { status: 400 }
      );
    }

    // Validate update data
    const validation = celebritySchema.partial().safeParse(updateData);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "بيانات غير صالحة",
          details: validation.error.issues.map(issue => issue.message)
        },
        { status: 400 }
      );
    }

    // Update celebrity
    const [updatedCelebrity] = await db
      .update(celebrities)
      .set({
        ...validation.data,
        socialLinks: validation.data.socialLinks as SocialLink[] | undefined,
        updatedAt: new Date(),
      })
      .where(eq(celebrities.id, id))
      .returning();

    if (!updatedCelebrity) {
      return NextResponse.json(
        { error: "المشهور غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCelebrity,
      message: "تم تحديث المشهور بنجاح",
    });
  } catch (error) {
    console.error("Update celebrity error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في تحديث المشهور" },
      { status: 500 }
    );
  }
}

// DELETE - Delete celebrity
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication (only super_admin can delete)
    const authResult = await protectApiRoute(request, ["super_admin"]);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get celebrity ID from search params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "معرف المشهور مطلوب" },
        { status: 400 }
      );
    }

    // Delete celebrity
    const [deletedCelebrity] = await db
      .delete(celebrities)
      .where(eq(celebrities.id, id))
      .returning();

    if (!deletedCelebrity) {
      return NextResponse.json(
        { error: "المشهور غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف المشهور بنجاح",
    });
  } catch (error) {
    console.error("Delete celebrity error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في حذف المشهور" },
      { status: 500 }
    );
  }
}
